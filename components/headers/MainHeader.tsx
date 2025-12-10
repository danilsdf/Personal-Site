import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-bold text-white hover:text-white">
                <span className="font-semibold tracking-[0.2em] text-white/90">
                    DK
                </span>
                <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/50 sm:inline">
                    Hybrid Hub
                </span>
            </Link>
        </div>
        <nav className="flex items-center gap-4">
            <Link href="/recipes" className="hover:text-white">
              Recipes
            </Link>
            <Link href="/training-logs" className="hover:text-white">
              Training Logs
            </Link>
            <Link href="/drills" className="hover:text-white">
              Drills
            </Link>
            <Link href="/tools" className="hover:text-white">
              Tools
            </Link>
        </nav>
    </header>
  );
}
