// components/RecipeDetailBody.tsx
import Link from "next/link";

export type Macros = {
  calories: number;
  protein: number; // grams
  carbs: number;  // grams
  fat: number;    // grams
};

type RecipeDetailBodyProps = {
  title: string;
  date: string;
  macros: Macros;
  ingredients: string[];
  steps: string[];
  backHref: string;
  imageUrl?: string; // optional, for future <Image />
};

export function RecipeDetailBody({
  title,
  date,
  macros,
  ingredients,
  steps,
  backHref,
  imageUrl,
}: RecipeDetailBodyProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 text-white">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href={backHref}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-800"
        >
          ← Back to recipes
        </Link>
      </div>

      {/* TITLE + DATE */}
      <section className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-white">
          {title}
        </h1>
        <p className="mt-1 text-xs text-white/60">{date}</p>
      </section>

      {/* IMAGE (placeholder for now) */}
      <section className="mt-8">
        {imageUrl ? (
          // Replace with next/image later if you want
          <img
            src={imageUrl}
            alt={title}
            className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96"
          />
        ) : (
          <div className="h-64 w-full rounded-xl bg-neutral-200 sm:h-80 md:h-96" />
        )}
      </section>

      {/* CONTENT */}
      <section className="mt-10 space-y-6 text-sm leading-relaxed text-white">
        {/* MACROS */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Macros (per serving):
          </h2>
          <ul className="mt-2 list-disc pl-5">
            <li>Calories: <span className="text-white">{macros.calories}</span></li>
            <li>Protein: <span className="text-white">{macros.protein}g</span></li>
            <li>Carbs: <span className="text-white">{macros.carbs}g</span></li>
            <li>Fat: <span className="text-white">{macros.fat}g</span></li>
          </ul>
        </div>

        {/* INGREDIENTS */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Ingredients
          </h2>
          <ul className="mt-2 list-disc pl-5">
            {ingredients.map((item) => (
              <li key={item} className="text-white">{item}</li>
            ))}
          </ul>
        </div>

        {/* STEPS */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Steps
          </h2>
          <ol className="mt-2 list-decimal pl-5">
            {steps.map((step, index) => (
              <li key={index} className="mb-1 text-white">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
