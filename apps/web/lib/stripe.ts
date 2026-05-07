import Stripe from "stripe";
import { MembershipTier, BillingInterval } from "@/lib/membership-config";

export { MEMBERSHIP_TIERS } from "@/lib/membership-config";
export type { MembershipTier, BillingInterval } from "@/lib/membership-config";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Please add STRIPE_SECRET_KEY to .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

export const STRIPE_PRICE_IDS: Record<MembershipTier, Record<BillingInterval, string>> = {
  Runner: {
    month: process.env.STRIPE_RUNNER_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_RUNNER_YEARLY_PRICE_ID!,
  },
  HybridAthlete: {
    month: process.env.STRIPE_HYBRID_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_HYBRID_YEARLY_PRICE_ID!,
  },
  EliteSupporter: {
    month: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_ELITE_YEARLY_PRICE_ID!,
  },
};

export type MembershipData = {
  tier: MembershipTier;
  status: "active" | "trialing" | "canceled" | "past_due" | "unpaid";
  stripeSubscriptionId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  interval: BillingInterval;
};
