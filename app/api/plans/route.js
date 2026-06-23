import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pricing_plans")
      .select(
        "id, plan_key, name, display_price, period, description, features, popular, active, sort_order, stripe_price_id"
      )
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ plans: [] }, { status: 200 });
    }

    return NextResponse.json({
      plans: (data || []).map(plan => ({
        id: plan.id,
        plan_key: plan.plan_key,
        planKey: plan.plan_key,
        name: plan.name,
        display_price: plan.display_price,
        price: plan.display_price,
        period: plan.period,
        description: plan.description,
        desc: plan.description,
        features: Array.isArray(plan.features) ? plan.features : [],
        popular: plan.popular,
        active: plan.active,
        sort_order: plan.sort_order,
        stripe_price_id: plan.stripe_price_id,
      })),
    });
  } catch {
    return NextResponse.json({ plans: [] }, { status: 200 });
  }
}