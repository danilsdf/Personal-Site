// Safe to import in both server and client components — no secret keys here.

export const MEMBERSHIP_TIERS = {
  Runner: {
    key: "Runner" as const,
    name: "The Runner",
    description: "For people who want to support the journey and be part of the community",
    monthlyAmount: 500,   // $5.00 CAD in cents
    yearlyAmount: 5000,   // $50.00 CAD in cents
    benefits: [
      "Member badge on your profile",
      "Access to private Discord",
      "Community chats, race discussions & Q&A",
      "Exclusive posts & training updates",
      "Supporter role in Discord",
    ],
  },
  HybridAthlete: {
    key: "HybridAthlete" as const,
    name: "Hybrid Athlete",
    description: "For people serious about training smarter while balancing a 9–5",
    monthlyAmount: 1500,  // $15.00 CAD in cents
    yearlyAmount: 15000,  // $150.00 CAD in cents
    benefits: [
      "Everything from previous tier",
      "Access to all meal prep plans & recipes",
      "AI workout generator & meal prep helper",
      "Training structure breakdowns",
      "Recovery & mobility routines",
      "Meal prep systems and nutrition tips"
    ],
  },
  EliteSupporter: {
    key: "EliteSupporter" as const,
    name: "Elite Supporter",
    description: "For people who want maximum access and directly support future content creation",
    monthlyAmount: 3000,  // $30.00 CAD in cents
    yearlyAmount: 30000,  // $300.00 CAD in cents
    benefits: [
      "Everything from previous tiers",
      "Highest supporter role in Discord",
      "Direct support for races, travel content, and future projects",
      "Huge THANK YOU from me (more rewards are coming)",
    ],
  },
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;
export type BillingInterval = "month" | "year";

export const TIER_DISPLAY_NAMES: Record<MembershipTier, string> = {
  Runner: "The Runner",
  HybridAthlete: "Hybrid Athlete",
  EliteSupporter: "Elite Supporter",
};
