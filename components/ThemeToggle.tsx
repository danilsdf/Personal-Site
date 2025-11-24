"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs font-medium uppercase tracking-wide hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}