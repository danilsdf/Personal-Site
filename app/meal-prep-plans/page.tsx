"use client";

import PlansToolbar from "@/components/meal-prep-plans/PlansToolbar";
import PlanCard from "@/components/meal-prep-plans/PlanCard";
import mockPlans from "@/mocked/mockedMealPrepPlans.json";

export default function MealPrepPlansPage() {
  return (

    <main className="min-h-dvh text-[#F3F4F6]">
      <div className="mx-auto w-full max-w-6xl px-2 pb-16 pt-8 sm:px-6">
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-[42px] font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
            Meal Prep Plans
          </h1>
          <p className="text-base max-w-2xl text-[#9CA3AF] mb-10" style={{ fontSize: 16 }}>
            Discover, plan, and organize your weekly meals with ease. Browse curated plans or create your own!
          </p>
        </header>

        <div className="mb-8">
          <PlansToolbar />
        </div>

        {/* Cards Grid */}
        <section className="mt-4">
          <div className="grid gap-6 grid-cols-1">
            {mockPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
