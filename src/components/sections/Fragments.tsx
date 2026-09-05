// 生活碎片：照片 / 音乐 / 小物件 / 瞬间。
// 照片位是空槽，方便你之后直接放进自己的真实照片。

import { fragments, type Fragment } from "@/data/fragments";
import { Section } from "../ui/Section";

const kindLabel: Record<Fragment["kind"], string> = {
  photo: "照片",
  music: "音乐",
  object: "物件",
  moment: "瞬间",
};

const kindMark: Record<Fragment["kind"], string> = {
  photo: "",
  music: "♪",
  object: "◯",
  moment: "·",
};

export function Fragments() {
  return (
    <Section id="fragments" index="02" zh="碎片" en="Fragments">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {fragments.map((f) => (
          <article
            key={f.id}
            className="rounded-sm border border-rule bg-paper-soft/40 p-5"
          >
            {f.kind === "photo" ? (
              <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-sm border border-dashed border-rule text-xs text-ink-faint">
                照片位 · 你的照片放这里
              </div>
            ) : (
              <p className="mb-3 font-serif text-lg text-ink-soft">{kindMark[f.kind]}</p>
            )}
            <p className="font-serif text-sm text-ink-faint">{kindLabel[f.kind]}</p>
            <h3 className="mt-1 font-serif text-lg text-ink">{f.title}</h3>
            {f.note && (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.note}</p>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
