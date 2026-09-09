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
  TraceWindowCorner,
  TraceFadedWriting,
  TracePrintGhost,
} from "./traces";

// 层叠衬纸：每张入口纸背后错位扇出，近层稍实、远层淡入背景，
// 并向相邻入口方向伸展。依据手绘示意图的层叠关系。
type Back = { l: string; t: string; r: string; a: number; bl: string; far?: boolean };
const BACK: Record<string, Back[]> = {
  // Things 居中偏上：向左下（Ideas 方向）扇出
  things: [
    { l: "-12px", t: "12px", r: "4deg", a: 0.14, bl: "1px" },
    { l: "-25px", t: "22px", r: "8deg", a: 0.06, bl: "2.5px", far: true },
  ],
  // Ideas 左下：远层向左外扇出，近层向右上（Things 方向）
  ideas: [
    { l: "10px", t: "-12px", r: "-4deg", a: 0.13, bl: "1px" },
    { l: "-24px", t: "14px", r: "-9deg", a: 0.055, bl: "2.5px", far: true },
  ],
  // Moments 右下较小：向左上（中心方向）扇出
  moments: [
    { l: "-11px", t: "-10px", r: "-4deg", a: 0.12, bl: "1px" },
    { l: "-21px", t: "-18px", r: "3deg", a: 0.05, bl: "2.5px", far: true },
  ],
};

// 连接纸：漂在入口之间的空隙里，把不同入口连成同一个空间
const LINKS = [
  // 下方一条：Ideas 到 Moments
  { left: "13%", top: "74%", w: "56%", h: 118, r: "-3deg", a: 0.05 },
  // 中部：Things 向下两个入口之间
  { left: "40%", top: "56%", w: 196, h: 140, r: "7deg", a: 0.04 },
];

function BackSheets({ id }: { id: string }) {
  return (
    <>
      {BACK[id].map((b, i) => (
        <span
          key={i}
          aria-hidden
          className={`back-sheet back-sheet--in${b.far ? " back-sheet--far" : ""}`}
          style={
            {
              left: b.l,
              top: b.t,
              "--r": b.r,
              "--ga": b.a,
              "--bl": b.bl,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

export function Personal({
  onThings,
  onIdeas,
  onMoments,
  onBack,
}: {
  onThings: () => void;
  onIdeas: () => void;
  onMoments: () => void;
  onBack: () => void;
}) {
  const { things, ideas, moments, fragments } = personal;
  return (
    <>
      {/* 房间层：色雾晕染分布在角落和边界，与首页同源色但不强调暖
          左上冷蓝灰大面积、右下冷蓝灰+极淡暖、底部极淡紫反射 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        <span className="haze-personal-tl" />
        <span className="haze-personal-br" />
        <span className="haze-personal-bottom" />
      </div>

      <div className="room-content shell-mid relative mx-auto w-full">
      {/* 返回上一级：小巧的细线箭头，hover 时轻微左移并亮起 */}
      <button
        type="button"
        onClick={onBack}
        className="space-back reveal"
        style={{ "--i": 0 } as CSSProperties}
        aria-label="返回上一级"
      >
        <span className="space-back__arrow" aria-hidden>←</span>
        <span>返回</span>
      </button>

      <p
        className="reveal mb-10 mt-4 font-serif text-base text-ember-soft"
        style={{ "--i": 1 } as CSSProperties}
      >
        {personal.ambient}
      </p>

      <div className="relative">
        {/* 左侧墙里半扇窗框，只露一角 */}
        <TraceWindowCorner className="absolute -left-4 top-[34%] w-14" />
        {/* 中下空处：被擦掉的一行字 */}
        <TraceFadedWriting className="absolute bottom-[8%] left-[24%] w-28" />
        {/* 纸间空墙上：一张被撕掉的东西留下的色差 */}
        <TracePrintGhost className="absolute right-[27%] top-[46%] h-24 w-20 rotate-2" />

        {/* —— 三张错落层叠、各自慢漂浮的入口纸（纸背后带扇出衬纸） —— */}

        {/* 连接纸：在入口之间的空隙里，把三个入口连成同一个空间 */}
        {LINKS.map((g, i) => (
          <span
            key={i}
            aria-hidden
            className="link-sheet"
            style={
              {
                left: g.left,
                top: g.top,
                width: g.w,
                height: g.h,
                "--r": g.r,
                "--ga": g.a,
              } as CSSProperties
            }
          />
        ))}

        {/* Things · 居中偏上，压在最上层 */}
        <div
          className="sheet-float relative z-20 mx-auto w-[min(100%,16rem)]"
          style={{ "--fd": "21s", "--fdelay": "-4s" } as CSSProperties}
        >
          <BackSheets id="things" />
          <button
            type="button"
            className="paper paper-card enterable reveal relative z-[1] block w-full"
            style={{ "--i": 2, "--rot": "-1.5deg" } as CSSProperties}
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
          <BackSheets id="ideas" />
          <button
            type="button"
            className="paper paper-card enterable reveal relative z-[1] w-full"
            style={{ "--i": 3, "--rot": "2deg" } as CSSProperties}
            onClick={onIdeas}
            aria-label="进入 Ideas"
          >
            <p className="paper-title">{ideas.label}</p>
            <p className="paper-meaning">{ideas.meaning}</p>
            <p className="paper-whisper">{ideas.whisper}</p>
          </button>
        </div>

        {/* Moments · 右下，更小更远一点的一张纸条 */}
        <div
          className="sheet-float relative z-10 mr-[2%] -mt-16 ml-auto w-[min(100%,11.5rem)]"
          style={{ "--fd": "24s", "--fdelay": "-17s" } as CSSProperties}
        >
          <BackSheets id="moments" />
          <button
            type="button"
            className="paper paper-card enterable reveal relative z-[1] w-full"
            style={{
              "--i": 4,
              "--rot": "-2.6deg",
              opacity: "0.94",
            } as CSSProperties}
            onClick={onMoments}
            aria-label="进入 Moments"
          >
            <p className="paper-title">{moments.label}</p>
            <p className="paper-meaning">{moments.meaning}</p>
            <p className="paper-whisper">{moments.whisper}</p>
          </button>
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
    </>
  );
}
