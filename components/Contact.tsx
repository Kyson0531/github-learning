import { SectionReveal } from "@/components/SectionReveal";

const links = [
  {
    label: "Email",
    value: "kyson.wang@sightestech.com",
    href: "mailto:kyson.wang@sightestech.com",
  },
  {
    label: "GitHub",
    value: "Kyson0531",
    href: "https://github.com/Kyson0531",
  },
  {
    label: "X",
    value: "@Kyson0531",
    href: "https://x.com/Kyson0531",
  },
];

export function Contact() {
  return (
    <SectionReveal id="contact" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-ink-800/80 to-ink-900/40 p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
          Contact
        </p>
        <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
          Let&apos;s talk trade &amp; ops
        </h2>
        <p className="mt-4 max-w-xl text-mist-300">
          Open to conversations about foreign-trade coordination, optical-fiber
          operations, and process improvements at Sightes or with partners.
        </p>
        <ul className="mt-10 space-y-4">
          {links.map((l) => (
            <li key={l.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-20 font-mono text-[10px] uppercase tracking-editorial text-mist-400">
                {l.label}
              </span>
              <a
                href={l.href}
                className="text-mist-100 transition hover:text-fiber-cyan"
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {l.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <footer className="mt-16 flex flex-col gap-2 border-t border-white/5 pt-8 text-xs text-mist-400 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} Kyson Wang / 王化康</span>
        <span className="font-mono">Built with Next.js · GSAP · Lenis · R3F</span>
      </footer>
    </SectionReveal>
  );
}
