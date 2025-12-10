// app/layout.tsx
import MainHeader from "@/components/headers/MainHeader";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

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
      <body className="min-h-screen bg-[#0f1418] text-white transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="min-h-screen bg-[#0f1418] text-white">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 lg:px-8">
              <MainHeader />
              {children}
              <footer className="mt-12 border-t border-white/10 pt-4 text-[10px] text-white/40">
                Hybrid Athlete Hub · Built for strength & endurance.
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
