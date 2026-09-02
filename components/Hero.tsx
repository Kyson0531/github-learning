"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  return (
    <header className="relative min-h-[100svh] flex items-end overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-32 md:pb-28">
        <p className="mb-6 font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
          Sightes · Foreign trade · Optical fiber ops
        </p>
        <h1 className="max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight text-mist-100 md:text-7xl">
          Kyson Wang
          <span className="mt-3 block text-3xl font-normal text-mist-300 md:text-4xl">
            王化康
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-mist-300 md:text-lg">
          Bridging international trade and optical-fiber operations—clear
          process, reliable follow-through, and calm execution under pressure.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="rounded-full border border-mist-400/30 bg-ink-800/60 px-5 py-2.5 text-sm text-mist-100 backdrop-blur transition hover:border-fiber-cyan/50 hover:text-fiber-cyan"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-transparent px-5 py-2.5 text-sm text-mist-300 transition hover:text-mist-100"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
