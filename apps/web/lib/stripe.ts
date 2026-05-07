import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Please add STRIPE_SECRET_KEY to .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export const MEMBERSHIP_TIERS = {
  Basic: {
    name: "Basic",
    description: "Support my journey and unlock exclusive content",
    prices: {
      month: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID!,
      year: process.env.STRIPE_BASIC_YEARLY_PRICE_ID!,
    },
    monthlyAmount: 999, // $9.99 in cents
    yearlyAmount: 9900, // $99.00 in cents
    benefits: [
      "Member badge on your profile",
      "Access to exclusive training programs",
      "Exclusive posts & training updates",
      "Private Discord channel access",
    ],
  },
  Pro: {
    name: "Pro",
    description: "Full access to all tools, content, and coaching",
    prices: {
      month: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      year: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    },
    monthlyAmount: 2499, // $24.99 in cents
    yearlyAmount: 24900, // $249.00 in cents
    benefits: [
      "Everything in Basic",
      "Access to all meal prep plans & recipes",
      "AI workout generator & meal prep helper",
      "Exclusive in-depth content",
      "Priority support & direct contact",
    ],
  },
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;
export type BillingInterval = "month" | "year";

export type MembershipData = {
  tier: MembershipTier;
  status: "active" | "trialing" | "canceled" | "past_due" | "unpaid";
  stripeSubscriptionId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  interval: BillingInterval;
};
