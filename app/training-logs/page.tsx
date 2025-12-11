"use client";

import { useEffect, useState } from "react";
import { isToday, isYesterday, isThisWeek, parseISO, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import type { Day } from "date-fns";


function getSportTypeLabel(sportType: string): string {
  if (!sportType) return "Other";
  return sportType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function LogLine({ activity }: { activity: any }) {
  const sportLabel = getSportTypeLabel(activity.sport_type);
  return (
    <a
      href={`https://www.strava.com/activities/${activity.id}`}
      className="block group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center justify-between border-b border-white/10 py-3 px-2 hover:bg-[#18181b] bg-white/2 transition rounded-xl shadow-sm group-hover:shadow-lg group-hover:border-[#d2a852]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
          <span className="truncate font-semibold text-white text-base min-w-0 max-w-xs group-hover:text-[#d2a852]">
            {activity.name}
          </span>
          <span className="truncate text-xs text-white/60 max-w-xs">{sportLabel}</span>
          <span className="text-xs text-[#d2a852] font-semibold whitespace-nowrap bg-[#d2a852]/10 rounded px-2 py-0.5">
            {activity.distance > 0 ? (activity.distance / 1000).toFixed(2) + ' km' : ''}
          </span>
          <span className="text-xs text-white/60 whitespace-nowrap">
            {activity.moving_time ? Math.round(activity.moving_time / 60) + ' min' : ''}
          </span>
          <span className="text-xs text-white/40 whitespace-nowrap">
            {activity.start_date ? new Date(activity.start_date).toLocaleString() : ''}
          </span>
        </div>
        <span className="text-xs text-[#d2a852] ml-2 group-hover:scale-125 transition-transform">↗</span>
      </div>
    </a>
  );
}


export default function TrainingLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strava/activities")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.activities || []);
        setUpdated(data.updated || null);
        setLoading(false);
      });
  }, []);

  // Helper for last week
  function isLastWeek(date: Date, options?: { weekStartsOn?: number }) {
    const weekStartsOn = (options?.weekStartsOn ?? 1) as Day;
    const now = new Date();
    const start = startOfWeek(subWeeks(now, 1), { weekStartsOn });
    const end = endOfWeek(subWeeks(now, 1), { weekStartsOn });
    return isWithinInterval(date, { start, end });
  }

  // Grouping helpers
  function groupActivities(logs: any[]) {
    const today: any[] = [];
    const yesterday: any[] = [];
    const thisWeek: any[] = [];
    const lastWeek: any[] = [];
    const rest: any[] = [];
    const now = new Date();
    for (const act of logs) {
      const d = parseISO(act.start_date);
      if (isToday(d)) today.push(act);
      else if (isYesterday(d)) yesterday.push(act);
      else if (isThisWeek(d, { weekStartsOn: 1 }) && d < now) thisWeek.push(act);
      else if (isLastWeek(d, { weekStartsOn: 1 })) lastWeek.push(act);
      else rest.push(act);
    }
    return { today, yesterday, thisWeek, lastWeek, rest };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-white">
      {/* PAGE TITLE */}
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-white">
          Training Logs
        </h1>
        <p className="mt-1 text-sm text-white/60">
          All Danil's workouts, sorted by category. See progress by date.
        </p>
        {updated && (
          <p className="mt-1 text-xs text-white/40">Last updated: {new Date(updated).toLocaleString()}</p>
        )}
      </section>

      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-white/60">No logs found.</div>
      ) : (
        (() => {
          const groups = groupActivities(logs);
          return (
            <div className="flex flex-col gap-8">
              {groups.today.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-[#d2a852]">Today</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.today.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.yesterday.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-[#d2a852]">Yesterday</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.yesterday.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.thisWeek.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-[#d2a852]">This Week</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.thisWeek.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.lastWeek.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-[#d2a852]">Last Week</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.lastWeek.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.rest.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-[#d2a852]">Earlier</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.rest.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()
      )}
      {/* Strava profile link */}
      <div className="mt-12 flex justify-center">
        <a
          href="https://www.strava.com/athletes/66921238"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-lg bg-[#fc4c02] text-white font-semibold shadow hover:bg-[#d2a852] transition-colors text-lg"
        >
          View my Strava profile ↗
        </a>
      </div>
    </div>
  );
}
