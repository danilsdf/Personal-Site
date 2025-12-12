
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between text-xs bg-white/80 dark:bg-[#0f1418]/80 backdrop-blur border-b border-black/10 dark:border-white/10 px-2 md:px-0 py-2 transition-colors">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
          <span className="font-semibold tracking-[0.2em] text-black/90 dark:text-white/90">
            DK
          </span>
          <span className="hidden rounded-full bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-black/50 dark:text-white/50 sm:inline">
            Hybrid Hub
          </span>
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Link href="/recipes" className="hover:text-blue-600 dark:hover:text-blue-400 text-black dark:text-white">
          Recipes
        </Link>
        <Link href="/training-logs" className="hover:text-blue-600 dark:hover:text-blue-400 text-black dark:text-white">
          Training Logs
        </Link>
        <Link href="/drills" className="hover:text-blue-600 dark:hover:text-blue-400 text-black dark:text-white">
          Drills
        </Link>
        <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 text-black dark:text-white">
          Tools
        </Link>
        <Link href="/about-me" className="hover:text-blue-600 dark:hover:text-blue-400 text-black dark:text-white">
          About me
        </Link>
        {/* <ThemeToggle /> */}
        {/* <LanguageSwitcher /> */}
      </nav>
    </header>
  );
}
