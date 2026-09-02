import { SectionReveal } from "@/components/SectionReveal";

const principles = [
  "先画链路，再碰界面。",
  "字段与状态说人话，和一线用语一致。",
  "原型只验证一件事：能否推动下一步。",
  "AI 只接在已清晰的节点上，不替代判断。",
] as const;

export function Method() {
  return (
    <SectionReveal id="method" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-editorial text-fiber-cyan/80">
        方法
      </p>
      <h2 className="mt-4 text-3xl tracking-tight text-mist-100 md:text-4xl">
        方法
      </h2>
      <ol className="mt-12 max-w-2xl space-y-5">
        {principles.map((line, i) => (
          <li
            key={line}
            className="flex gap-4 border-b border-white/[0.06] pb-5 text-mist-100 last:border-0"
          >
            <span className="font-mono text-xs text-mist-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-base leading-relaxed md:text-lg">{line}</p>
          </li>
        ))}
      </ol>
    </SectionReveal>
  );
}
