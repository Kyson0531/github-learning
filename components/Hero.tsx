"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.querySelectorAll<HTMLElement>("[data-hero-item]");

    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 28 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={rootRef}
      className="relative min-h-[100svh] flex items-end overflow-hidden"
    >
      <HeroCanvas />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-32 md:pb-28">
        <div
          data-hero-item
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-fiber-cyan/25 bg-ink-800/50 px-3 py-1 font-mono text-[11px] uppercase tracking-editorial text-fiber-cyan/90 backdrop-blur"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-fiber-cyan shadow-[0_0_8px_rgba(94,234,212,0.8)]"
            aria-hidden
          />
          Open to opportunities
        </div>

        <p
          data-hero-item
          className="mb-5 font-mono text-xs uppercase tracking-editorial text-mist-300"
        >
          Sightes · Foreign trade · Optical fiber ops
        </p>

        <h1
          data-hero-item
          className="max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight text-mist-100 md:text-7xl"
        >
          Kyson Wang
        </h1>

        <p
          data-hero-item
          className="mt-3 text-3xl font-normal tracking-tight text-mist-300 md:text-4xl"
        >
          王化康
        </p>

        <p
          data-hero-item
          className="mt-8 max-w-xl text-base leading-relaxed text-mist-300 md:text-lg"
        >
          Bridging international trade and optical-fiber operations—clear
          process, reliable follow-through, and calm execution under pressure.
        </p>

        <div data-hero-item className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="rounded-full border border-fiber-cyan/40 bg-fiber-cyan/10 px-6 py-2.5 text-sm font-medium text-fiber-cyan shadow-[0_0_20px_rgba(94,234,212,0.08)] backdrop-blur transition duration-300 hover:border-fiber-cyan/70 hover:bg-fiber-cyan/15 hover:shadow-[0_0_28px_rgba(94,234,212,0.22)] hover:text-mist-100"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-mist-400/25 bg-transparent px-6 py-2.5 text-sm text-mist-300 transition duration-300 hover:border-fiber-cyan/40 hover:text-fiber-cyan"
          >
            Contact
          </a>
        </div>
      </div>

      <div
        data-hero-item
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-editorial text-mist-400">
          Scroll
        </span>
        <span
          className="h-8 w-px bg-gradient-to-b from-fiber-cyan/60 to-transparent"
          aria-hidden
        />
      </div>
    </header>
  );
}
