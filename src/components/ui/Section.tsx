// 通用 Section 外壳：统一留白、标题节奏、滚动锚点偏移。
// 内容与 UI 解耦：各 section 组件只负责“这一块讲什么”，外壳负责“长什么样”。

import type { ReactNode } from "react";
import { FadeIn } from "./FadeIn";

type SectionProps = {
  id: string;
  /** 序号，如 "01"，仅作安静的视觉标识 */
  index: string;
  zh: string;
  en: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, zh, en, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 px-6 sm:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-3xl py-20 sm:py-28">
        <FadeIn className="mb-10 sm:mb-14">
          <div className="flex items-baseline gap-3 text-ink-faint">
            <span className="font-serif text-sm">{index}</span>
            <span className="font-serif text-sm">{en}</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{zh}</h2>
        </FadeIn>
        <FadeIn>{children}</FadeIn>
      </div>
    </section>
  );
}
