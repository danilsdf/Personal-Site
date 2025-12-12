export default function MacrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-12 text-black dark:text-white">
      {/* TITLE */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#d2a852] dark:text-[#f0c46a]">
          Macros
        </h1>
      </section>

      {/* MAIN VISUAL */}
      <section className="mb-12">
        <div className="h-64 w-full rounded-2xl bg-neutral-200 dark:bg-[#23232a] sm:h-80 md:h-96" />
      </section>

      {/* DESCRIPTION */}
      <section className="mx-auto mb-16 max-w-xl text-center">
        <h2 className="mb-3 text-sm font-semibold text-[#d2a852] dark:text-[#f0c46a]">
          Macro Calculator
        </h2>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
          Easily calculate your daily macronutrient goals with a clean, modern
          interface. Hybrid® uses science-backed formulas to customize protein,
          fat, and carbs for athletes.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
          Enter your stats and fitness objectives to get instant, personalized
          recommendations. Precision fuels performance — take charge with just
          a few clicks.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h3 className="text-base font-semibold text-[#d2a852] dark:text-[#f0c46a]">
          Start Calculating
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">
          Dial in your macros for better results.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-[#d2a852] dark:bg-[#f0c46a] px-6 py-2 text-xs font-semibold text-black dark:text-[#23232a] transition hover:bg-[#bfa14a] dark:hover:bg-[#d2a852]"
        >
          Try Now
        </button>
      </section>
    </div>
  );
}
