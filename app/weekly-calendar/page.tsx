export default function WeeklyCalendarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-white bg-[#18181b]">
      {/* TITLE + INTRO */}
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-[#d2a852]">
          Weekly Calendar
        </h1>
        <p className="mt-1 text-sm text-neutral-300 max-w-xl">
          Plan your hybrid training using the weekly table below—organized
          around runs, boxing, strength sessions, and recovery. Use it as a
          base, then plug in your own work blocks and life logistics to make
          the plan completely yours.
        </p>
      </section>

      {/* BIG CALENDAR IMAGE / GRAPH PLACEHOLDER
      <section>
        <div className="h-64 w-full rounded-xl bg-[#23232a] sm:h-80 md:h-96 border border-[#222]" />
      </section> */}

      {/* WEEKLY TRAINING TABLE */}
      <section className="mt-10 text-sm">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#d2a852]">
          Weekly Training Table
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#23232a] bg-[#23232a]">
          <table className="min-w-full border-collapse text-xs sm:text-sm">
            <thead className="border-b border-[#333] bg-[#23232a] text-left">
              <tr>
                <th className="px-4 py-2 font-medium text-[#d2a852]">Day</th>
                <th className="px-4 py-2 font-medium text-[#d2a852]">
                  Morning
                </th>
                <th className="px-4 py-2 font-medium text-[#d2a852]">
                  Evening
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Monday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  6k easy run (Zone 2)
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Strength — Lower body + core
                </td>
              </tr>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Tuesday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Mobility &amp; activation 20 min
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Boxing class — technique &amp; drills
                </td>
              </tr>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Wednesday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Tempo run 8–10k
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Upper body — push/pull
                </td>
              </tr>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Thursday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Easy shakeout run or walk
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Boxing — combos &amp; conditioning
                </td>
              </tr>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Friday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Strength — Full body
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Recovery — sauna / stretch
                </td>
              </tr>
              <tr className="border-b border-[#333]">
                <td className="px-4 py-2 font-medium text-white">
                  Saturday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Long run 12–18k
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Optional boxing / light drills
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-white">
                  Sunday
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Rest, walk, or easy mobility
                </td>
                <td className="px-4 py-2 text-neutral-200">
                  Prep meals &amp; plan next week
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-neutral-400 max-w-xl">
          This table shows one example week with runs, boxing sessions, strength
          days, and recovery built around work. Adjust intensity and days as
          needed for your schedule.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className="mt-16 text-center">
        <h2 className="text-lg font-semibold text-[#d2a852]">
          Structure for Success
        </h2>
        <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
          Download or print your week. Stick it to the wall, your fridge, or
          your hybrid athlete calendar so you can follow it with intention.
        </p>
        <button className="mt-5 rounded-full bg-[#d2a852] px-6 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#bfa14a]">
          Download Week
        </button>
      </section>
    </div>
  );
}
