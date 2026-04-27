"use client";

import { useState } from "react";

const TOOLS = [
  {
    title: "Macro Calculator",
    summary: "Estimate your daily calorie and macronutrient needs.",
    body: `Enter your age, weight, height, and activity level to get a personalized breakdown of calories, protein, carbs, and fats. Use this to guide your nutrition for training or body composition goals.`
  },
  {
    title: "Meal Prep Helper",
    summary: "Calculate your weekly meal plan based on your calorie target and available ingredients.",
    body: `Input your daily calorie goal, macro split, and the ingredients you have on hand. The tool will generate a meal prep plan for the week, showing how to combine your ingredients to meet your nutritional targets.`
  },
  {
    title: "Workout Generator",
    summary: "Build a custom gym routine with a single click.",
    body: `Pick your training split (full body, upper/lower, push/pull/legs) and equipment. The generator will create a workout with sets, reps, and rest times. Use it as a base and modify as needed.`
  },
];

export default function ToolsAboutPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 text-neutral-900 dark:text-neutral-100">

      {/* TITLE */}
      <section className="text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">
          About the Tools
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Learn what each tool does and how to get the most out of it. Click on a tool to expand details and usage instructions.
        </p>
      </section>

      {/* ACCORDION */}
      <section className="px-5 py-14 md:px-10 md:py-20 lg:px-24">
        <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {TOOLS.map((tool, idx) => (
            <div key={tool.title}>
              <button
                className="flex w-full items-center justify-between py-6 text-left transition hover:text-white/80"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={`tool-body-${idx}`}
              >
                <span className="text-sm font-black uppercase tracking-widest text-white">
                  {tool.title}
                </span>
                <span className="ml-4 text-lg leading-none text-white/40 transition">
                  {open === idx ? "−" : "+"}
                </span>
              </button>
              <div
                id={`tool-body-${idx}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                aria-hidden={open !== idx}
              >
                <p className="mb-2 text-sm font-bold text-white/70">{tool.summary}</p>
                <p className="text-sm leading-relaxed text-white/50">{tool.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

