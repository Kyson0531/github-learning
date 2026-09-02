"use client";

import dynamic from "next/dynamic";
import { CopyEmailButton } from "@/components/CopyEmail";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  return (
    <header className="relative min-h-[100svh] overflow-hidden bg-transparent">
      <HeroCanvas />

      {/* Upper-center copy — Apple product hero rhythm */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col items-center page-pad pb-[42vh] pt-[18vh] sm:pb-[44vh] sm:pt-[20vh] md:pb-[46vh] md:pt-[22vh]">
        <div className="flex w-full max-w-[720px] flex-col items-center text-center">
          <h1
            className="font-semibold leading-[1.05] tracking-[-0.022em] text-apple-ink"
            style={{ fontSize: "clamp(2.75rem, 7vw, 3.5rem)" }}
          >
            王化康 · Kyson
          </h1>
          <p
            className="mt-3 font-normal leading-snug text-apple-secondary sm:mt-4"
            style={{ fontSize: "clamp(1.25rem, 2.8vw, 1.75rem)" }}
          >
            Sightes｜外贸运营 · 光纤产品
          </p>
          <p className="mt-4 max-w-md text-[1.0625rem] leading-[1.47] text-apple-ink/85 sm:mt-5 md:text-lg">
            把产品、客户与交付连成清晰链路。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <CopyEmailButton label="复制邮箱" />
            <a
              href="#work"
              className="inline-flex h-11 items-center justify-center rounded-[980px] border border-black/[0.12] bg-transparent px-6 text-[1.0625rem] font-normal text-apple-blue transition duration-300 hover:bg-black/[0.03] active:scale-[0.98]"
            >
              查看工作
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
