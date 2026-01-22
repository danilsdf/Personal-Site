// app/layout.tsx
import MainHeader from "@/components/headers/MainHeader";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Danil Kravchenko | Athlete & Coder",
  description: "Hybrid athlete & software engineer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-64H6G758CS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-64H6G758CS');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-black dark:bg-[#0f1418] dark:text-white transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="min-h-screen bg-white text-black dark:bg-[#0f1418] dark:text-white transition-colors">
            <div className="mx-auto flex min-h-screen flex-col pb-16">
              <MainHeader />
              {children}
              <footer className="mt-12 border-t border-black/10 dark:border-white/10 p-4 text-[10px] text-black/40 dark:text-white/40 flex flex-col items-center gap-2">
                <div className="flex gap-4 mb-1">
                  <a href="https://instagram.com/danilkravafit" target="_blank" rel="noopener" aria-label="Instagram">
                    <img src="/social/instagram.png" alt="Instagram" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
                  </a>
                  <a href="https://www.strava.com/athletes/66921238" target="_blank" rel="noopener" aria-label="Strava">
                    <img src="/social/strava.png" alt="Strava" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
                  </a>
                  <a href="https://tiktok.com/@danilkravafit" target="_blank" rel="noopener" aria-label="TikTok">
                    <img src="/social/tiktok.png" alt="TikTok" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
                  </a>
                  <a href="https://www.linkedin.com/in/kravchenkodanil/" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <img src="/social/linkedin.png" alt="LinkedIn" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
                  </a>
                </div>
                <span>Hybrid Athlete Hub · Built for strength & endurance.</span>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
