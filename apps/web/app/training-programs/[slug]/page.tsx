"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import programsData from "@/app/data/mockedTrainingPrograms.json";

type Day = { day: string; iso: string; dateLabel: string; training: string; run?: string; bold?: boolean };
type Week = { id: number; title: string; subtitle: string; volume: string; days?: Day[] };
type Program = { slug: string; title: string; description: string; duration: string; totalKm: string; goal: string; targetRace?: string; weeks: Week[] };

const PROGRAMS = programsData as Program[];

function getCurrentWeekIndex(weeks: Program["weeks"], todayIso: string): number {
  for (let i = 0; i < weeks.length; i++) {
    const days = weeks[i].days;
    if (!days) continue;
    const first = days[0].iso;
    const last = days.at(-1)?.iso ?? "";
    if (todayIso >= first && todayIso <= last) return i;
  }
  if (todayIso < (weeks[0].days?.[0]?.iso ?? "")) return 0;
  return weeks.length - 1;
}

export default function ProgramPage() {

  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const program = PROGRAMS.find((p) => p.slug === slug);

  if (!program) {
    notFound();
  }

  const [todayIso, setTodayIso] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const iso = new Date().toISOString().split("T")[0];
    setTodayIso(iso);
    setActiveIndex(getCurrentWeekIndex(program.weeks, iso));
  }, [program.weeks]);

  const activeWeek = program.weeks[activeIndex];
  const isCurrentWeek =
    todayIso !== "" && activeIndex === getCurrentWeekIndex(program.weeks, todayIso);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pt-24 pb-10 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[url('/home-page/home-background.png')] bg-cover bg-[75%_center] opacity-45" />

        <div className="relative z-10 max-w-7xl">
          <a
            href="/training-programs"
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 transition hover:text-white/70"
          >
            ← All Programs
          </a>
          <h1 className="max-w-2xl text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
            {program.title}
          </h1>

          <p className="mt-6 max-w-md text-lg uppercase tracking-widest text-white/60">
            {program.description}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 rounded-xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur md:grid-cols-4">
            {[
              [program.duration, "Duration"],
              [program.totalKm, "Total Running"],
              [program.goal, "Goal Time"],
              ...(program.targetRace ? [[program.targetRace, "Target Race"]] : []),
            ].map(([value, label]) => (
              <div key={label} className="border-white/10 md:border-r last:border-r-0">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 px-5 py-8 md:px-10 lg:grid-cols-[260px_1fr] lg:px-20">
        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 lg:flex lg:flex-col lg:overflow-visible lg:rounded-xl lg:border lg:border-white/10 lg:bg-white/[0.03] lg:p-3 lg:pb-3">
            {program.weeks.map((week, index) => {
              const isActive = index === activeIndex;
              const isCurrent =
                todayIso !== "" && index === getCurrentWeekIndex(program.weeks, todayIso);
              return (
                <button
                  key={week.id}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-lg p-3 text-left transition w-full lg:p-4 ${
                    isActive
                      ? "bg-white/10 ring-1 ring-white/20"
                      : "bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  <p className="text-sm font-black uppercase tracking-widest">
                    {week.title}
                    {isCurrent && (
                      <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-white/50">
                        ← now
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/55 hidden lg:block">
                    {week.subtitle}
                  </p>
                </button>
              );
            })}

            <div className="hidden rounded-lg border border-white/10 p-4 lg:block">
              <p className="mb-3 text-xs font-black uppercase tracking-widest">
                Program Overview
              </p>
              <p className="text-sm text-white/70">{program.duration}</p>
              <p className="text-sm text-white/70">{program.totalKm} running</p>
              <p className="text-sm text-white/70">Goal: {program.goal}</p>
              {program.targetRace && (
                <p className="text-sm text-white/70">Race: {program.targetRace}</p>
              )}
              <p className="mt-4 text-xs italic leading-relaxed text-white/45">
                Discipline is doing what needs to be done even when you don't feel
                like doing it.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="space-y-4">
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col gap-1 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black uppercase tracking-wide">
                {activeWeek.title} — {activeWeek.subtitle}
                {isCurrentWeek && (
                  <span className="ml-3 text-sm font-normal normal-case tracking-normal text-white/45">
                    (current week)
                  </span>
                )}
              </h2>
              <p className="text-xs uppercase tracking-widest text-white/55">
                Weekly Volume: {activeWeek.volume}
              </p>
            </div>

            {activeWeek.days ? (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-white/45">
                      <tr>
                        <th className="px-5 py-4">Day</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Training</th>
                        <th className="px-5 py-4 text-right">Run</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeWeek.days.map((row) => {
                        const isToday = row.iso === todayIso;
                        const isPast = todayIso !== "" && row.iso < todayIso;
                        let rowClass = "";
                        if (isToday) { rowClass = "bg-white text-black"; }
                        else if (isPast) { rowClass = "opacity-40"; }
                        return (
                          <tr
                            key={row.iso}
                            className={`border-b border-white/10 last:border-b-0 ${rowClass}`}
                          >
                            <td className={`px-5 py-4 font-bold ${isToday ? "text-black/70" : "text-white/80"}`}>
                              {row.day}
                              {isToday && (
                                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-black/50">
                                  today
                                </span>
                              )}
                            </td>
                            <td className={`px-5 py-4 ${isToday ? "text-black/55" : "text-white/55"}`}>
                              {row.dateLabel}
                            </td>
                            <td className="px-5 py-4 font-medium">
                              {row.bold ? <strong>{row.training}</strong> : row.training}
                            </td>
                            <td className={`px-5 py-4 text-right ${isToday ? "text-black/70" : "text-white/70"}`}>
                              {row.run} km
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-white/10">
                  {activeWeek.days.map((row) => {
                    const isToday = row.iso === todayIso;
                    const isPast = todayIso !== "" && row.iso < todayIso;
                    let cardClass = "";
                    if (isToday) { cardClass = "bg-white text-black"; }
                    else if (isPast) { cardClass = "opacity-40"; }
                    return (
                      <div
                        key={row.iso}
                        className={`flex items-start justify-between gap-3 px-4 py-3.5 ${cardClass}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isToday ? "text-black/55" : "text-white/45"}`}>
                            {row.day} · {row.dateLabel}
                            {isToday && (
                              <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-black/40">
                                today
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-snug ${row.bold ? "font-bold" : "font-medium"}`}>
                            {row.training}
                          </p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold pt-0.5 ${isToday ? "text-black/60" : "text-white/50"}`}>
                          {row.run} km
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="px-5 py-8 text-sm text-white/40">
                No data available for this week yet.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
