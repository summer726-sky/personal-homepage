"use client";

// Entrance → Personal / Professional
// 两扇尚未完全打开的门：门缝透光、隐约的内部内容碎片、靠近时浮现的内心独白。
// Personal 可进入；Professional 只被看见，本阶段不实现内部。

import type { CSSProperties } from "react";
import { fork } from "@/data/content";
import { Door } from "./primitives";
import { TraceLightDot, TraceImage } from "./traces";

export function Fork({
  onPersonal,
  onBack,
}: {
  onPersonal: () => void;
  onBack: () => void;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
      {/* 返回上一级：左上角一抹细线箭头，最后才浮现，安静得像墙面的一部分 */}
      <button
        type="button"
        onClick={onBack}
        className="space-back reveal absolute left-0 top-0"
        style={{ "--i": 3 } as CSSProperties}
        aria-label="返回上一级"
      >
        <span className="space-back__arrow" aria-hidden>←</span>
        <span>返回</span>
      </button>

      {/* 两扇门之上：一团模糊的远窗光和一盏灯，像街对面 */}
      <TraceImage className="-top-16 left-[12%] w-32" />
      <TraceLightDot
        className="-top-10 right-[24%] h-1.5 w-1.5"
        style={{ animationDelay: "5s", animationDuration: "21s" } as CSSProperties}
      />

      <p
        className="reveal font-serif text-xl text-ember-soft sm:text-2xl"
        style={{ "--i": 0 } as CSSProperties}
      >
        {fork.prompt}
      </p>

      <div
        className="reveal flex flex-col items-stretch gap-6 sm:flex-row sm:gap-10"
        style={{ "--i": 1 } as CSSProperties}
      >
        <Door side="left" {...fork.personal} onEnter={onPersonal} />
        <Door side="right" {...fork.professional} />
      </div>
    </div>
  );
}
