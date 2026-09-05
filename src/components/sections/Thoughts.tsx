// 想法：短文字、问题、随笔。不需要写成正式文章。

import { thoughts } from "@/data/thoughts";
import { Section } from "../ui/Section";

export function Thoughts() {
  return (
    <Section id="thoughts" index="03" zh="想法" en="Thoughts">
      <div className="space-y-10">
        {thoughts.map((t) => (
          <figure key={t.id} className="border-l-2 border-rule pl-5">
            <p className="font-serif text-lg leading-relaxed text-ink">{t.text}</p>
            {t.date && (
              <figcaption className="mt-3 text-xs text-ink-faint">{t.date}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </Section>
  );
}
