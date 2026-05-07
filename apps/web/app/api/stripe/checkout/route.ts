import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { stripe, MEMBERSHIP_TIERS, MembershipTier, BillingInterval } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { tier, interval } = (await req.json()) as {
      tier?: string;
      interval?: string;
    };

    if (!tier || !(tier in MEMBERSHIP_TIERS)) {
      return NextResponse.json({ error: "Invalid membership tier." }, { status: 400 });
    }
    if (!interval || (interval !== "month" && interval !== "year")) {
      return NextResponse.json({ error: "Invalid billing interval." }, { status: 400 });
    }

    const tierConfig = MEMBERSHIP_TIERS[tier as MembershipTier];
    const priceId = tierConfig.prices[interval as BillingInterval];

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured for this tier/interval." },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const db = await getDb();
    const user = await db.collection("Users").findOne({ email: payload.email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let stripeCustomerId: string = user.stripeCustomerId ?? "";
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId: payload.userId },
      });
      stripeCustomerId = customer.id;
      await db
        .collection("Users")
        .updateOne({ email: payload.email }, { $set: { stripeCustomerId } });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/membership?success=1`,
      cancel_url: `${baseUrl}/membership?canceled=1`,
      subscription_data: {
        metadata: {
          userId: payload.userId,
          tier,
          interval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
