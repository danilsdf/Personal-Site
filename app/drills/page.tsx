"use client";

import { useState } from "react";
import Link from "next/link";

type DrillCategory = "running" | "boxing" | "strength_mobility";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type Drill = {
  title: string;
  category: DrillCategory;
  difficulty: Difficulty;
  slug: string;
};

const drills: Drill[] = [
  { title: "Running Form Drill", category: "running", difficulty: "Beginner", slug: "running-form-drill" },
  { title: "Stride Syncs", category: "running", difficulty: "Intermediate", slug: "stride-syncs" },
  { title: "Tempo Change Intervals", category: "running", difficulty: "Advanced", slug: "tempo-change-intervals" },
  { title: "Boxing Slip & Roll", category: "boxing", difficulty: "Beginner", slug: "boxing-slip-roll" },
  { title: "Combo Defense", category: "boxing", difficulty: "Intermediate", slug: "combo-defense" },
  { title: "Ladder Combos", category: "boxing", difficulty: "Advanced", slug: "ladder-combos" },
  { title: "Mobility Routine", category: "strength_mobility", difficulty: "Beginner", slug: "mobility-routine" },
  { title: "Core & Hips Flow", category: "strength_mobility", difficulty: "Intermediate", slug: "core-hips-flow" },
  { title: "Strength Ladder", category: "strength_mobility", difficulty: "Advanced", slug: "strength-ladder" },
];

const categories: { id: DrillCategory; label: string }[] = [
  { id: "running", label: "Running" },
  { id: "boxing", label: "Boxing" },
  { id: "strength_mobility", label: "Strength & Mobility" },
];

export default function DrillsHubPage() {
  const [activeCategory, setActiveCategory] = useState<DrillCategory>("running");

  const filteredDrills = drills.filter((d) => d.category === activeCategory);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-black dark:text-white">
      {/* TITLE */}
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-black dark:text-white">
          Drills Hub
        </h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Explore running, boxing, and mobility drills.
        </p>
      </section>

      {/* CATEGORY TABS */}
      <section className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-1 text-xs">
          {categories.map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-1 font-medium transition ${
                  active
                    ? "bg-[#d2a852] text-black dark:bg-[#f0c46a] dark:text-[#23232a]"
                    : "text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="mb-12 grid gap-6 sm:grid-cols-3">
        <FeatureCard
          title="Running drills."
          description="Boost speed, form, and focused running sessions."
        />
        <FeatureCard
          title="Boxing combos."
          description="Sharpen reactions and technique through step-by-step building combos."
        />
        <FeatureCard
          title="Strength & mobility."
          description="Increase power and control with functional, progressive drills."
        />
      </section>

      {/* DRILL LIST (FILTERED) */}
      <section className="mt-6">
        {filteredDrills.map((drill) => (
          <DrillListItem
            key={drill.title}
            title={drill.title}
            difficulty={drill.difficulty}
            slug={drill.slug}
          />
        ))}
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 sm:p-5">
      <div className="mb-4 h-28 w-full rounded-xl bg-black/10 dark:bg-white/10" />
      <h3 className="text-sm font-semibold text-black dark:text-white">{title}</h3>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">{description}</p>
    </div>
  );
}

function DrillListItem({
  title,
  difficulty,
  slug,
}: {
  title: string;
  difficulty: Difficulty;
  slug: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 py-3 text-sm">
      <div className="flex items-center gap-3">
        <Link
          href={`/drills/${slug}`}
          className="text-xs font-medium text-black/60 dark:text-white/60 hover:text-[#d2a852] dark:hover:text-[#f0c46a]"
        >
          <span className="text-black dark:text-white">{title}</span>
        </Link>
        <span className="rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-black/70 dark:text-white/70">
          {difficulty}
        </span>
      </div>
      <Link
        href={`/drills/${slug}`}
        className="text-xs font-medium text-black/60 dark:text-white/60 hover:text-[#d2a852] dark:hover:text-[#f0c46a]"
      >
        Steps + Video →
      </Link>
    </div>
  );
}
