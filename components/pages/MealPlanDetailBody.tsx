import React from "react";
import Link from "next/link";
import { MealPrepPlan } from "@/app/data/models/meal-prep-plan";

type MealPlanDetailBodyProps = {
    plan: MealPrepPlan;
    backHref: string
    focusIngredients?: boolean;
};

const MealPlanDetailBody: React.FC<MealPlanDetailBodyProps> = ({
    plan,
    backHref,
    focusIngredients = false,
}) => {
    return (
        <main className="min-h-dvh bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200">
            <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6">
                <Link
                    href={backHref}
                    className="text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                    ← Back to plans
                </Link>

                <header className="mt-4 rounded-2xl border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur">
                    <h1 className="text-2xl font-extrabold text-slate-900">{plan.title}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Calories: <span className="font-semibold text-slate-900">{plan.calories}</span> •
                        Protein <span className="font-semibold">{plan.protein}g</span> •
                        Fat <span className="font-semibold">{plan.fat}g</span> •
                        Carbs <span className="font-semibold">{plan.carbs}g</span>
                    </p>
                </header>

                <section
                    id="ingredients"
                    className={[
                        "mt-5 rounded-2xl border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur",
                        focusIngredients ? "ring-2 ring-sky-400/50" : "",
                    ].join(" ")}
                >
                    <h2 className="text-lg font-extrabold text-slate-900">Ingredients</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {plan.ingredientNames.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </section>

                <section className="mt-5 rounded-2xl border border-white/60 bg-white/55 p-5 text-sm text-slate-700 shadow-sm backdrop-blur">
                    <h2 className="text-lg font-extrabold text-slate-900">Plan Content</h2>
                    <p className="mt-2 text-slate-600">
                        This is where your meals/recipes for the week go (containers, recipes, quantities, prep steps, etc.).
                    </p>
                </section>
            </div>
        </main>
    );
};

export default MealPlanDetailBody;