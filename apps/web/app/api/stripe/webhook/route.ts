import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, MembershipTier, BillingInterval } from "@/lib/stripe";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const db = await getDb();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(db, subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db.collection("Users").updateOne(
          { stripeCustomerId: subscription.customer as string },
          { $unset: { membership: "" } }
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpsert(
  db: Awaited<ReturnType<typeof import("@/lib/mongodb").getDb>>,
  subscription: Stripe.Subscription
) {
  const tier = (subscription.metadata?.tier ?? "Basic") as MembershipTier;
  const interval = (subscription.metadata?.interval ?? "month") as BillingInterval;

  await db.collection("Users").updateOne(
    { stripeCustomerId: subscription.customer as string },
    {
      $set: {
        membership: {
          tier,
          status: subscription.status,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          interval,
        },
      },
    }
  );
}
