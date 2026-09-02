import { SectionReveal } from "@/components/SectionReveal";

const principles = [
  "先画链路，再碰界面。",
  "字段与状态说人话，和一线用语一致。",
  "原型只验证一件事：能否推动下一步。",
  "AI 只接在已清晰的节点上，不替代判断。",
] as const;

export function Method() {
  return (
    <SectionReveal id="method" className="mx-auto max-w-content page-pad section-y">
      <p className="text-xs font-medium uppercase tracking-editorial text-apple-secondary">
        方法
      </p>
      <h2 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-apple-ink md:text-[2rem]">
        方法
      </h2>
      <ol className="mt-12 max-w-2xl space-y-0">
        {principles.map((line, i) => (
          <li
            key={line}
            className="flex gap-4 border-b border-black/[0.08] py-5 text-apple-ink last:border-0"
          >
            <span className="pt-0.5 text-xs tabular-nums text-apple-secondary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[1.0625rem] leading-[1.55] md:text-lg">{line}</p>
          </li>
        ))}
      </ol>
    </SectionReveal>
  );
}
