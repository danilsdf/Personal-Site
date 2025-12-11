export default function FitnessToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-white">

      {/* TITLE */}
      <section className="text-center mb-12">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-[#d2a852]">
          Fitness Tools.
        </h1>
        <p className="mt-1 text-sm text-neutral-300">
          A toolkit for hybrid athletes.
        </p>
      </section>

      {/* TOP TOOL CARDS (3 IN A ROW) */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        <ToolCard title="Macro Calculator" href="/tools/macro-calculator" />
        <ToolCard title="Meal Plan Generator" href="/tools/meal-plan-generator" />
        <ToolCard title="Hybrid Training Templates" href="/tools/training-templates" />
      </section>

      {/* TWO MID-CARDS (BIG) */}
      <section className="grid gap-6 sm:grid-cols-2 mb-16">
        <MidToolCard
          title="Workout generator."
          description="Build a custom gym routine with a single click."
          href="/tools/workout-generator"
        />
        <MidToolCard
          title="More coming soon"
          description="New tools and features are on the way."
        />
      </section>

      {/* CTA BLOCK */}
      <section className="text-center">
        <h2 className="text-lg font-semibold text-[#d2a852]">
          Start using tools.
        </h2>
        <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
          Level up your fitness with our suite of tools.
        </p>
        <a
          href="/tools/about"
          className="mt-5 inline-block rounded-full bg-[#d2a852] px-6 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#bfa14a] focus:outline-none focus:ring-2 focus:ring-[#d2a852]"
        >
          About the Tools
        </a>
      </section>

    </div>
  );
}

function ToolCard({ title, href }: { title: string; href?: string }) {
  const content = (
    <>
      <div className="mb-4 h-28 w-full rounded-xl bg-[#23232a]/70" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </>
  );
  return href ? (
    <a href={href} className="rounded-2xl border border-[#23232a] bg-[#23232a] p-4 cursor-pointer transition hover:bg-[#23232a]/80 block focus:outline-none focus:ring-2 focus:ring-[#d2a852]">
      {content}
    </a>
  ) : (
    <div className="rounded-2xl border border-[#23232a] bg-[#23232a] p-4 cursor-pointer transition hover:bg-[#23232a]/80">
      {content}
    </div>
  );
}

function MidToolCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="mb-5 h-32 w-full rounded-xl bg-[#23232a] sm:h-40" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-neutral-300">{description}</p>
    </>
  );
  return href ? (
    <a href={href} className="rounded-2xl border border-[#23232a] bg-[#23232a] p-6 block cursor-pointer transition hover:bg-[#23232a]/80 focus:outline-none focus:ring-2 focus:ring-[#d2a852]">
      {content}
    </a>
  ) : (
    <div className="rounded-2xl border border-[#23232a] bg-[#23232a] p-6">
      {content}
    </div>
  );
}

function BottomToolCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#23232a] bg-[#23232a] p-6">
      <div className="mb-5 h-32 w-full rounded-xl bg-[#23232a] sm:h-40" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-neutral-300">{description}</p>
    </div>
  );
}
