import { SectionReveal } from "@/components/SectionReveal";

const skills = [
  {
    title: "Microsoft Outlook",
    detail: "Buyer/supplier threads, calendar coordination, structured follow-ups across time zones.",
  },
  {
    title: "Microsoft Excel",
    detail: "Order trackers, pivot summaries, inventory snapshots, and clean handoff sheets.",
  },
  {
    title: "Supply-chain operations",
    detail: "PO follow-through, production milestones, logistics status, and exception handling.",
  },
  {
    title: "Foreign trade documentation",
    detail: "Commercial paperwork awareness — invoices, packing lists, and shipment readiness checks.",
  },
  {
    title: "Optical fiber product ops",
    detail: "SKU familiarity and ops support for fiber-related orders at Sightes.",
  },
  {
    title: "Cross-border communication",
    detail: "Clear written English/Chinese coordination with factories and overseas partners.",
  },
];

export function Skills() {
  return (
    <SectionReveal id="skills" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
        Skills
      </p>
      <h2 className="mt-4 max-w-xl text-3xl tracking-tight text-mist-100 md:text-4xl">
        Tools I actually use at work
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-mist-400">
        Not a fake frontend stack list — these are day-to-day ops strengths.
      </p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <li
            key={s.title}
            className="rounded-2xl border border-white/5 bg-ink-900/40 p-5"
          >
            <h3 className="text-base text-mist-100">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">{s.detail}</p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
