// 从前：过去留下来的东西。不是简历时间线，更像记忆与节点。

import { memories } from "@/data/past";
import { Section } from "../ui/Section";

export function Past() {
  return (
    <Section id="past" index="04" zh="从前" en="Past">
      <div className="space-y-8">
        {memories.map((m) => (
          <div key={m.id} className="grid grid-cols-[5rem_1fr] gap-4">
            <p className="font-serif text-sm text-ink-faint">{m.year}</p>
            <div>
              <p className="font-serif text-lg text-ink">{m.title}</p>
              {m.note && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{m.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
