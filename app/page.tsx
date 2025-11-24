// app/page.tsx
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import MainLayout from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-16 pb-24 px-6 text-center">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Left title */}
            <div className="flex flex-col items-center md:items-end text-5xl md:text-7xl font-bold">
              <span className="text-neutral-900 dark:text-neutral-50">
                ATHLETE🏃‍♀️
              </span>
            </div>

            {/* Center Image */}
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/hero-face.png"
                alt="Danil Kravchenko athlete coder split"
                fill
                className="object-cover rounded-full border border-neutral-200 dark:border-neutral-700"
                priority
              />
            </div>

            {/* Right title */}
            <div className="flex flex-col items-center md:items-start text-5xl md:text-7xl font-bold">
              <span className="text-neutral-900 dark:text-neutral-50">
                RECIPES🍳
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-10 max-w-xl text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
            Hybrid athlete focused on boxing, running and strength. Software
            engineer crafting clean, efficient systems for the web.
          </p>
        </div>
      </section>

      {/* Work Section */}
      <section
        id="work"
        className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-wide mb-12">
            Some of my latest work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-56 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"></div>
            <div className="h-56 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"></div>
            <div className="h-56 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"></div>
          </div>
        </div>
      </section>
    </>
  );
}
