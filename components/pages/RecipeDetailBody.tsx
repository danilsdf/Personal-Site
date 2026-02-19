// components/RecipeDetailBody.tsx

import Link from "next/link";
import type { Recipe, RecipeIngredientLinePopulated, InstructionBlock } from "@/app/data/models/recipe";
import type { Ingredient } from "@/app/data/models/ingredient";

type RecipeDetailBodyProps = {
  recipe: Recipe | null;
  onBack: () => void;
};

export function RecipeDetailBody({ recipe, onBack }: RecipeDetailBodyProps) {
  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 text-center text-red-600 dark:text-red-400">
        Recipe not found.
      </div>
    );
  }

  // Nutrition
  const macros = recipe.nutritionTotals?.perServing || recipe.nutritionTotals?.perRecipe || null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 text-black dark:text-white">
      {/* Back link */}
      <div className="mb-4">
        <button onClick={onBack} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200">
          ← Back
        </button>
      </div>

      {/* TITLE + TAGS + DATE */}
      <section className="text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-black dark:text-white">
          {recipe.title}
        </h1>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-black/60 dark:text-white/60">
          {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : ""}
        </p>
      </section>

      {/* IMAGE (placeholder for now) */}
      <section className="mt-8">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96"
          />
        ) : (
          <div className="h-64 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 sm:h-80 md:h-96" />
        )}
      </section>

      {/* DESCRIPTION */}
      {recipe.description && (
        <section className="mt-8 text-center text-base text-black/80 dark:text-white/80">
          {recipe.description}
        </section>
      )}

      {/* MACROS & SERVINGS */}
      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
            Nutrition
          </h2>
          {macros ? (
            <ul className="mt-2 space-y-1">
              <li>Calories: <span className="font-semibold text-yellow-700 dark:text-yellow-300">{macros.kcal ?? "-"}</span></li>
              <li>Protein: <span className="font-semibold text-yellow-700 dark:text-yellow-300">{macros.protein ?? "-"}g</span></li>
              <li>Carbs: <span className="font-semibold text-yellow-700 dark:text-yellow-300">{macros.carbs ?? "-"}g</span></li>
              <li>Fat: <span className="font-semibold text-yellow-700 dark:text-yellow-300">{macros.fat ?? "-"}g</span></li>
            </ul>
          ) : (
            <div className="text-sm text-neutral-400">No nutrition info</div>
          )}
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
            Servings
          </h2>
          <div className="mt-2 text-black dark:text-white">
            {recipe.servings} {recipe.servingUnit || "servings"}
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300 mb-2">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.map((line, idx) => (
            <li key={idx} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2">
              {/* If populated, show ingredient name, else fallback */}
              <span className="font-medium text-black dark:text-white">{line.ingredient.name}</span>
              {line.quantity !== null && (
                <span className="ml-2 text-black/70 dark:text-white/70">
                  {line.quantity} {line.unit}
                </span>
              )}
              {line.note && (
                <span className="ml-2 italic text-neutral-500 dark:text-neutral-400">({line.note})</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* INSTRUCTIONS */}
      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300 mb-2">
          Instructions
        </h2>
        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
          <div className="space-y-6">
            {recipe.instructions.map((block, idx) => (
              <div key={idx}>
                {block.section && (
                  <div className="mb-1 text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    {block.section}
                  </div>
                )}
                <ol className="list-decimal pl-5 space-y-1">
                  {block.steps.map((step, sidx) => (
                    <li key={sidx} className="text-black dark:text-white">
                      {step}
                    </li>
                  ))}
                </ol>
                {block.timing && (
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {block.timing.activeMin && <span>Active: {block.timing.activeMin} min. </span>}
                    {block.timing.minutes && <span>Total: {block.timing.minutes} min. </span>}
                    {block.timing.ovenC && <span>Oven: {block.timing.ovenC}&deg;C</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-400">No instructions provided.</div>
        )}
      </section>

      {/* MEAL PREP INFO */}
      {recipe.mealPrep && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300 mb-2">
            Meal Prep Info
          </h2>
          <ul className="space-y-1">
            {recipe.mealPrep.fridgeDays && (
              <li>Fridge: <span className="font-medium text-black dark:text-white">{recipe.mealPrep.fridgeDays} days</span></li>
            )}
            {recipe.mealPrep.freezerDays && (
              <li>Freezer: <span className="font-medium text-black dark:text-white">{recipe.mealPrep.freezerDays} days</span></li>
            )}
            {recipe.mealPrep.reheatNotes && (
              <li>Reheat: <span className="italic text-neutral-500 dark:text-neutral-400">{recipe.mealPrep.reheatNotes}</span></li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
