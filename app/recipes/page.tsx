export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-black dark:text-white">
      {/* PAGE TITLE */}
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-black dark:text-white">
          Meal Prep Recipes
        </h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Black &amp; yellow fueled meals for performance.
        </p>
      </section>

      {/* RECIPE GRID */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <RecipeCard
          title="High-Protein Chicken & Rice Meal Prep"
          date="Jun 9, 2024"
          slug="high-protein-chicken-rice-meal-prep"
        />
        <RecipeCard
          title="Simple Overnight Oats (Berry Fuel)"
          date="Jun 6, 2024"
          slug="simple-overnight-oats-berry-fuel"
        />
        <RecipeCard
          title="Lean Turkey Chili for Performance"
          date="May 31, 2024"
          slug="lean-turkey-chili-for-performance"
        />
      </section>
    </div>
  );
}

import Link from "next/link";

type RecipeCardProps = {
  title: string;
  date: string;
  slug: string;
};

function RecipeCard({ title, date, slug }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${slug}`} className="block">
      <div className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3 transition hover:border-[#d2a852] hover:bg-black/10 dark:hover:bg-white/10">
        {/* IMAGE PLACEHOLDER */}
        <div className="mb-3 h-40 w-full rounded-xl bg-black/10 dark:bg-white/10" />

        {/* TEXT */}
        <h3 className="text-sm font-semibold text-black dark:text-white leading-tight">
          {title}
        </h3>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">{date}</p>
      </div>
    </Link>
  );
}
