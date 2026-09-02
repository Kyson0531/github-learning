"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { CopyEmailButton, EMAIL } from "@/components/CopyEmail";

export function Contact() {
  return (
    <SectionReveal id="contact" className="mx-auto max-w-content page-pad section-y">
      <div className="glass-panel rounded-3xl p-8 md:p-12">
        <p className="text-xs font-medium uppercase tracking-editorial text-apple-secondary">
          联系
        </p>
        <h2 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-apple-ink md:text-[2rem]">
          一起把链路理顺
        </h2>
        <p className="mt-4 max-w-xl text-[1.0625rem] leading-[1.55] text-apple-secondary">
          若你在做外贸流程、样品/仓配信息，或想把现有表格收成更可行动的结构，欢迎写信。
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="text-lg text-apple-blue transition hover:underline"
          >
            {EMAIL}
          </a>
          <CopyEmailButton compact label="复制邮箱" />
        </div>
      </div>
      <footer className="mt-16 flex flex-col gap-2 border-t border-black/[0.08] pt-8 text-xs text-apple-secondary md:flex-row md:items-center md:justify-between">
        <span>
          王化康 · Kyson · Sightes · {EMAIL} · © 2026
        </span>
        <span className="text-apple-secondary/80">
          Next.js · R3F · GSAP
        </span>
      </footer>
    </SectionReveal>
  );
}
