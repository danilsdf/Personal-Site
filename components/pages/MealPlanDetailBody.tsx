import React from "react";
import mealPlanRecipes from "@/mocked/mockedMealPlanRecipe.json";
import allRecipes from "@/mocked/mockedRecipes.json";
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
    // Find all recipe connections for this plan
    const planRecipes = (mealPlanRecipes as any[])
        .filter((x) => x.mealPrepId === plan.id)
        .sort((a, b) => a.order - b.order);

    // Group recipes by type
    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

    const recipesByType: Record<string, any[]> = {};
    mealTypes.forEach((type) => {
        recipesByType[type] = planRecipes.filter((x) => x.type === type);
    });

    // Helper to get recipe details by _id
    const getRecipe = (id: string) => (allRecipes as any[]).find((r) => r._id === id);

    return (
        <main className="min-h-dvh from-slate-100 via-slate-100 to-slate-200">
            <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition group mb-4"
                >
                    <svg className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to plans
                </Link>

                {/* Meal Prep Image and Details */}
                <header
                    className="mt-4 rounded-2xl border border-white/60 bg-[#171c25] p-5 shadow-sm backdrop-blur flex flex-col sm:flex-row gap-6 items-center"
                    style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}
                >
                    <div className="relative group">
                        <img
                            src={plan.imageUrl}
                            alt={plan.title}
                            className="w-36 h-36 object-cover rounded-2xl border border-slate-700 shadow-lg transition-transform duration-200 group-hover:scale-105"
                        />
                        {/* Current week badge */}
                        {plan.isCurrentWeek && (
                            <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">● CURRENT WEEK</span>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-amber-400 mb-2 tracking-tight">{plan.calories} kcal
                        </h1>
                        <div className="flex justify-center sm:justify-start gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-200 tracking-wider">{plan.protein}g PROTEIN</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-200 tracking-wider">{plan.fat}g FAT</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-200 tracking-wider">{plan.carbs}g CARBS</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <span className="text-sm text-slate-400 font-medium">{plan.startDate} – {plan.endDate}</span>
                        </div>
                        {/* Macro distribution bar (optional) */}
                        {/* Macro distribution bar: 1 line, 3 colors */}
                        <div className="max-w-sm h-2 rounded bg-slate-800 overflow-hidden mb-2 flex">
                            {(() => {
                                const total = plan.protein * 4 + plan.fat * 9 + plan.carbs * 4;
                                const proteinPct = total ? (plan.protein * 4 / total) * 100 : 0;
                                const fatPct = total ? (plan.fat * 9 / total) * 100 : 0;
                                const carbsPct = total ? (plan.carbs * 4 / total) * 100 : 0;
                                return (
                                    <>
                                        <div style={{ width: `${proteinPct}%` }} className="h-2 bg-blue-400" />
                                        <div style={{ width: `${fatPct}%` }} className="h-2 bg-purple-400" />
                                        <div style={{ width: `${carbsPct}%` }} className="h-2 bg-amber-400" />
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </header>

                {/* Recipes by Meal Type */}
                <section className="mt-5 rounded-2xl border border-white/60 bg-[#171c25] p-5 shadow-sm backdrop-blur">
                    <h2 className="text-lg font-extrabold text-white mb-6 tracking-wider">PLAN RECIPES</h2>
                    {mealTypes.map((type) => (
                        recipesByType[type].length > 0 && (
                            <div key={type} className="mb-8">
                                <div className="uppercase text-xs tracking-[0.12em] text-slate-400 mb-2 flex items-center gap-2">
                                    {type}
                                    <span className="flex-1 border-b border-slate-700" />
                                </div>
                                <div className="space-y-3">
                                    {recipesByType[type].map((conn) => {
                                        const recipe = getRecipe(conn.recipeId);
                                        if (!recipe) return null;
                                        return (
                                            <Link
                                                key={recipe._id}
                                                href={{ pathname: `/recipe/${recipe.slug}` }}
                                                className="group block rounded-2xl border border-slate-700 bg-[#1f2937] p-4 flex flex-row gap-4 items-center shadow-lg transition duration-200 hover:bg-[#263244] hover:-translate-y-0.5"
                                                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}
                                            >
                                                <img
                                                    src={recipe.imageUrl || "/home-page/results/meal-prep.jpg"}
                                                    alt={recipe.title}
                                                    className="w-20 h-20 object-cover rounded-xl border border-slate-700 bg-slate-900 transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-white text-lg truncate">{recipe.title}</div>
                                                    <div className="text-xs text-slate-400 mt-1 truncate">{recipe.description}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 min-w-[90px]">
                                                    <span className="text-2xl font-bold text-sky-400 leading-none">{recipe.servings}
                                                        <span className="text-xs uppercase text-slate-400 tracking-wider"> SERVINGS</span>
                                                    </span>
                                                    
                                                    {/* Macro preview per serving */}
                                                    {recipe.kcal && (
                                                        <span className="text-xs text-sky-300 mt-1">{recipe.kcal} kcal</span>
                                                    )}
                                                    {recipe.protein && (
                                                        <span className="text-xs text-blue-200">P {recipe.protein}g</span>
                                                    )}
                                                    {recipe.fat && (
                                                        <span className="text-xs text-purple-200">F {recipe.fat}g</span>
                                                    )}
                                                    {recipe.carbs && (
                                                        <span className="text-xs text-amber-200">C {recipe.carbs}g</span>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </section>

                {/* Ingredients Section */}
                <section
                    id="ingredients"
                    className={["mt-5 rounded-2xl border border-white/60 bg-[#171c25] p-5 shadow-sm backdrop-blur", focusIngredients ? "ring-2 ring-sky-400/50" : ""].join(" ")}
                >
                    <h2 className="text-lg font-extrabold text-white mb-2 tracking-wider">INGREDIENTS</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
                        {plan.ingredientNames.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
};

export default MealPlanDetailBody;