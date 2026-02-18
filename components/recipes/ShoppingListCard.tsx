import { ShoppingList } from "./types";

export default function ShoppingListCard({ data }: { data: ShoppingList }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-sm backdrop-blur">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="relative h-40 w-full md:h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt="Shopping prep"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              🛒
            </span>
            <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
              {data.title}
            </h3>
          </div>

          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {data.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
