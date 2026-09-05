// 未来：方向 / 问题 / 想象。允许模糊与不确定。

import { futureItems, type FutureItem } from "@/data/future";
import { Section } from "../ui/Section";

const kindLabel: Record<FutureItem["kind"], string> = {
  direction: "方向",
  question: "问题",
  imagining: "想象",
};

export function Future() {
  return (
    <Section id="future" index="05" zh="未来" en="Future">
      <div className="space-y-8">
        {futureItems.map((f) => (
          <div key={f.id}>
            <p className="font-serif text-sm text-ink-faint">{kindLabel[f.kind]}</p>
            <p className="mt-1.5 font-serif text-lg leading-relaxed text-ink">{f.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
