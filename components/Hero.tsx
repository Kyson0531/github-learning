"use client";

import dynamic from "next/dynamic";
import { CopyEmailButton } from "@/components/CopyEmail";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  return (
    <header className="relative min-h-[100svh] overflow-hidden bg-apple-bg">
      <HeroCanvas />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col justify-center page-pad pb-[18vh] pt-[22vh] md:pb-[20vh] md:pt-[24vh]">
        <div className="max-w-hero">
          <h1
            className="font-semibold leading-[1.08] tracking-tight text-apple-ink"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            王化康 · Kyson
          </h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-apple-secondary md:text-[1.25rem]">
            Sightes｜外贸运营 · 光纤产品
          </p>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.6] text-apple-ink/90 md:text-lg">
            把产品、客户与交付连成清晰链路。
          </p>
          <div className="mt-10">
            <CopyEmailButton label="复制邮箱" />
          </div>
        </div>
      </div>
    </header>
  );
}
