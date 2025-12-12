export default function WeeklyMealPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-12 text-neutral-900 dark:text-neutral-100">
      {/* TITLE */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-yellow-600 dark:text-yellow-400">
          MealPlan
        </h1>
      </section>

      {/* HERO VISUAL */}
      <section className="mb-10">
        <div className="h-64 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800 sm:h-80 md:h-96" />
      </section>

      {/* TWO FEATURE BLOCKS */}
      <section className="mb-14 grid gap-6 sm:grid-cols-2">
        <FeatureBlock
          title="Easy planning."
          description="Auto-generate weekly meal plans tailored for hybrid athletes with nutrition goals in mind. Save time and hit your macros every week."
        />
        <FeatureBlock
          title="Flexible options."
          description="Select dietary preferences, meal types, and instantly view matched recipes. Designed for meal preppers who need variety."
          iconShape="circle"
        />
      </section>

      {/* MID STATEMENT */}
      <section className="mx-auto mb-14 max-w-xl text-center">
        <h2 className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
          Plan your week, effortlessly.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
          Get a balanced schedule with easy-to-prep meals, macro targets, and a
          printable plan. Powered by black and yellow athletic style.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h3 className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
          Try the Meal Plan Generator
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Jumpstart your week—generate your meal plan now in just a click.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-yellow-600 dark:bg-yellow-400 px-6 py-2 text-xs font-semibold text-white dark:text-black transition hover:bg-yellow-700 dark:hover:bg-yellow-300"
        >
          Generate Plan
        </button>
      </section>
    </div>
  );
}

function FeatureBlock({
  title,
  description,
  iconShape = "square",
}: {
  title: string;
  description: string;
  iconShape?: "square" | "circle";
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-44 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  );
}
