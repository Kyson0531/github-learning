import { SectionReveal } from "@/components/SectionReveal";

export function About() {
  return (
    <SectionReveal id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
            About
          </p>
          <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
            Ops-minded. Trade-fluent.
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-5 text-mist-300 leading-relaxed">
          <p>
            I am Kyson Wang (王化康), working at Sightes on foreign-trade
            coordination and optical-fiber operations. My focus is keeping
            orders, documents, and supply-chain handoffs accurate and on time—
            from inquiry through shipment.
          </p>
          <p>
            Day to day that means clear email threads, careful spreadsheet
            tracking, and steady communication across factories, logistics, and
            overseas buyers. I care about process that holds up when volume
            spikes.
          </p>
          <p className="text-mist-400 text-sm">
            Based in China · Working across time zones with international partners
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}
