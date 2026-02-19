import { MealPrepPlan } from "@/app/data/models/meal-prep-plan";
import { useRouter } from "next/navigation";

function formatRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const fmt = (d: Date) => d.toLocaleString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)}–${fmt(end)}`;
}

export default function PlanCard({ plan }: { plan: MealPrepPlan }) {
  const router = useRouter();
  const range = formatRange(plan.startDate, plan.endDate);

  const preview = plan.ingredientNames.slice(0, 2).join(", ");
  const hasMore = plan.ingredientNames.length > 2;

  const go = () => router.push(`/meal-prep-plan/${plan.id}`);

  return (
    <div
      onClick={go}
      className="
        group cursor-pointer
        grid grid-cols-[150px_1fr_140px] items-center gap-4
        rounded-2xl border border-white/10
        bg-[#171c25]
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_12px_26px_rgba(0,0,0,0.45)]
        transition duration-200
        hover:bg-[#1A2236] hover:-translate-y-[2px]
        px-4 py-4
      "
    >
      {/* Image */}
      <div className="h-[144px] w-[144px] overflow-hidden rounded-xl bg-[#0F1424] ring-1 ring-white/5">
        <img
          src={
            plan.imageUrl ??
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
          }
          alt={plan.title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Middle content */}
      <div className="min-w-0 self-start">
        {/* Title + date (compact like screenshot) */}
        <div>
          <h2 className="truncate text-[20px] font-semibold text-[#E5E7EB]">
            {plan.title}
          </h2>
          <span className="text-[#9CA3AF]">5 meals //todo</span>
        </div>

        {/* Macro pills (small) */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-500/15 px-2.5 py-1 text-[14px] font-semibold text-blue-300 ring-1 ring-blue-400/20">
            {plan.protein}g protein
          </span>
          <span className="rounded-md bg-violet-500/15 px-2.5 py-1 text-[14px] font-semibold text-violet-200 ring-1 ring-violet-300/20">
            {plan.fat}g fat
          </span>
          <span className="rounded-md bg-amber-500/15 px-2.5 py-1 text-[14px] font-semibold text-amber-200 ring-1 ring-amber-300/20">
            {plan.carbs}g carbs
          </span>
        </div>

        {/* Ingredients preview (single line) */}
        <div className="mt-5 truncate text-[14px] text-[#9CA3AF]">
          {preview}
          {hasMore ? ", …" : ""}
        </div>
      </div>

      {/* Right column */}
      <div className="flex h-full flex-col items-end justify-between">
        {/* Top right calories label */}
        <div className="text-[14px]">
          <span className="font-semibold text-[#6d737f]">Calories: </span><span className="font-bold">{plan.calories}</span>
        </div>

        {/* CTA */}
        <button
          className="
            rounded-2xl bg-blue-500/20 px-8 py-2
            text-[14px] font-semibold text-white
            shadow-sm ring-1 ring-white/10
            transition
            hover:bg-blue-500
          "
          onClick={(e) => {
            e.stopPropagation();
            go();
          }}
        >
          View Plan
        </button>
      </div>
    </div>
  );
}
