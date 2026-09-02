"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

const BEATS = [
  {
    zh: "连接产品、客户与交付",
    en: "Bridging product, clients & delivery — Sightes / optical fiber trade.",
  },
  {
    zh: "把散乱信息整理成可执行行动",
    en: "Turn messy information into executable actions.",
  },
  {
    zh: "先理解业务，再选择程序与 AI",
    en: "Understand the business first — then choose code & AI.",
  },
] as const;

const STORY_DURATION = 8; // fake timeline seconds (v2-style)

function formatTime(seconds: number) {
  const s = Math.max(0, Math.min(STORY_DURATION, seconds));
  const whole = Math.floor(s);
  const tenths = Math.floor((s - whole) * 10);
  return `00:${String(whole).padStart(2, "0")}.${tenths}`;
}

function beatFromProgress(p: number) {
  if (p < 1 / 3) return 0;
  if (p < 2 / 3) return 1;
  return 2;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [beat, setBeat] = useState(0);
  const [timeLabel, setTimeLabel] = useState("00:00.0");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scrub bar reads progressRef at 60fps without React re-renders
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      if (barRef.current) {
        barRef.current.style.width = `${progressRef.current * 100}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          const nextBeat = beatFromProgress(p);
          setBeat((prev) => (prev === nextBeat ? prev : nextBeat));
          setTimeLabel(formatTime(p * STORY_DURATION));
        },
      });
    }, section);

    // Lenis already syncs via SmoothScroll — refresh after triggers exist
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(94,234,212,0.12),_transparent_55%),radial-gradient(ellipse_at_80%_10%,_rgba(96,165,250,0.1),_transparent_40%)]" />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-32">
          <IdentityBlock />
          <ol className="mt-14 space-y-12">
            {BEATS.map((b, i) => (
              <li key={b.zh} className="border-l border-fiber-cyan/30 pl-5">
                <span className="font-mono text-[11px] uppercase tracking-editorial text-fiber-cyan/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-2xl font-medium tracking-tight text-mist-100 md:text-3xl">
                  {b.zh}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-mist-300 md:text-base">{b.en}</p>
              </li>
            ))}
          </ol>
          <HeroCTAs className="mt-14" />
        </div>
      </header>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[320svh]"
      aria-label="Story"
    >
      <div
        ref={stageRef}
        className="relative flex h-[100svh] w-full flex-col overflow-hidden"
      >
        <HeroCanvas progressRef={progressRef} />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-6 pb-16 pt-28 md:pb-20 md:pt-32">
          <IdentityBlock />

          {/* Story beats — crossfade by active index */}
          <div className="relative mt-8 min-h-[9.5rem] max-w-2xl flex-1 md:min-h-[11rem]">
            {BEATS.map((b, i) => {
              const active = i === beat;
              return (
                <div
                  key={b.zh}
                  className="absolute inset-x-0 top-0 transition-all duration-500 ease-out"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(12px)",
                    pointerEvents: active ? "auto" : "none",
                  }}
                  aria-hidden={!active}
                >
                  <p className="font-mono text-[11px] uppercase tracking-editorial text-fiber-cyan/85">
                    Beat {String(i + 1).padStart(2, "0")} / 03
                  </p>
                  <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-mist-100 md:text-5xl">
                    {b.zh}
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist-300 md:text-base">
                    {b.en}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Timeline + progress dots + CTAs */}
          <div className="relative z-10 mt-auto flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tabular-nums tracking-editorial text-mist-300">
                  {timeLabel}
                </span>
                <span className="font-mono text-[10px] text-mist-400">/ 00:08.0</span>
              </div>
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Story progress"
              >
                {BEATS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === beat
                        ? "w-6 bg-fiber-cyan shadow-[0_0_10px_rgba(94,234,212,0.6)]"
                        : i < beat
                          ? "w-1.5 bg-fiber-cyan/50"
                          : "w-1.5 bg-mist-400/35"
                    }`}
                    aria-current={i === beat ? "step" : undefined}
                  />
                ))}
              </div>
              <div className="h-px w-40 overflow-hidden bg-white/10 sm:w-52">
                <div
                  ref={barRef}
                  className="h-full w-0 bg-gradient-to-r from-fiber-cyan via-fiber-blue to-fiber-violet"
                />
              </div>
            </div>

            <HeroCTAs />
          </div>
        </div>
      </div>
    </section>
  );
}

function IdentityBlock() {
  return (
    <div>
      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-fiber-cyan/25 bg-ink-800/50 px-3 py-1 font-mono text-[11px] uppercase tracking-editorial text-fiber-cyan/90 backdrop-blur">
        <span
          className="h-1.5 w-1.5 rounded-full bg-fiber-cyan shadow-[0_0_8px_rgba(94,234,212,0.8)]"
          aria-hidden
        />
        Open to opportunities
      </div>
      <p className="font-mono text-xs uppercase tracking-editorial text-mist-300">
        Sightes · Foreign trade · Optical fiber ops
      </p>
      <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-mist-100 md:text-6xl">
        Kyson Wang
      </h1>
      <p className="mt-2 text-2xl font-normal tracking-tight text-mist-300 md:text-3xl">
        王化康
      </p>
    </div>
  );
}

function HeroCTAs({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href="#work"
        className="rounded-full border border-fiber-cyan/40 bg-fiber-cyan/10 px-5 py-2.5 text-sm font-medium text-fiber-cyan shadow-[0_0_20px_rgba(94,234,212,0.08)] backdrop-blur transition duration-300 hover:border-fiber-cyan/70 hover:bg-fiber-cyan/15 hover:shadow-[0_0_28px_rgba(94,234,212,0.22)] hover:text-mist-100"
      >
        View work
      </a>
      <a
        href="#contact"
        className="rounded-full border border-mist-400/25 bg-transparent px-5 py-2.5 text-sm text-mist-300 transition duration-300 hover:border-fiber-cyan/40 hover:text-fiber-cyan"
      >
        Contact
      </a>
    </div>
  );
}
