"use client";

import dynamic from "next/dynamic";
import { CopyEmailButton } from "@/components/CopyEmail";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  return (
    <header className="relative min-h-[100svh] overflow-hidden">
      <HeroCanvas />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-[18vh] pt-[22vh] md:pb-[20vh] md:pt-[24vh]">
        <div className="max-w-xl">
          <h1 className="text-4xl font-medium leading-[1.12] tracking-tight text-mist-100 md:text-5xl lg:text-6xl">
            王化康 · Kyson
          </h1>
          <p className="mt-5 text-sm text-mist-300 md:text-base">
            Sightes｜外贸运营 · 光纤产品
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist-100/90 md:text-xl">
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
