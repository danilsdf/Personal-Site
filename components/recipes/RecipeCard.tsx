import { Recipe } from "./types";

function TagPill({ tag }: { tag: Recipe["tag"] }) {
  const cls =
    tag === "High-Protein"
      ? "bg-slate-900 text-white"
      : "bg-orange-500 text-white";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold shadow-sm",
        cls,
      ].join(" ")}
    >
      {tag}
    </span>
  );
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  if (recipe.variant === "list") {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/55 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
              <span className="text-lg" aria-hidden>
                🍃
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="whitespace-pre-line text-base font-extrabold text-slate-900">
                {recipe.title}
              </h3>
              {recipe.subtitle && (
                <p className="mt-1 text-sm text-slate-600">{recipe.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <TagPill tag={recipe.tag} />
        </div>

        <div className="mt-4 space-y-3">
          <div className="h-px bg-slate-200/80" />
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
              🍃
            </span>
            <span className="truncate">
              Chicken Breast, Garlic, Asparagus
            </span>
          </div>
          <div className="h-px bg-slate-200/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-sm backdrop-blur">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900">
              {recipe.title}
            </h3>
            {recipe.subtitle && (
              <p className="mt-1 text-sm text-slate-600">{recipe.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-0 border-t border-white/60">
        <div className="relative h-32 w-full sm:h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-4">
          <TagPill tag={recipe.tag} />
          <h4 className="mt-3 text-base font-extrabold text-slate-900">
            {recipe.tag === "High-Carb"
              ? "Sweet Potato & Black Bean Chili"
              : recipe.title}
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Key ingredients placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
