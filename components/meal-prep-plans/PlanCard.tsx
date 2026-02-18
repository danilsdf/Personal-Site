import { MealPrepPlan } from "@/app/data/models/meal-prep-plan";
import Link from "next/link";

function formatRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const fmt = (d: Date) =>
    d.toLocaleString("en-US", { month: "short", day: "numeric" });

  return `${fmt(start)}–${fmt(end)}`;
}

export default function PlanCard({ plan }: { plan: MealPrepPlan }) {
  const range = formatRange(plan.startDate, plan.endDate);

  const preview = plan.ingredientNames.slice(0, 2).join(", ");
  const hasMore = plan.ingredientNames.length > 2;

  return (
    <Link
      href={`/meal-prep-plan/${plan.id}`}
      className={[
        "group block rounded-2xl border border-white/60 bg-white/55 shadow-sm backdrop-blur",
        "transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30",
      ].join(" ")}
    >
      <div className="grid grid-cols-[116px_1fr] gap-4 p-4 sm:grid-cols-[140px_1fr] sm:p-5">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl bg-slate-200/40 ring-1 ring-white/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              plan.imageUrl ??
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
            }
            alt={plan.title}
            className="h-[96px] w-full object-cover sm:h-[110px]"
          />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-extrabold text-slate-900">
                {plan.title}
              </h3>
              <p className="mt-0.5 text-sm text-slate-600">({range})</p>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold text-slate-900">
                Calories: {plan.calories}
              </div>
            </div>
          </div>

          {/* Macros row */}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            <span>
              <span className="text-slate-500">Fat</span>{" "}
              <span className="font-semibold">{plan.fat}g</span>
            </span>
            <span>
              <span className="text-slate-500">Protein</span>{" "}
              <span className="font-semibold">{plan.protein}g</span>
            </span>
            <span>
              <span className="text-slate-500">Carbs</span>{" "}
              <span className="font-semibold">{plan.carbs}g</span>
            </span>
          </div>

          {/* Ingredients + Show All */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm text-slate-600">
              {preview}
              {hasMore ? ", …" : ""}
            </p>

            <span className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800">
              Show All
            </span>
          </div>

          {/* CTA */}
          <div className="mt-4 flex justify-end">
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-extrabold text-white shadow-sm transition group-hover:bg-emerald-600">
              View Plan
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
