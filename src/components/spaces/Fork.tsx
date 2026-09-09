"use client";

// Entrance → Personal / Professional
// 两扇尚未完全打开的门：门缝透光、隐约的内部内容碎片、靠近时浮现的内心独白。
// Personal 可进入；Professional 只被看见，本阶段不实现内部。

import type { CSSProperties } from "react";
import { fork } from "@/data/content";
import { Door } from "./primitives";
import { TraceImage, TraceLightDot } from "./traces";

export function Fork({
  onPersonal,
  onBack,
}: {
  onPersonal: () => void;
  onBack: () => void;
}) {
  return (
    <>
      {/* 房间层：门之外的夜色铺满视口 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        {/* 左远处一扇暖窗，与门上方的远光呼应 */}
        <TraceImage
          className="t-farther room-window"
          style={{ left: "9vw", top: "16vh" } as CSSProperties}
        />
        {/* 两侧低处各有一盏很远的灯 */}
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              left: "11vw",
              bottom: "20vh",
              animationDelay: "6s",
              animationDuration: "24s",
            } as CSSProperties
          }
        />
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              right: "9vw",
              bottom: "16vh",
              animationDelay: "12s",
              animationDuration: "20s",
            } as CSSProperties
          }
        />
        <span className="room-horizon" />
      </div>

      <div className="room-content shell-fork relative mx-auto flex w-full flex-col items-center gap-12">
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
          className="fork-prompt reveal font-serif text-ember-soft"
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
    </>
  );
}
