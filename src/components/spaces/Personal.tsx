"use client";

// Personal 空间：Things / Ideas / Moments。
// 三张纸，松弛、略微不规则，周围有少量环境碎片（环境不是 UI）。
// Things 可进入；Ideas / Moments 本阶段只有入口视觉与轻微回应。

import type { CSSProperties } from "react";
import { personal } from "@/data/content";
import { EnvFragment } from "./primitives";
import {
  TraceImage,
  TraceLightDot,
  TraceWindowCorner,
  TraceFadedWriting,
  TracePrintGhost,
} from "./traces";

export function Personal({ onThings }: { onThings: () => void }) {
  const { things, ideas, moments, fragments } = personal;
  return (
    <div className="mx-auto w-full max-w-4xl">
      <p
        className="reveal mb-14 font-serif text-base text-ember-soft"
        style={{ "--i": 0 } as CSSProperties}
      >
        {personal.ambient}
      </p>

      <div className="relative">
        {/* —— 视觉痕迹：空间里本来就有的东西，全部在纸的下层、远处 —— */}
        {/* 右上一团模糊的窗光，配一盏极慢呼吸的远灯 */}
        <TraceImage className="absolute -top-12 right-[4%] w-36 sm:w-44" />
        <TraceLightDot
          className="absolute right-[17%] top-2 h-1.5 w-1.5"
          style={{ animationDelay: "0s" } as CSSProperties}
        />
        {/* 左侧墙里半扇窗框，只露一角 */}
        <TraceWindowCorner className="absolute -left-4 top-[34%] w-14" />
        {/* 另一盏远灯，低、远、不同的呼吸节奏 */}
        <TraceLightDot
          className="absolute left-[6%] top-[62%] h-[5px] w-[5px]"
          style={{ animationDelay: "8s", animationDuration: "19s" } as CSSProperties}
        />
        {/* 中下空处：被擦掉的一行字 */}
        <TraceFadedWriting className="absolute bottom-[6%] left-[28%] w-28" />
        {/* 纸间空墙上：一张被撕掉的东西留下的色差 */}
        <TracePrintGhost className="absolute right-[31%] top-[47%] h-24 w-20 rotate-2" />

        {/* Things · 上方偏中，较大 */}
        <button
          type="button"
          className="paper paper-card enterable reveal mx-auto block"
          style={{ "--i": 1, "--rot": "-1.5deg" } as CSSProperties}
          onClick={onThings}
          aria-label="进入 Things"
        >
          <p className="paper-title">{things.label}</p>
          <p className="paper-meaning">{things.meaning}</p>
          <p className="paper-whisper">{things.whisper}</p>
        </button>

        {/* Ideas · 偏左下 */}
        <div
          className="paper paper-card reveal mt-14"
          style={{ "--i": 2, "--rot": "1.3deg", marginLeft: "3%" } as CSSProperties}
          aria-disabled
        >
          <p className="paper-title">{ideas.label}</p>
          <p className="paper-meaning">{ideas.meaning}</p>
          <p className="paper-whisper">{ideas.whisper}</p>
        </div>

        {/* Moments · 偏右下 */}
        <div
          className="paper paper-card reveal mt-6"
          style={
            {
              "--i": 3,
              "--rot": "-0.8deg",
              marginLeft: "auto",
              marginRight: "5%",
            } as CSSProperties
          }
          aria-disabled
        >
          <p className="paper-title">{moments.label}</p>
          <p className="paper-meaning">{moments.meaning}</p>
          <p className="paper-whisper">{moments.whisper}</p>
        </div>

        {/* 环境碎片：只暗示这里已有内容 */}
        <EnvFragment
          className="reveal absolute right-[2%] top-[6%] text-xs"
          style={{ "--i": 4 } as CSSProperties}
        >
          {fragments[0]}
        </EnvFragment>
        <EnvFragment
          className="reveal absolute bottom-[2%] left-[6%] text-xs"
          style={{ "--i": 5 } as CSSProperties}
        >
          {fragments[1]}
        </EnvFragment>
        <EnvFragment
          className="reveal absolute bottom-[10%] right-[10%] text-xs"
          style={{ "--i": 6 } as CSSProperties}
        >
          {fragments[2]}
        </EnvFragment>
      </div>
    </div>
  );
}
