import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Score weights
const WEIGHTS = { fit: 0.4, intent: 0.3, contactability: 0.2, freshness: 0.1 };

function getTemperature(score) {
  if (score >= 80) return "hot";
  if (score >= 50) return "warm";
  return "cold";
}

function matchesAny(value, targets) {
  if (!value || !targets || targets.length === 0) return false;
  const v = value.toLowerCase();
  return targets.some(t => v.includes(t.toLowerCase()) || t.toLowerCase().includes(v));
}

function scoreFit(lead, icp) {
  if (!icp) return { score: 50, reasons: ["No ICP defined — using default score"] };

  let score = 0;
  let max = 0;
  const reasons = [];

  // Industry match (25 pts)
  max += 25;
  if (icp.target_industries?.length > 0 && lead.industry) {
    if (matchesAny(lead.industry, icp.target_industries)) {
      score += 25;
      reasons.push(`Industry match: ${lead.industry}`);
    }
    if (matchesAny(lead.industry, icp.excluded_industries || [])) {
      score -= 15;
      reasons.push(`Excluded industry: ${lead.industry}`);
    }
  } else {
    score += 12; // neutral
  }

  // Title match (25 pts)
  max += 25;
  if (icp.job_titles?.length > 0 && lead.title) {
    if (matchesAny(lead.title, icp.job_titles)) {
      score += 25;
      reasons.push(`Title match: ${lead.title}`);
    }
    if (matchesAny(lead.title, icp.excluded_titles || [])) {
      score -= 15;
      reasons.push(`Excluded title: ${lead.title}`);
    }
  } else if (lead.title) {
    const seniorTitles = ["ceo", "cmo", "cto", "founder", "director", "vp", "head", "owner", "partner", "president"];
    if (seniorTitles.some(t => lead.title.toLowerCase().includes(t))) {
      score += 20;
      reasons.push(`Senior title detected: ${lead.title}`);
    } else {
      score += 10;
    }
  }

  // Location match (20 pts)
  max += 20;
  if (icp.target_locations?.length > 0 && lead.location) {
    if (matchesAny(lead.location, icp.target_locations)) {
      score += 20;
      reasons.push(`Location match: ${lead.location}`);
    } else {
      score += 5;
    }
  } else {
    score += 10;
  }

  // Keyword match (15 pts)
  max += 15;
  if (icp.keywords?.length > 0) {
    const leadText = `${lead.title || ""} ${lead.company || ""} ${lead.industry || ""}`.toLowerCase();
    const matches = icp.keywords.filter(k => leadText.includes(k.toLowerCase()));
    if (matches.length > 0) {
      score += Math.min(15, matches.length * 5);
      reasons.push(`Keyword matches: ${matches.join(", ")}`);
    }
  } else {
    score += 7;
  }

  // Competitor match (15 pts)
  max += 15;
  if (icp.competitors?.length > 0 && lead.company) {
    if (matchesAny(lead.company, icp.competitors)) {
      score += 15;
      reasons.push(`Competitor company: ${lead.company}`);
    }
  } else {
    score += 7;
  }

  const normalized = max > 0 ? Math.round(Math.max(0, Math.min(100, (score / max) * 100))) : 50;
  return { score: normalized, reasons };
}

function scoreIntent(lead) {
  let score = 0;
  const reasons = [];

  // Source type scoring
  const highIntent = ["campaign_engagement", "gmail_interaction"];
  const medIntent = ["csv_upload", "crm_import", "existing_lead"];
  const lowIntent = ["manual_entry", "public_business_signal", "other"];

  if (highIntent.includes(lead.source_type)) {
    score += 50;
    reasons.push(`High-intent source: ${lead.source_type.replace(/_/g, " ")}`);
  } else if (medIntent.includes(lead.source_type)) {
    score += 30;
    reasons.push(`Medium-intent source: ${lead.source_type.replace(/_/g, " ")}`);
  } else {
    score += 15;
    reasons.push(`Source: ${(lead.source_type || "unknown").replace(/_/g, " ")}`);
  }

  // Has company = more intent signals
  if (lead.company) { score += 15; reasons.push("Company data available"); }
  if (lead.title) { score += 15; reasons.push("Job title available"); }
  if (lead.email) { score += 10; reasons.push("Email available"); }
  if (lead.linkedin_url) { score += 10; reasons.push("LinkedIn profile available"); }

  return { score: Math.min(100, score), reasons };
}

function scoreContactability(lead) {
  let score = 0;
  const reasons = [];

  if (lead.email) { score += 30; reasons.push("Email available"); }
  if (lead.linkedin_url) { score += 25; reasons.push("LinkedIn available"); }
  if (lead.website || lead.company_domain) { score += 20; reasons.push("Website/domain available"); }
  if (lead.instagram_handle) { score += 10; reasons.push("Instagram available"); }
  if (lead.company) { score += 10; reasons.push("Company known"); }
  if (lead.location) { score += 5; reasons.push("Location known"); }

  if (score === 0) reasons.push("No contact data available");

  return { score: Math.min(100, score), reasons };
}

function scoreFreshness(lead) {
  const reasons = [];
  const created = new Date(lead.created_at);
  const daysSince = Math.floor((Date.now() - created.getTime()) / 86400000);

  let score;
  if (daysSince <= 7) {
    score = 100;
    reasons.push("Discovered within last 7 days");
  } else if (daysSince <= 30) {
    score = 70;
    reasons.push("Discovered within last 30 days");
  } else if (daysSince <= 90) {
    score = 40;
    reasons.push("Discovered within last 90 days");
  } else {
    score = 15;
    reasons.push(`Discovered ${daysSince} days ago`);
  }

  return { score, reasons };
}

export function calculateLeadScore(lead, icp) {
  const fit = scoreFit(lead, icp);
  const intent = scoreIntent(lead);
  const contactability = scoreContactability(lead);
  const freshness = scoreFreshness(lead);

  const totalScore = Math.round(
    fit.score * WEIGHTS.fit +
    intent.score * WEIGHTS.intent +
    contactability.score * WEIGHTS.contactability +
    freshness.score * WEIGHTS.freshness
  );

  const temperature = getTemperature(totalScore);

  const allReasons = {
    fit: fit.reasons,
    intent: intent.reasons,
    contactability: contactability.reasons,
    freshness: freshness.reasons,
  };

  let recommendedAction = "";
  if (temperature === "hot") {
    recommendedAction = "Prioritize for outreach — this lead is a strong match.";
  } else if (temperature === "warm") {
    recommendedAction = "Add to nurture sequence — worth following up.";
  } else {
    recommendedAction = "Save for later or review data for accuracy.";
  }

  return {
    total_score: totalScore,
    temperature,
    fit_score: fit.score,
    intent_score: intent.score,
    contactability_score: contactability.score,
    freshness_score: freshness.score,
    reasons: allReasons,
    recommended_action: recommendedAction,
  };
}

export function validateCSVRow(row) {
  const errors = [];
  if (!row.name && !row.first_name && !row.last_name) {
    errors.push("Name is required");
  }
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push("Invalid email format");
  }
  if (row.linkedin_url && !row.linkedin_url.includes("linkedin.com")) {
    errors.push("Invalid LinkedIn URL");
  }
  return errors;
}
