"use client";

// Personal 空间：Things / Ideas / Moments。
// 入口形态：三张错落层叠的纸，各自极慢漂浮（动画在包裹层，
// 不触碰纸本身的 reveal / hover / whisper）。Things 可进入，
// Ideas / Moments 本阶段只有入口视觉。
// 氛围：蓝调夜色里，微尘落得很慢，低处是远岸的一排暖灯，
// 右上角一团暖的虚化照片——像夜色里一扇亮着灯的窗。

import type { CSSProperties } from "react";
import { personal } from "@/data/content";
import { EnvFragment } from "./primitives";
import {
  TraceImage,
  TraceLightDot,
  TraceWindowCorner,
  TraceFadedWriting,
  TracePrintGhost,
  CLOCK_WARM_IMG,
} from "./traces";

// 极疏的微尘 / 落雪：位置固定、周期各异，非同步
const SPECKS = Array.from({ length: 14 }, (_, i) => ({
  left: (5 + i * 6.6 + (i % 3) * 2.4) % 94,
  size: 1 + (i % 3) * 0.6,
  dur: 23 + ((i * 3) % 5) * 4,
  delay: -((i * 3.7) % 26),
  o: 0.12 + (i % 4) * 0.05,
}));

// 远岸的一排暖灯（很低、很远，t-far 自带模糊）
const SHORE_LIGHTS = [6, 16, 27, 40, 55, 68, 80, 90];

export function Personal({ onThings }: { onThings: () => void }) {
  const { things, ideas, moments, fragments } = personal;
  return (
    <div className="mx-auto w-full max-w-3xl">
      <p
        className="reveal mb-10 font-serif text-base text-ember-soft"
        style={{ "--i": 0 } as CSSProperties}
      >
        {personal.ambient}
      </p>

      <div className="relative">
        {/* 空气：极疏的微尘，落得很慢 */}
        <span className="air-layer" aria-hidden>
          {SPECKS.map((s, i) => (
            <span
              key={i}
              className="air-speck"
              style={
                {
                  left: `${s.left}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  "--sd": `${s.dur}s`,
                  "--sdel": `${s.delay}s`,
                  "--o": s.o,
                } as CSSProperties
              }
            />
          ))}
        </span>

        {/* 背后的一束冷顶光 */}
        <span
          aria-hidden
          className="t-far pointer-events-none absolute inset-x-2 -top-10 h-72"
          style={{
            background:
              "radial-gradient(48% 62% at 56% 0%, rgba(196,210,230,0.10), transparent 72%)",
          }}
        />

        {/* 右上角：暖的虚化照片——夜色里一扇亮着灯的窗 */}
        <TraceImage
          src={CLOCK_WARM_IMG}
          className="absolute -top-16 right-[1%] w-40 sm:w-52"
        />

        {/* 远岸的一排暖灯 */}
        {SHORE_LIGHTS.map((x, i) => (
          <TraceLightDot
            key={x}
            className="absolute"
            style={
              {
                left: `${x}%`,
                top: `${93 + (i % 2) * 2.2}%`,
                animationDelay: `${i * 2.3}s`,
                animationDuration: `${15 + (i % 3) * 4}s`,
              } as CSSProperties
            }
          />
        ))}

        {/* 左侧墙里半扇窗框，只露一角 */}
        <TraceWindowCorner className="absolute -left-4 top-[34%] w-14" />
        {/* 中下空处：被擦掉的一行字 */}
        <TraceFadedWriting className="absolute bottom-[8%] left-[24%] w-28" />
        {/* 纸间空墙上：一张被撕掉的东西留下的色差 */}
        <TracePrintGhost className="absolute right-[27%] top-[46%] h-24 w-20 rotate-2" />

        {/* —— 三张错落层叠、各自慢漂浮的入口纸 —— */}

        {/* Things · 居中偏上，压在最上层 */}
        <div
          className="sheet-float relative z-20 mx-auto w-[min(100%,16rem)]"
          style={{ "--fd": "21s", "--fdelay": "-4s" } as CSSProperties}
        >
          <button
            type="button"
            className="paper paper-card enterable reveal block w-full"
            style={{ "--i": 1, "--rot": "-1.5deg" } as CSSProperties}
            onClick={onThings}
            aria-label="进入 Things"
          >
            <p className="paper-title">{things.label}</p>
            <p className="paper-meaning">{things.meaning}</p>
            <p className="paper-whisper">{things.whisper}</p>
          </button>
        </div>

        {/* Ideas · 左下，一角压在 Things 后面 */}
        <div
          className="sheet-float relative z-10 ml-[6%] -mt-12 w-[min(100%,14rem)]"
          style={{ "--fd": "17s", "--fdelay": "-11s" } as CSSProperties}
        >
          <div
            className="paper paper-card reveal w-full"
            style={{ "--i": 2, "--rot": "2deg" } as CSSProperties}
            aria-disabled
          >
            <p className="paper-title">{ideas.label}</p>
            <p className="paper-meaning">{ideas.meaning}</p>
            <p className="paper-whisper">{ideas.whisper}</p>
          </div>
        </div>

        {/* Moments · 右下，更小更远一点的一张纸条 */}
        <div
          className="sheet-float relative z-10 mr-[2%] -mt-16 ml-auto w-[min(100%,11.5rem)]"
          style={{ "--fd": "24s", "--fdelay": "-17s" } as CSSProperties}
        >
          <div
            className="paper paper-card reveal w-full"
            style={{
              "--i": 3,
              "--rot": "-2.6deg",
              opacity: "0.94",
            } as CSSProperties}
            aria-disabled
          >
            <p className="paper-title">{moments.label}</p>
            <p className="paper-meaning">{moments.meaning}</p>
            <p className="paper-whisper">{moments.whisper}</p>
          </div>
        </div>

        {/* 环境碎片：只暗示这里已有内容 */}
        <EnvFragment
          className="reveal absolute right-[2%] top-[6%] text-xs"
          style={{ "--i": 7 } as CSSProperties}
        >
          {fragments[0]}
        </EnvFragment>
        <EnvFragment
          className="reveal absolute bottom-[2%] left-[6%] text-xs"
          style={{ "--i": 8 } as CSSProperties}
        >
          {fragments[1]}
        </EnvFragment>
        <EnvFragment
          className="reveal absolute bottom-[14%] right-[9%] text-xs"
          style={{ "--i": 9 } as CSSProperties}
        >
          {fragments[2]}
        </EnvFragment>
      </div>
    </div>
  );
}
