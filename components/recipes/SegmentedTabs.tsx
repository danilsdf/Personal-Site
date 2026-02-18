"use client";

import { useMemo, useState } from "react";

type TabKey = "goal" | "protein" | "carb" | "products";

const tabs: { key: TabKey; label: string; tone?: "blue" | "orange" }[] = [
  { key: "goal", label: "Filter by Goal" },
  { key: "protein", label: "High-Protein", tone: "blue" },
  { key: "carb", label: "High-Carb", tone: "orange" },
  { key: "products", label: "Products" },
];

export default function SegmentedTabs() {
  const [active, setActive] = useState<TabKey>("protein");

  const activeMeta = useMemo(() => tabs.find((t) => t.key === active), [active]);

  return (
    <div className="w-full">
      <div className="rounded-full border border-white/60 bg-white/55 p-1 shadow-sm backdrop-blur">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {tabs.map((t) => {
            const isActive = t.key === active;

            const activeClass =
              t.tone === "blue"
                ? "bg-slate-900 text-white"
                : t.tone === "orange"
                ? "bg-orange-500 text-white"
                : "bg-slate-900 text-white";

            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={[
                  "flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40",
                  isActive
                    ? activeClass
                    : "text-slate-600 hover:bg-white/70",
                ].join(" ")}
              >
                <span className="truncate">{t.label}</span>
                {isActive && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* optional helper text for mobile */}
      <p className="mt-2 text-xs text-slate-500">
        Selected: <span className="font-semibold">{activeMeta?.label}</span>
      </p>
    </div>
  );
}
