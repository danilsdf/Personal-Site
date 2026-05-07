"use client";

export default function BuyMeACoffee() {
  return (
    <a
      href="https://buymeacoffee.com/danilkravafit"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 bg-[#FFDD00] px-4 py-3 text-[11px] font-black uppercase tracking-wide text-black shadow-[0_4px_24px_rgba(255,221,0,0.35)] transition-all duration-200 hover:bg-[#FFE933] hover:shadow-[0_4px_32px_rgba(255,221,0,0.55)] active:scale-95 md:bottom-8 md:right-8"
    >
      <span className="text-sm leading-none">☕</span>
      <span>Buy me a coffee</span>
    </a>
  );
}
