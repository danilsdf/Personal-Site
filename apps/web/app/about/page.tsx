import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Hybrid Athlete Hub",
  description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
  openGraph: {
    title: "About Me | Hybrid Athlete Hub",
    description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
    url: "https://danilkrava.fit/about-me",
    siteName: "Danil Kravchenko",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Hybrid Athlete Hub",
    description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-24 md:px-10 lg:px-0">
        <section className="w-full">

          {/* Header */}
          <div className="mb-10 border-b border-white/10 pb-10">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.25em] text-white/45">
              About
            </p>
            <h1 className="mb-2 text-4xl font-black tracking-tight md:text-5xl">Danil Kravchenko</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Hybrid Athlete</p>
          </div>

          {/* Bio */}
          <div className="space-y-5 text-[14px] leading-relaxed text-white/70">
            <p>I'm Danil — a hybrid athlete balancing a full-time job and training. My story is about fitting lifting, boxing, and running into real life, not chasing perfection. Early mornings, late nights, and meal prep became my routine. This site is my logbook: honest progress, mistakes, and what works for me.</p>
            <p>If you want to connect or follow my journey, check out the links below. I am always happy to chat and share what I've learned.</p>
          </div>

          {/* 2026 Goals */}
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="mb-4 text-[16px] font-bold uppercase tracking-[0.25em] text-white">My 2026 Goals</p>
            <ul className="space-y-3 text-[14px] text-white/70">
              {[
                { period: "Jan–Mar", text: "60-day fat loss (discipline, structure, visible results)" },
                { period: "May", text: "Marathon prep (endurance, mental toughness)" },
                { period: "July", text: "Spartan / hybrid event (strength + grit)" },
                { period: "September", text: "Second marathon" },
                { period: "Oct–Jan", text: "Bulking" },
              ].map((item) => (
                <li key={item.period} className="flex gap-4">
                  <span className="min-w-[90px] pt-[1px] text-[12px] font-black uppercase tracking-widest text-white/40">{item.period}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          {[
            { label: "Why this exists", text: "Fitness advice rarely fits real life. I work, train, and track progress as best I can. This site is for busy people who want results without burnout or extremes." },
            { label: "What I actually do", text: "Hybrid training: strength, boxing, running, and structured nutrition. I share routines, meal prep, and honest progress—what works for me, mistakes included." },
            { label: "Who this is for", text: "If you work a normal job, want to lose fat, and stay fit without wrecking your energy, you'll relate. It's about staying healthy while life keeps moving." },
            { label: "What you'll find here", text: "Simple fat-loss principles, meal prep tips, training structure, honest updates, and tools to make decisions easier." },
          ].map((item) => (
            <div key={item.label} className="mt-10 border-t border-white/10 pt-10">
              <p className="mb-3 text-[16px] font-bold uppercase tracking-[0.25em] text-white">{item.label}</p>
              <p className="text-[14px] leading-relaxed text-white/70">{item.text}</p>
            </div>
          ))}

          {/* Connect */}
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="mb-6 text-[16px] font-bold uppercase tracking-[0.25em] text-white/45">Connect</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com/danilkravafit" },
                { label: "Strava", href: "https://www.strava.com/athletes/66921238" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/kravchenkodanil/" },
                { label: "Email", href: "mailto:danil.kravchenko.dev@gmail.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-white/50 hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
