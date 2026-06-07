import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  agency: process.env.STRIPE_AGENCY_PRICE_ID,
};

export async function POST(request) {
  try {
    const { plan, userId, email } = await request.json();
    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { userId, plan },
      success_url: "https://leadmagnetinc.com/dashboard?subscribed=true",
      cancel_url: "https://leadmagnetinc.com/pricing",
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId, plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}