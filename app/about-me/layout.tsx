// app/layout.tsx
import MainHeader from "@/components/headers/MainHeader";
import "./../globals.css";
import type { Metadata } from "next";
import MainFooter from "@/components/footer/MainFooter";

export const metadata: Metadata = {
  title: "Danil Kravchenko | Athlete & Coder",
  description: "Hybrid athlete & software engineer.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
