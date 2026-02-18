import React from "react";

type Props = {
  index: number;
  title: string;
  icon: "drumstick" | "steak" | "fish" | "sun";
  rightAccessory?: string;
  compact?: boolean;
  children: React.ReactNode;
};

function Icon({ name }: { name: Props["icon"] }) {
  const map: Record<Props["icon"], string> = {
    drumstick: "🍗",
    steak: "🥩",
    fish: "🐟",
    sun: "🌅",
  };
  return (
    <span
      className="grid h-8 w-8 place-items-center rounded-xl bg-white/55 ring-1 ring-white/60"
      aria-hidden
    >
      {map[name]}
    </span>
  );
}

export default function Section({
  index,
  title,
  icon,
  rightAccessory,
  compact,
  children,
}: Props) {
  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Icon name={icon} />
          <h2 className="min-w-0 truncate text-lg font-extrabold text-slate-900 sm:text-xl">
            {index}. {title}
          </h2>
        </div>

        {rightAccessory && (
          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-white/50 bg-white/45 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur sm:block">
              {rightAccessory}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/45 text-lg shadow-sm backdrop-blur transition hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
              aria-label={`${rightAccessory} menu`}
            >
              🧺
            </button>
          </div>
        )}
      </div>

      {children}
    </section>
  );
}
