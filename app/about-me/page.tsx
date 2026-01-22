export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 text-black dark:text-white">
      <section className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#d2a852] dark:text-[#f0c46a] sm:text-3xl">Danil Kravchenko</h1>
          <p className="mt-1 text-base font-semibold text-neutral-500 dark:text-neutral-400">Hybrid-Athlete</p>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-200">
          <p>I’m Danil — a full-time 9–5 professional who trains like an athlete and eats like an adult with a calendar.</p>
          <p>I lift, box, run, and still show up to work every day.<br />Not because I have “more motivation”, but because I learned how to structure training, nutrition, and recovery around a real life — deadlines, fatigue, stress, and limited time.</p>
          <p>This site documents that process.</p>
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">Why this exists</h2>
          <p>Most fitness advice is built for:</p>
          <ul className="list-disc ml-6">
            <li>people with unlimited time</li>
            <li>people who train once a day</li>
            <li>people who can “just rest more”</li>
          </ul>
          <p>That’s not real life for most of us.</p>
          <p>I work a regular job.<br />I train early mornings, lunch breaks, evenings.<br />I track calories, steps, sleep, recovery, and performance — not perfectly, but consistently.</p>
          <p>This project is about fat loss and fitness for busy people:</p>
          <ul className="list-disc ml-6">
            <li>without burnout</li>
            <li>without extreme deficits</li>
            <li>without pretending life is simple</li>
          </ul>
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">What I actually do</h2>
          <p>I follow a hybrid approach:</p>
          <ul className="list-disc ml-6">
            <li>strength training to keep muscle</li>
            <li>boxing / running / incline walking for conditioning</li>
            <li>nutrition built around structure, not restriction</li>
          </ul>
          <p>I document:</p>
          <ul className="list-disc ml-6">
            <li>real weight-cut phases</li>
            <li>daily routines around a 9–5 schedule</li>
            <li>meal prep that fits workdays</li>
            <li>cardio that doesn’t destroy recovery</li>
            <li>mistakes, adjustments, and data</li>
          </ul>
          <p>If it doesn’t work in normal life, I don’t keep it.</p>
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">Who this is for</h2>
          <p>This is for you if:</p>
          <ul className="list-disc ml-6">
            <li>you work a normal job</li>
            <li>you want to lose fat without wrecking performance</li>
            <li>you train hard but still want energy for life</li>
            <li>you value structure more than hype</li>
          </ul>
          <p>It’s not about looking shredded for one photo.<br />It’s about staying fit while life keeps moving.</p>
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">What you’ll find here</h2>
          <ul className="list-disc ml-6">
            <li>practical fat-loss principles</li>
            <li>meal-prep systems for busy weeks</li>
            <li>training structure for hybrid athletes</li>
            <li>honest progress updates (good and bad)</li>
            <li>tools that simplify decisions</li>
          </ul>
          <p>Everything here is built to be repeatable, not impressive.</p>
        </div>
        {/* Connect section */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Connect</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a href="https://instagram.com/danilkravafit" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Instagram</a>
            <a href="https://www.strava.com/athletes/66921238" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Strava</a>
            <a href="https://www.linkedin.com/in/kravchenkodanil/" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">LinkedIn</a>
            <a href="mailto:danil.kravchenko.dev@gmail.com" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Email</a>
          </div>
        </div>
        {/* Signature placeholder */}
        <div className="mt-12 h-8 w-24 rounded bg-[#f7f7f7] dark:bg-[#23232a]" />
      </section>
    </div>
  );
}
