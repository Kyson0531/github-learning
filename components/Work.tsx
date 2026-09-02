import { SectionReveal } from "@/components/SectionReveal";

const cases = [
  {
    tag: "Placeholder",
    title: "Fiber order lifecycle tracker",
    summary:
      "Placeholder case study — a spreadsheet-first workflow for tracking optical-fiber POs, production milestones, and shipment status across multiple SKUs.",
    meta: "Ops / Excel · Sightes context",
  },
  {
    tag: "Placeholder",
    title: "Export document checklist",
    summary:
      "Placeholder case study — a repeatable checklist for commercial invoices, packing lists, and certificates so nothing stalls at customs.",
    meta: "Foreign trade · Documentation",
  },
  {
    tag: "Placeholder",
    title: "Buyer inquiry response playbook",
    summary:
      "Placeholder case study — templated Outlook replies and pricing notes that keep first responses fast without sacrificing accuracy.",
    meta: "Outlook / CRM-lite",
  },
];

export function Work() {
  return (
    <SectionReveal id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
            Work
          </p>
          <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
            Selected case studies
          </h2>
        </div>
        <p className="max-w-sm text-sm text-mist-400">
          These entries are clearly marked placeholders until real project write-ups are ready.
        </p>
      </div>
      <ul className="space-y-4">
        {cases.map((c) => (
          <li
            key={c.title}
            className="group rounded-2xl border border-white/5 bg-ink-900/60 p-6 transition hover:border-fiber-cyan/30 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-fiber-amber/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-editorial text-fiber-amber">
                {c.tag}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-editorial text-mist-400">
                {c.meta}
              </span>
            </div>
            <h3 className="mt-4 text-xl text-mist-100 md:text-2xl">{c.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mist-300 md:text-base">
              {c.summary}
            </p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
