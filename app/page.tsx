// app/page.tsx
"use client"

import LogLine from "@/components/LogRow";
import Link from "next/link";

type ToolLink = {
  href: string;
  label: string;
  description: string;
  icon?: string;
};

const toolLinks: ToolLink[] = [
  {
    href: "/tools/calories-calculator",
    label: "Calories Calculator",
    description: "Dial in calories and macros for hybrid training.",
    icon: "🍽️",
  },
  {
    href: "/tools/meal-plan-generator",
    label: "Meal Plans",
    description: "Auto-generate weekly meal prep based on your macros.",
    icon: "📆",
  },
  {
    href: "/tools/training-templates",
    label: "Training Templates",
    description: "Ready-to-use hybrid training week templates.",
    icon: "📑",
  },
  {
    href: "/tools/workout-generator",
    label: "Workout Gen",
    description: "Build structured gym sessions around your goals.",
    icon: "🏋️‍♂️",
  },
];

import { useEffect, useState } from "react";

export default function HomePage() {
  const [latestActivities, setLatestActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/strava/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.activities)) {
          setLatestActivities(data.activities.slice(0, 3));
        }
      });
  }, []);

    return (
      <main className="mt-10 flex-1 space-y-12 md:mt-16">
          {/* HERO */}
          <section className="text-center">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d2a852]">
              Hybrid Athlete
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl text-black dark:text-white">
              Danil Kravchenko
            </h1>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70 sm:text-base">
              Hybrid athlete. Built on strength &amp; endurance.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/training-logs"
                className="rounded-full bg-black/10 dark:bg-white px-5 py-2 text-xs font-semibold text-black dark:text-[#0f1418] shadow-sm transition hover:bg-[#d2a852] dark:hover:bg-[#f0c46a]"
              >
                View training profile
              </Link>
            </div>
          </section>

          {/* QUICK ACCESS CARDS: Recipes / Training Logs / Drills */}
          <section aria-label="Quick sections">
            <div className="grid gap-4 md:grid-cols-3">
              <QuickCard
                href="/recipes"
                title="Recipes"
                subtitle="Meal prep that fuels double sessions."
                image="/meal-prep-main.png"
              />
              <QuickCard
                href="/training-logs"
                title="Training Logs"
                subtitle="Track runs, boxing, gym & hybrid days."
                image="/training-log-main.png"
              />
              <QuickCard
                href="/drills"
                title="Drills"
                subtitle="Favourite running, boxing & strength drills."
                image="/training-drills-main.png"
              />
            </div>
          </section>

          {/* WEEKLY CALENDAR + PR LEADERBOARD */}
          <section
            aria-label="Calendars and PRs"
            className="grid gap-4 md:grid-cols-2"
          >
            <InfoCard
              title="Weekly calendars"
              description="See the full hybrid week: runs, boxing, gym & recovery scheduled around a 9–5."
              href="/weekly-calendar"
              linkLabel="View calendar"
            />
            <InfoCard
              title="PR leaderboard"
              description="Track your best 5K, 10K, half-marathon and key lifting numbers in one place."
              href="/leaderboard"
              linkLabel="View PRs"
            />
          </section>

          {/* TOOLS ROW */}
          <section aria-label="Tools">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black/80 dark:text-white/80">
                Tools
              </h2>
              <Link
                href="/tools"
                className="text-xs text-[#d2a852] hover:text-[#f0c46a]"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3 transition hover:border-[#d2a852] hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {tool.icon && (
                      <span className="text-base leading-none">
                        {tool.icon}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-black/80 dark:text-white/80">
                      {tool.label}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-black/65 dark:text-white/65">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* FEATURED RECIPES */}
          <section aria-label="Featured recipes" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black/80 dark:text-white/80">
                Featured Recipes
              </h2>
              <Link
                href="/recipes"
                className="text-xs text-[#d2a852] hover:text-[#f0c46a]"
              >
                View all
              </Link>
            </div>

            {/* Placeholder list – replace with real data later */}
            <div className="space-y-2 text-xs text-black/70 dark:text-white/70">
              <RecipeRow
                title="Rice noodles with teriyaki chicken"
                meta="800 kcal • 55P / 95C / 18F"
              />
              <RecipeRow
                title="Bulgur with mushrooms & beef"
                meta="775 kcal • 48P / 65C / 25F"
              />
            </div>
          </section>

          {/* LATEST TRAINING LOGS */}
          <section aria-label="Latest training logs" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-black/80 dark:text-white/80">
                Latest Training Logs
              </h2>
              <Link
                href="/training-logs"
                className="text-xs text-[#d2a852] hover:text-[#f0c46a]"
              >
                View all
              </Link>
            </div>

            <div className="space-y-2 text-xs text-black/70 dark:text-white/70">
              {latestActivities.length === 0 ? (
                <div className="text-black/40 dark:text-white/40">No recent activities found.</div>
              ) : (
                latestActivities.map((activity) => (
                  <LogLine
                    key={activity.id || activity.name || activity.title}
                    activity={activity}
                  />
                ))
              )}
            </div>
          </section>
        </main>
  );
}

type InfoCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

function InfoCard({ title, description, href, linkLabel }: InfoCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-xs text-black/75 dark:text-white/75">
      <div>
        <h3 className="text-sm font-semibold text-black dark:text-white">{title}</h3>
        <p className="mt-2 leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#d2a852] hover:text-[#f0c46a]"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

type QuickCardProps = {
  href: string;
  title: string;
  subtitle: string;
  image?: string;
};

function QuickCard({ href, title, subtitle, image }: QuickCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-xs text-black/75 dark:text-white/75 transition hover:border-[#d2a852] hover:bg-black/10 dark:hover:bg-white/10"
    >
      <div>
        {image ? (
          <img
            src={image}
            alt={title}
            className="mb-3 h-28 w-full object-cover rounded-xl"
            loading="lazy"
          />
        ) : (
          <div className="mb-3 h-28 rounded-xl bg-black/5 dark:bg-white/5" />
        )}
        <h3 className="text-sm font-semibold text-black dark:text-white">{title}</h3>
        <p className="mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </Link>
  );
}

function RecipeRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2">
      <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
      <div>
        <div className="text-[11px] font-semibold text-black dark:text-white">{title}</div>
        <div className="text-[10px] text-black/60 dark:text-white/60">{meta}</div>
      </div>
    </div>
  );
}
