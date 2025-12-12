export default function AboutPage() {
    return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 text-black dark:text-white">
      {/* Content block */}
      <section className="w-full">

        {/* Name + role */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#d2a852] dark:text-[#f0c46a] sm:text-3xl">
            Danil Kravchenko
          </h1>
          <p className="mt-1 text-base font-semibold text-neutral-500 dark:text-neutral-400">
            Hybrid-Athlete
          </p>
        </div>

        {/* Bio paragraphs */}
        <div className="space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-200">
          <p>
            Driven by a passion for progress, I&apos;m dedicated to the
            hybrid-athlete lifestyle—balancing strength, speed, and endurance.
            Every session is an opportunity to redefine limits.
          </p>
          <p>
            My approach combines running, gym sessions, and boxing—melding
            diverse styles with intent and discipline. Training is about
            meticulous planning, consistency, and listening to your body.
          </p>
          <p>
            Through this platform, I hope to inspire others, share practical
            tools, and document every step of my own journey. Let&apos;s build
            strong minds and stronger bodies together.
          </p>
        </div>

        {/* Connect section */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Connect
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              href="https://instagram.com/danilkravafit"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.strava.com/athletes/66921238"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors"
            >
              Strava
            </a>
            <a
              href="mailto:danil.kravchenko.dev@gmail.com"
              className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        {/* Signature placeholder */}
        <div className="mt-12 h-8 w-24 rounded bg-[#f7f7f7] dark:bg-[#23232a]" />
      </section>
    </div>
  );
}
