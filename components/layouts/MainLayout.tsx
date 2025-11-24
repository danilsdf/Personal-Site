import { ThemeToggle } from "@/components/ThemeToggle";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar / nav */}
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <h1>
              <a href="/" className="hover:opacity-70 transition-opacity">
                DANIKRAVAFIT
              </a>
            </h1>
            <span className="text-sm font-medium tracking-wide">
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* Navigation for main pages */}
            <a href="/achievements" className="hover:opacity-70 transition-opacity">
              Achievements
            </a>
            <a href="/programs" className="hover:opacity-70 transition-opacity">
              Programs
            </a>
            <a href="/recipes" className="hover:opacity-70 transition-opacity">
              Recipes
            </a>
            <a href="/contact" className="hover:opacity-70 transition-opacity">
              Contact
            </a>
            <a href="/about" className="hover:opacity-70 transition-opacity">
              About
            </a>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {children}
    </main>
  );
}
