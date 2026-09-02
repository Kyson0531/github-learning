"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { CopyEmailButton, EMAIL } from "@/components/CopyEmail";

export function Contact() {
  return (
    <SectionReveal id="contact" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="rounded-3xl border border-white/[0.07] bg-ink-900/55 p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
          联系
        </p>
        <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
          一起把链路理顺
        </h2>
        <p className="mt-4 max-w-xl text-mist-300 leading-relaxed">
          若你在做外贸流程、样品/仓配信息，或想把现有表格收成更可行动的结构，欢迎写信。
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="text-lg text-mist-100 transition hover:text-fiber-cyan"
          >
            {EMAIL}
          </a>
          <CopyEmailButton compact label="复制邮箱" />
        </div>
      </div>
      <footer className="mt-16 flex flex-col gap-2 border-t border-white/[0.06] pt-8 text-xs text-mist-300 md:flex-row md:items-center md:justify-between">
        <span>
          王化康 · Kyson · Sightes · {EMAIL} · © 2026
        </span>
        <span className="font-mono text-mist-400">
          Next.js · R3F · GSAP
        </span>
      </footer>
    </SectionReveal>
  );
}
