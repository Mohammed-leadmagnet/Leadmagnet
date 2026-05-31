import Stripe from "stripe";

const stripe = new Stripe("sk_test_51TVUCcDeNM7EDvOY2QU23ZDAY7I1cEGaQyPbjyB87ZJwMKJGZHuXvuD4HqO9pakoBdLl4D38YCS1VIuGzTcbW63b00GK3YL3a7");

export async function POST(request) {
  try {
    const { priceId, userEmail } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
