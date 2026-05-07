"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MEMBERSHIP_TIERS, MembershipTier, BillingInterval } from "@/lib/membership-config";

const RUNNER = MEMBERSHIP_TIERS.Runner;
const HYBRID = MEMBERSHIP_TIERS.HybridAthlete;
const ELITE = MEMBERSHIP_TIERS.EliteSupporter;

function formatPrice(cents: number) {
  return `CA$${(cents / 100).toFixed(0)}`;
}

function FeatureCheck({ on }: Readonly<{ on: boolean }>) {
  if (!on) return <span className="text-white/20">—</span>;
  return (
    <svg className="w-4 h-4 text-white/70 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({
  tier,
  interval,
  isHighlighted,
  isLoggedIn,
  currentTier,
  loading,
  onSubscribe,
}: Readonly<{
  tier: (typeof MEMBERSHIP_TIERS)[MembershipTier];
  interval: BillingInterval;
  isHighlighted: boolean;
  isLoggedIn: boolean;
  currentTier: string | null;
  loading: boolean;
  onSubscribe: (tier: MembershipTier, interval: BillingInterval) => void;
}>) {
  const amount = interval === "month" ? tier.monthlyAmount : tier.yearlyAmount;
  const perMonth =
    interval === "year"
      ? Math.round(tier.yearlyAmount / 12)
      : tier.monthlyAmount;
  const isCurrent = currentTier === tier.name;

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border p-8 transition-all",
        isHighlighted
          ? "border-white bg-white text-black"
          : "border-white/15 bg-white/[0.03] text-white",
      ].join(" ")}
    >
      {isHighlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <p
          className={[
            "text-[11px] font-black uppercase tracking-widest mb-2",
            isHighlighted ? "text-black/50" : "text-white/40",
          ].join(" ")}
        >
          {tier.name}
        </p>
        <p
          className={[
            "text-sm leading-snug mb-4",
            isHighlighted ? "text-black/60" : "text-white/50",
          ].join(" ")}
        >
          {tier.description}
        </p>

        <div className="flex items-end gap-1.5">
          <span className="text-5xl font-black leading-none">
            {formatPrice(amount)}
          </span>
          <span
            className={[
              "text-sm font-semibold mb-1",
              isHighlighted ? "text-black/50" : "text-white/40",
            ].join(" ")}
          >
            /{interval === "year" ? "yr" : "mo"}
          </span>
        </div>

        {interval === "year" && (
          <p
            className={[
              "mt-1 text-xs font-semibold",
              isHighlighted ? "text-black/50" : "text-white/40",
            ].join(" ")}
          >
            {formatPrice(perMonth)}/mo · save{" "}
            {Math.round(
              100 - (tier.yearlyAmount / (tier.monthlyAmount * 12)) * 100
            )}
            %
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {tier.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <svg
              className={[
                "w-4 h-4 mt-0.5 shrink-0",
                isHighlighted ? "text-black" : "text-white/70",
              ].join(" ")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span
              className={[
                "text-sm leading-snug",
                isHighlighted ? "text-black/80" : "text-white/70",
              ].join(" ")}
            >
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      {isCurrent && (
        <div
          className={[
            "w-full py-3.5 text-center text-sm font-black uppercase tracking-widest rounded-xl border",
            isHighlighted
              ? "border-black/20 text-black/40"
              : "border-white/10 text-white/30",
          ].join(" ")}
        >
          Current Plan
        </div>
      )}
      {!isCurrent && isLoggedIn && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onSubscribe(tier.key, interval)}
          className={[
            "w-full py-3.5 text-sm font-black uppercase tracking-widest rounded-xl transition disabled:opacity-50",
            isHighlighted
              ? "bg-black text-white hover:bg-black/80"
              : "bg-white text-black hover:bg-white/85",
          ].join(" ")}
        >
          {loading ? "Loading…" : `Get ${tier.name}`}
        </button>
      )}
      {!isCurrent && !isLoggedIn && (
        <Link
          href={`/signup?redirect=/membership`}
          className={[
            "w-full py-3.5 text-center text-sm font-black uppercase tracking-widest rounded-xl transition",
            isHighlighted
              ? "bg-black text-white hover:bg-black/80"
              : "bg-white text-black hover:bg-white/85",
          ].join(" ")}
        >
          Get Started
        </Link>
      )}
    </div>
  );
}

export default function MembershipPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const canceled = searchParams.get("canceled") === "1";

  const [interval, setInterval] = useState<BillingInterval>("month");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.userId) {
          setIsLoggedIn(true);
          setCurrentTier(data.membership?.tier ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = useCallback(
    async (tier: MembershipTier, billingInterval: BillingInterval) => {
      setLoading(true);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier, interval: billingInterval }),
        });
        const data = await res.json();
        if (data.url) {
          globalThis.location.href = data.url;
        } else {
          console.error("[membership] checkout error:", data.error);
          setLoading(false);
        }
      } catch (err) {
        console.error("[membership] fetch error:", err);
        setLoading(false);
      }
    },
    []
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pt-28 pb-16 md:px-10 lg:px-20 text-center">
        <div className="absolute inset-0 bg-[url('/home-page/home-background.png')] bg-cover bg-[75%_center] opacity-20" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            Support & Access
          </p>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl mb-6">
            Membership
          </h1>
          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            Support my journey and get access to exclusive training content,
            tools, and community.
          </p>
        </div>
      </section>

      {/* SUCCESS / CANCELED BANNERS */}
      {success && (
        <div className="px-5 py-4 bg-green-500/10 border-b border-green-500/20 text-center">
          <p className="text-sm font-semibold text-green-400">
            🎉 Welcome! Your membership is now active. Check your profile for
            details.
          </p>
        </div>
      )}
      {canceled && (
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 text-center">
          <p className="text-sm text-white/50">
            Checkout was canceled. No charge was made.
          </p>
        </div>
      )}

      {/* PRICING */}
      <section className="px-5 py-16 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Interval toggle */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              {(["month", "year"] as const).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInterval(i)}
                  className={[
                    "px-5 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition",
                    interval === i
                      ? "bg-white text-black"
                      : "text-white/40 hover:text-white",
                  ].join(" ")}
                >
                  {i === "month" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
            {interval === "year" && (
              <span className="ml-3 text-xs font-black uppercase tracking-widest text-green-400 border border-green-500/30 bg-green-500/10 rounded-full px-2.5 py-1">
                Save up to 17%
              </span>
            )}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              tier={RUNNER}
              interval={interval}
              isHighlighted={false}
              isLoggedIn={isLoggedIn}
              currentTier={currentTier}
              loading={loading}
              onSubscribe={handleSubscribe}
            />
            <PricingCard
              tier={HYBRID}
              interval={interval}
              isHighlighted={true}
              isLoggedIn={isLoggedIn}
              currentTier={currentTier}
              loading={loading}
              onSubscribe={handleSubscribe}
            />
            <PricingCard
              tier={ELITE}
              interval={interval}
              isHighlighted={false}
              isLoggedIn={isLoggedIn}
              currentTier={currentTier}
              loading={loading}
              onSubscribe={handleSubscribe}
            />
          </div>

          {/* Note */}
          <p className="mt-8 text-center text-xs text-white/30">
            All plans renew automatically. Cancel anytime from your profile.
            Payments processed securely by Stripe.
          </p>
        </div>
      </section>

      {/* BENEFITS COMPARISON */}
      <section className="px-5 pb-20 md:px-10 lg:px-20">        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-center">
            What&apos;s Included
          </h2>

          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {[
              { label: "Member badge on profile",                      runner: true,  hybrid: true,  elite: true },
              { label: "Access to private Discord",                    runner: true,  hybrid: true,  elite: true },
              { label: "Community chats, race discussions & Q&A",      runner: true,  hybrid: true,  elite: true },
              { label: "Exclusive posts & training updates",            runner: true,  hybrid: true,  elite: true },
              { label: "Supporter role in Discord",                    runner: true,  hybrid: true,  elite: true },
              { label: "All meal prep plans & recipes",                runner: false, hybrid: true,  elite: true },
              { label: "AI workout generator & meal prep helper",      runner: false, hybrid: true,  elite: true },
              { label: "Training structure breakdowns",                runner: false, hybrid: true,  elite: true },
              { label: "Recovery & mobility routines",                 runner: false, hybrid: true,  elite: true },
              { label: "Meal prep systems & nutrition tips",           runner: false, hybrid: true,  elite: true },
              { label: "Highest supporter role in Discord",            runner: false, hybrid: false, elite: true },
              { label: "Direct support for races & travel content",    runner: false, hybrid: false, elite: true },
              { label: "Huge THANK YOU + exclusive future rewards",    runner: false, hybrid: false, elite: true },
            ].map((row, i) => (
              <div
                key={row.label}
                className={[
                  "grid grid-cols-4 px-6 py-4 text-sm",
                  i % 2 === 0 ? "bg-white/[0.02]" : "",
                ].join(" ")}
              >
                <span className="text-white/70 col-span-1">{row.label}</span>
                <span className="text-center"><FeatureCheck on={row.runner} /></span>
                <span className="text-center"><FeatureCheck on={row.hybrid} /></span>
                <span className="text-center"><FeatureCheck on={row.elite} /></span>
              </div>
            ))}

            {/* Header row */}
            <div className="grid grid-cols-4 px-6 py-3 border-t border-white/10 bg-white/5">
              <span />
              <span className="text-center text-xs font-black uppercase tracking-widest text-white/40">Runner</span>
              <span className="text-center text-xs font-black uppercase tracking-widest text-white">Hybrid</span>
              <span className="text-center text-xs font-black uppercase tracking-widest text-white/40">Elite</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
