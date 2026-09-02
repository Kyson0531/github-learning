"use client";

import { useState } from "react";

export const EMAIL = "858154849@qq.com";

export function CopyEmailButton({
  className = "",
  label = "复制邮箱",
  compact = false,
}: {
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("复制邮箱：", EMAIL);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={
        className ||
        (compact
          ? "inline-flex h-9 items-center rounded-full border border-black/[0.08] bg-white/80 px-3.5 text-xs text-apple-secondary transition hover:border-apple-blue/35 hover:text-apple-blue"
          : "inline-flex h-11 items-center justify-center rounded-full bg-apple-blue px-6 text-[1.0625rem] font-medium text-white transition duration-300 hover:bg-[#0077ED] active:scale-[0.98]")
      }
      aria-live="polite"
    >
      {copied ? "已复制" : label}
    </button>
  );
}
