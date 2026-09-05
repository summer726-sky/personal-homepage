// “现在的我”：正在学习 / 正在做 / 最近关注 / 最近在想。
// 像随手记下的状态，会随时间更新。

import { nowBlocks, nowUpdated } from "@/data/now";
import { Section } from "../ui/Section";

export function Now() {
  return (
    <Section id="now" index="01" zh="现在" en="Now">
      <p className="mb-10 text-sm text-ink-faint">最近更新 · {nowUpdated}</p>
      <div className="space-y-10">
        {nowBlocks.map((block) => (
          <div key={block.label}>
            <p className="font-serif text-sm text-ink-faint">{block.label}</p>
            <ul className="mt-3 space-y-1.5 text-ink">
              {block.items.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
