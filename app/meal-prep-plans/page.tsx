"use client";

import PlansToolbar from "@/components/meal-prep-plans/PlansToolbar";
import PlanCard from "@/components/meal-prep-plans/PlanCard";
import mockPlans from "@/mocked/mockedMealPrepPlans.json";

export default function MealPrepPlansPage() {
  return (

    <main className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-6xl px-2 pb-16 pt-8 sm:px-6">
        <header className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-5xl mb-2">
            Meal Prep Plans
          </h1>
          <p className="text-base text-primary/80 max-w-2xl">
            Discover, plan, and organize your weekly meals with ease. Browse curated plans or create your own!
          </p>
        </header>

        <div className="mb-6">
          <PlansToolbar />
        </div>

        {/* Cards Grid */}
        <section className="mt-4">
          <div className="grid gap-4 grid-cols-1">
            {mockPlans.map((plan) => (
              <div
                key={plan.id}
                className="transition-shadow duration-200 hover:shadow-lg rounded-xl bg-card"
              >
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
