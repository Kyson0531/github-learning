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
    <SectionReveal id="story" className="mx-auto max-w-content page-pad section-y">
      <p className="text-xs font-medium uppercase tracking-editorial text-apple-secondary">
        叙事
      </p>
      <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {beats.map((b) => (
          <li key={b.title} className="border-t border-black/[0.08] pt-6">
            <h2 className="text-[1.5rem] font-semibold tracking-tight text-apple-ink md:text-[2rem]">
              {b.title}
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.55] text-apple-secondary">
              {b.body}
            </p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
