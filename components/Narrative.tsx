import { SectionReveal } from "@/components/SectionReveal";

const beats = [
  {
    title: "连接",
    body: "询盘到出货的节点对齐，少空档。",
  },
  {
    title: "信息→行动",
    body: "状态可扫一眼：谁该动、卡在哪。",
  },
  {
    title: "业务先于工具",
    body: "路径清楚再上系统或 AI。",
  },
] as const;

export function Narrative() {
  return (
    <SectionReveal id="story" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
        叙事
      </p>
      <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {beats.map((b) => (
          <li key={b.title} className="border-t border-white/10 pt-6">
            <h2 className="text-xl tracking-tight text-mist-100 md:text-2xl">
              {b.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mist-300 md:text-base">
              {b.body}
            </p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
