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

  // Check if subscription is still active
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
