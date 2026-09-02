"use client";

import { CopyEmailButton } from "@/components/CopyEmail";

const links = [
  { href: "#work", label: "工作" },
  { href: "#method", label: "方法" },
  { href: "#contact", label: "联系" },
];

export function Nav() {
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 page-pad py-3">
        <a
          href="#"
          className="shrink-0 text-sm font-medium tracking-tight text-apple-ink transition hover:text-apple-blue"
        >
          王化康
        </a>
        <ul className="flex flex-wrap items-center justify-end gap-5 sm:gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs tracking-editorial text-apple-secondary transition hover:text-apple-ink"
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
