import SegmentedTabs from "./SegmentedTabs";

export default function DashboardHeader() {
  return (
    <header className="relative">
      <div className="flex items-start gap-3">
        <div className="mt-1 grid h-10 w-10 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/20">
          <span className="text-xl">🥗</span>
        </div>

        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Meal Prep Recipe Dashboard
          </h1>
        </div>
      </div>

      <div className="mt-5">
        <SegmentedTabs />
      </div>
    </header>
  );
}
