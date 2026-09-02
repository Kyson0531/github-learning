"use client";

import { CopyEmailButton } from "@/components/CopyEmail";

const links = [
  { href: "#work", label: "工作" },
  { href: "#method", label: "方法" },
  { href: "#contact", label: "联系" },
];

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.06] bg-ink-950/65 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a
          href="#"
          className="shrink-0 text-sm tracking-tight text-mist-100 transition hover:text-fiber-cyan"
        >
          王化康
        </a>
        <ul className="flex flex-wrap items-center justify-end gap-5 sm:gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs tracking-editorial text-mist-300 transition hover:text-mist-100"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <CopyEmailButton compact label="复制邮箱" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
