"use client";

import { useState } from "react";
import Link from "next/link";
import programsData from "@/app/data/mockedTrainingPrograms.json";

type Program = { slug: string; title: string; description: string; duration: string; totalKm: string; goal: string; targetRace?: string; tags: string[]; weeks: unknown[] };

const PROGRAMS = programsData as Program[];

const ALL_FILTERS = ["marathon", "running", "fat loss", "gain weight"] as const;
type Filter = (typeof ALL_FILTERS)[number];

export default function TrainingProgramsPage() {
  const [active, setActive] = useState<Filter | null>(null);

  const filtered = active
    ? PROGRAMS.filter((p) => p.tags.includes(active))
    : PROGRAMS;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pt-24 pb-10 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[url('/home-page/home-background.png')] bg-cover bg-[75%_center] opacity-45" />
        <div className="relative z-10 max-w-7xl">
          <h1 className="max-w-2xl text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
            Training Programs
          </h1>
          <p className="mt-6 max-w-md text-lg uppercase tracking-widest text-white/60">
            Pick a program. Follow the plan. Show up every day.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-white/10 px-5 py-4 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActive(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition ${
              active === null
                ? "bg-white text-black"
                : "border border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
            }`}
          >
            All
          </button>
          {ALL_FILTERS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(active === tag ? null : tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition ${
                active === tag
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* PROGRAMS LIST */}
      <section className="px-5 py-8 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
          {filtered.map((program, i) => (
            <Link
              key={program.slug}
              href={`/training-programs/${program.slug}`}
              className="group flex items-start gap-4 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.07] sm:items-center sm:gap-6 sm:px-6 sm:py-5"
            >
              <span className="shrink-0 w-5 pt-0.5 text-xs font-black text-white/20 group-hover:text-white/40 sm:w-6 sm:text-sm sm:pt-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-black uppercase tracking-tight sm:text-base">
                  {program.title}
                </p>
                <p className="mt-0.5 text-xs text-white/45 line-clamp-2 sm:truncate sm:line-clamp-none">
                  {program.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {program.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Mobile stats */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 sm:hidden">
                  <span className="text-xs text-white/50">{program.duration}</span>
                  <span className="text-xs text-white/50">{program.totalKm}</span>
                  <span className="text-xs text-white/50">Goal: {program.goal}</span>
                  {program.targetRace && (
                    <span className="text-xs text-white/50">{program.targetRace}</span>
                  )}
                </div>
              </div>

              {/* Desktop stats */}
              <div className="hidden sm:flex items-center gap-8 shrink-0 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Duration</p>
                  <p className="text-sm font-bold">{program.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Volume</p>
                  <p className="text-sm font-bold">{program.totalKm}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Goal</p>
                  <p className="text-sm font-bold">{program.goal}</p>
                </div>
                {program.targetRace && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Race</p>
                    <p className="text-sm font-bold">{program.targetRace}</p>
                  </div>
                )}
              </div>

              <span className="shrink-0 text-white/25 transition group-hover:text-white/70 text-lg leading-none pt-0.5 sm:pt-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
