"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortKey = "date" | "calories" | "protein";

const options: { key: SortKey; label: string; order?: string }[] = [
  { key: "date", label: "Order by Date", order: "by Date" },
  { key: "calories", label: "Calories (High-Low)", order: "by Calories (High-Low)" },
  { key: "protein", label: "Protein", order: "by Protein (High-Low)" },
];

export default function PlansToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const sort = (sp.get("sort") as SortKey) || "date";

  const setSort = (key: SortKey) => {
    const next = new URLSearchParams(sp.toString());
    next.set("sort", key);
    router.push(`${pathname}?${next.toString()}`);
  };

  const activeLabel = useMemo(
    () => options.find((o) => o.key === sort)?.order ?? "by Date",
    [sort]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((o) => {
        const isActive = o.key === sort;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setSort(o.key)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition",
              "border backdrop-blur",
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white/60 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}

      <div className="ml-auto hidden text-sm font-semibold md:block">
        Sorting: <span className="text-emerald-700">{activeLabel}</span>
      </div>
    </div>
  );
}
