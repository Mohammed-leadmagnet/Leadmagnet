import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN = {
  [process.env.STRIPE_STARTER_PRICE_ID]: "starter",
  [process.env.STRIPE_PRO_PRICE_ID]: "pro",
  [process.env.STRIPE_AGENCY_PRICE_ID]: "agency",
  [process.env.STRIPE_SCALE_PRICE_ID]: "scale",
};

// Plan hierarchy for access checks
const PLAN_LEVELS = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
  scale: 4,
};

export function getPlanFromPriceId(priceId) {
  return PRICE_TO_PLAN[priceId] || "free";
}

export async function getUserSubscription(userId) {
  if (!userId) return { plan: "free", status: "none" };

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return { plan: "free", status: "none" };

  if (data.status === "active" || data.status === "trialing") {
    return {
      plan: data.plan || "free",
      status: data.status,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end,
    };
  }

  return { plan: "free", status: data.status };
}

export async function hasAgencyAccess(userId) {
  const sub = await getUserSubscription(userId);
  return PLAN_LEVELS[sub.plan] >= PLAN_LEVELS["agency"];
}

export async function hasScaleAccess(userId) {
  const sub = await getUserSubscription(userId);
  return PLAN_LEVELS[sub.plan] >= PLAN_LEVELS["scale"];
}

export async function hasPlanAccess(userId, requiredPlan) {
  const sub = await getUserSubscription(userId);
  return PLAN_LEVELS[sub.plan] >= PLAN_LEVELS[requiredPlan];
}

// =============================================
// LEAD RADAR CREDITS
// =============================================

const SCALE_MONTHLY_CREDITS = 2000;

export async function getLeadRadarCredits(userId) {
  // Check if reset is needed
  const { data: credits } = await supabase
    .from("lead_radar_credits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!credits) {
    // Create initial credits row
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    resetDate.setDate(1);

    const { data: newCredits } = await supabase
      .from("lead_radar_credits")
      .insert({
        user_id: userId,
        plan: "scale",
        monthly_limit: SCALE_MONTHLY_CREDITS,
        used_this_month: 0,
        reset_date: resetDate.toISOString().split("T")[0],
      })
      .select()
      .single();

    return newCredits;
  }

  // Auto-reset if past reset date
  const today = new Date().toISOString().split("T")[0];
  if (credits.reset_date && today >= credits.reset_date) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1);

    const { data: resetCredits } = await supabase
      .from("lead_radar_credits")
      .update({
        used_this_month: 0,
        reset_date: nextReset.toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    return resetCredits;
  }

  return credits;
}

export async function consumeLeadRadarCredits(userId, amount = 1) {
  const credits = await getLeadRadarCredits(userId);

  if (!credits) return { success: false, error: "Credits not found" };

  const remaining = credits.monthly_limit - credits.used_this_month;
  if (remaining < amount) {
    return { success: false, error: "Credits exceeded", remaining: 0 };
  }

  const { data: updated } = await supabase
    .from("lead_radar_credits")
    .update({
      used_this_month: credits.used_this_month + amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  return {
    success: true,
    remaining: updated.monthly_limit - updated.used_this_month,
    used: updated.used_this_month,
    limit: updated.monthly_limit,
  };
}
