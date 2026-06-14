import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { getPlanFromPriceId } from "@/lib/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  let event;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Verify webhook signature if secret is configured
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error("Stripe signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Fallback: parse without verification (dev/test only)
      event = JSON.parse(body);
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
    }
  } catch (err) {
    console.error("Webhook parse error:", err.message);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // =============================================
      // CHECKOUT COMPLETED — new subscription created
      // =============================================
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode !== "subscription") break;

        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) {
          console.error("No userId in checkout session metadata");
          break;
        }

        // Retrieve the subscription to get the price/plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = getPlanFromPriceId(priceId);

        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        console.log(`Subscription created: ${userId} → ${plan}`);
        break;
      }

      // =============================================
      // SUBSCRIPTION UPDATED — plan change or renewal
      // =============================================
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = getPlanFromPriceId(priceId);

        // Find user by stripe_customer_id
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (existing) {
          await supabase.from("subscriptions").update({
            plan,
            status: subscription.status,
            stripe_subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq("stripe_customer_id", customerId);

          console.log(`Subscription updated: ${existing.user_id} → ${plan} (${subscription.status})`);
        }
        break;
      }

      // =============================================
      // SUBSCRIPTION DELETED — cancellation
      // =============================================
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        await supabase.from("subscriptions").update({
          plan: "free",
          status: "canceled",
          updated_at: new Date().toISOString(),
        }).eq("stripe_customer_id", customerId);

        console.log(`Subscription canceled for customer: ${customerId}`);
        break;
      }

      default:
        // Unhandled event type — ignore silently
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
