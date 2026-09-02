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
    <SectionReveal id="work" className="mx-auto max-w-content page-pad section-y">
      <div className="mb-12 max-w-2xl md:mb-14">
        <p className="text-xs font-medium uppercase tracking-editorial text-apple-secondary">
          工作
        </p>
        <h2 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-apple-ink md:text-[2rem]">
          工作
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.55] text-apple-secondary">
          多为业务侧原型与流程实验，标「原型」表示可迭代，非成品承诺。
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
        {cases.map((c) => (
          <li
            key={c.title}
            className="glass-panel rounded-2xl p-6 transition hover:bg-white/[0.78]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-black/[0.06] bg-white/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-editorial text-apple-secondary">
                {c.tag}
              </span>
              <span className="text-[10px] uppercase tracking-editorial text-apple-secondary">
                {c.meta}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-apple-ink md:text-xl">
              {c.title}
            </h3>
            <p className="mt-3 text-[1.0625rem] leading-[1.55] text-apple-secondary">
              {c.summary}
            </p>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
