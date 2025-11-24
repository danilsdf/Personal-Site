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
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <MainHeader></MainHeader>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
