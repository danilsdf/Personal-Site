// components/RecipeDetailBody.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/app/data/models/recipe";
import { useCurrentUser } from "@/lib/useCurrentUser";

type RecipeDetailBodyProps = {
  recipe: Recipe | null;
  onBack: () => void;
};

export function RecipeDetailBody({ recipe, onBack }: RecipeDetailBodyProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // modal: null = closed | "ask" = "adjust calories?" | "adjust" = calories input
  const [modal, setModal] = useState<null | "ask" | "adjust">(null);
  const [targetCalories, setTargetCalories] = useState("");

  useEffect(() => {
    if (userLoading || !user || !recipe) return;
    fetch(`/api/recipes/${recipe.slug}/save`)
      .then((r) => r.json())
      .then((data) => {
        setSaved(!!data?.saved);
        if (data?.targetCalories) setTargetCalories(String(data.targetCalories));
      })
      .catch(() => {});
  }, [user, userLoading, recipe?.slug]);

  async function doSave(calories: number | null) {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.slug}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCalories: calories }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
      setModal(null);
    }
  }

  async function handleUnsave() {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.slug}/save`, { method: "DELETE" });
      if (res.ok) { setSaved(false); setTargetCalories(""); }
    } finally {
      setSaving(false);
    }
  }

  function handleSaveClick() {
    if (!user) {
      router.push(`/login?redirect=/recipe/${recipe?.slug}`);
      return;
    }
    if (saved) {
      handleUnsave();
      return;
    }
    setModal("ask");
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 text-center text-red-600 dark:text-red-400">
        Recipe not found.
      </div>
    );
  }

  // Nutrition
  const macros = recipe.nutritionTotals?.perServing || recipe.nutritionTotals?.perRecipe || null;
  const createdDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

  return (
    <main className="min-h-dvh from-slate-100 via-slate-100 to-slate-200">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-24 sm:px-6">
      {/* Back link + Save button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
        >
          <span aria-hidden="true" className="text-sky-400 transition group-hover:text-sky-300">←</span>
          Back
        </button>
        <button
          onClick={handleSaveClick}
          disabled={saving}
          title={saved ? "Remove from saved" : "Save recipe"}
          className={[
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 border",
            saved
              ? "bg-sky-500 border-sky-500 text-white hover:bg-sky-600 hover:border-sky-600"
              : "bg-transparent border-sky-400 text-sky-400 hover:bg-sky-400/10",
            saving ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? "Saved" : "Save recipe"}
        </button>
      </div>

      {/* Save modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* backdrop */}
          <button
            aria-label="Close dialog"
            tabIndex={-1}
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setModal(null)}
          />
          <dialog
            open
            aria-modal
            className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171c25]"
          >
            {modal === "ask" && (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Save recipe</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Do you want to adjust calories for this recipe?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal("adjust")}
                    className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
                  >
                    Yes, adjust
                  </button>
                  <button
                    onClick={() => doSave(null)}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    No, save as-is
                  </button>
                </div>
              </>
            )}
            {modal === "adjust" && (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Adjust calories</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Enter your target calories per serving for this recipe.</p>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 450"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1f2937] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 mb-5"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const cal = Number.parseFloat(targetCalories);
                      doSave(!Number.isNaN(cal) && cal > 0 ? cal : null);
                    }}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setModal("ask")}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </dialog>
        </div>
      )}

      {/* TITLE + TAGS + DATE */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl text-center">
          {recipe.title}
        </h1>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="rounded-full px-3 py-1 text-xs font-semibold tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {createdDate && <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">Created {createdDate}</span>}
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">{recipe.servings} {recipe.servingUnit || "servings"}</span>
        </div>
      </section>

      {/* IMAGE (placeholder for now) */}
      <section className="mt-5">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-60 w-full rounded-2xl border border-slate-200 dark:border-slate-700 object-cover shadow-lg sm:h-72 md:h-96"
          />
        ) : (
          <div className="h-60 w-full rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 shadow-lg sm:h-72 md:h-96" />
        )}
      </section>

      {/* DESCRIPTION */}
      {recipe.description && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25] dark:text-slate-300 sm:text-base">
          {recipe.description}
        </section>
      )}

      {/* MACROS & SERVINGS */}
      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Nutrition
          </h2>
          {macros ? (
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <li className="rounded-xl bg-sky-100 px-3 py-2 text-slate-700 dark:bg-sky-900/30 dark:text-slate-200">Calories: <span className="font-semibold text-sky-600 dark:text-sky-300">{macros.kcal ?? "-"}</span></li>
              <li className="rounded-xl bg-blue-100 px-3 py-2 text-slate-700 dark:bg-blue-900/30 dark:text-slate-200">Protein: <span className="font-semibold text-blue-600 dark:text-blue-300">{macros.protein ?? "-"}g</span></li>
              <li className="rounded-xl bg-amber-100 px-3 py-2 text-slate-700 dark:bg-amber-900/30 dark:text-slate-200">Carbs: <span className="font-semibold text-amber-600 dark:text-amber-300">{macros.carbs ?? "-"}g</span></li>
              <li className="rounded-xl bg-purple-100 px-3 py-2 text-slate-700 dark:bg-purple-900/30 dark:text-slate-200">Fat: <span className="font-semibold text-purple-600 dark:text-purple-300">{macros.fat ?? "-"}g</span></li>
            </ul>
          ) : (
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">No nutrition info</div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Servings
          </h2>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {recipe.servings} {recipe.servingUnit || "servings"}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Adjust ingredient quantities based on your target number of portions.</p>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
        <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.map((line, idx) => (
            <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-600 dark:border-slate-700 dark:bg-[#1f2937] dark:text-slate-300">
              {/* If populated, show ingredient name, else fallback */}
              <span className="font-medium text-slate-900 dark:text-white">{line.ingredient?.name ?? "Ingredient"}</span>
              {line.quantity !== null && (
                <span className="ml-2 text-slate-600 dark:text-slate-300">
                  {line.quantity} {line.unit}
                </span>
              )}
              {line.note && (
                <span className="ml-2 italic text-slate-500 dark:text-slate-400">({line.note})</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* INSTRUCTIONS */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
        <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
          Instructions
        </h2>
        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
          <div className="space-y-5">
            {recipe.instructions.map((block, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#1f2937]">
                {block.section && (
                  <div className="mb-1 text-sm font-semibold text-sky-600 dark:text-sky-300">
                    {block.section}
                  </div>
                )}
                <ol className="list-decimal pl-5 space-y-2">
                  {block.steps.map((step, sidx) => (
                    <li key={sidx} className="text-sm text-slate-700 dark:text-slate-200 sm:text-base">
                      {step}
                    </li>
                  ))}
                </ol>
                {block.timing && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {block.timing.activeMin && <span>Active: {block.timing.activeMin} min. </span>}
                    {block.timing.minutes && <span>Total: {block.timing.minutes} min. </span>}
                    {block.timing.ovenC && <span>Oven: {block.timing.ovenC}&deg;C</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">No instructions provided.</div>
        )}
      </section>

      {/* MEAL PREP INFO */}
      {recipe.mealPrep && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
            Meal Prep Info
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {recipe.mealPrep.fridgeDays && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Fridge: <span className="font-medium text-slate-900 dark:text-white">{recipe.mealPrep.fridgeDays} days</span></li>
            )}
            {recipe.mealPrep.freezerDays && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Freezer: <span className="font-medium text-slate-900 dark:text-white">{recipe.mealPrep.freezerDays} days</span></li>
            )}
            {recipe.mealPrep.reheatNotes && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Reheat: <span className="italic text-slate-500 dark:text-slate-400">{recipe.mealPrep.reheatNotes}</span></li>
            )}
          </ul>
        </section>
      )}
      </div>
    </main>
  );
}
