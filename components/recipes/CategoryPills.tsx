"use client";

import { useState } from "react";

const items = [
  { key: "search", label: "Search", icon: "🔎" },
  { key: "chicken", label: "Chicken", icon: "🍗" },
  { key: "beef", label: "Beef & Grain", icon: "🥩" },
];

export default function CategoryPills() {
  const [active, setActive] = useState("chicken");

  return (
    <>
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setActive(it.key)}
            className={[
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur",
              "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30",
              isActive
                ? "border-white/70 bg-white/70 text-slate-900"
                : "border-white/50 bg-white/45 text-slate-700 hover:bg-white/60",
            ].join(" ")}
          >
            <span aria-hidden>{it.icon}</span>
            <span className="whitespace-nowrap">{it.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/45 text-lg shadow-sm backdrop-blur transition hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
        aria-label="More"
      >
        🧺
      </button>
    </>
  );
}
