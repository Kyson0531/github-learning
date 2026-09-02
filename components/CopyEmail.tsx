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
          ? "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-mist-300 transition hover:border-fiber-cyan/40 hover:text-fiber-cyan"
          : "rounded-full border border-fiber-cyan/35 bg-fiber-cyan/10 px-5 py-2.5 text-sm font-medium text-fiber-cyan transition duration-300 hover:border-fiber-cyan/60 hover:bg-fiber-cyan/15 hover:text-mist-100")
      }
      aria-live="polite"
    >
      {copied ? "已复制" : label}
    </button>
  );
}
