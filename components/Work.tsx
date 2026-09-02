import { SectionReveal } from "@/components/SectionReveal";

const cases = [
  {
    title: "样品仓状态一览",
    tag: "原型",
    meta: "流程 · 光纤",
    summary: "把样品在库/借出/待寄收成一张表，减少口头对账。",
  },
  {
    title: "装箱信息核对清单",
    tag: "原型",
    meta: "流程 · 出货",
    summary: "订单与箱单字段对齐，出货前少一次漏项。",
  },
  {
    title: "询盘跟进节奏板",
    tag: "原型",
    meta: "流程 · 客户",
    summary: "按客户与阶段看跟进，避免只靠聊天记录。",
  },
] as const;

export function Work() {
  return (
    <SectionReveal id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
          工作
        </p>
        <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
          工作
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-mist-300 md:text-base">
          多为业务侧原型与流程实验，标「原型」表示可迭代，非成品承诺。
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {cases.map((c) => (
          <li
            key={c.title}
            className="rounded-2xl border border-white/[0.07] bg-ink-900/50 p-6 transition hover:border-white/15"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-fiber-cyan/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-editorial text-fiber-cyan/90">
                {c.tag}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-editorial text-mist-400">
                {c.meta}
              </span>
            </div>
            <h3 className="mt-4 text-lg text-mist-100 md:text-xl">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist-300">
              {c.summary}
            </p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
