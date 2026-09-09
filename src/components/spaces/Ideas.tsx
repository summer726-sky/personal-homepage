"use client";

// Ideas 内容空间：深灰黑卡时间线。
// 卡片形态参考节点工作流工具面板：深灰黑圆角 + 1px 极细暗边 + 轻微内凹阴影。
// 4 种蓝灰色域内变体，从上到下渐深——新的稍亮、旧的更深。
// 时间线：最新在最上方，滚动阅读。
// 每张卡约 100-350 字，错落横向偏移 + 宽窄不一。
// 环境比 Personal 更深一层、更安静。

import { Fragment, type CSSProperties } from "react";
import { ideasSpace } from "@/data/content";
import { TraceImage, TraceLightDot, CLOCK_WARM_IMG } from "./traces";

// 微尘：比 Personal 更疏、更慢
const SPECKS = Array.from({ length: 9 }, (_, i) => ({
  left: (7 + i * 10.4 + (i % 3) * 3.1) % 92,
  size: 1 + (i % 2) * 0.5,
  dur: 27 + ((i * 3) % 5) * 5,
  delay: -((i * 4.3) % 30),
  o: 0.1 + (i % 3) * 0.04,
}));

// 远岸灯：只在纸流尽头隐约亮着
const SHORE = [12, 34, 63, 84];

// 卡片的错落：横向偏移 / 宽度。已移除旋转（深灰黑卡不需要）。
const LAYOUT = [
  { ml: "0%", w: "30rem" },
  { ml: "15%", w: "26rem" },
  { ml: "3%", w: "31rem" },
  { ml: "21%", w: "25.5rem" },
  { ml: "6%", w: "29rem" },
];

// 修饰卡偏移：每张卡背后 2 张错位的暗色调修饰卡，
// 起阴影/纵深感。每个入口的偏移不同，错落从整体里长出来。
const BACK_OFFSETS = [
  // 第一组（Things 位置附近）：向左下扇出
  [
    { l: "-10px", t: "10px", r: "3deg", w: "92%", h: "88%", a: 0.7 },
    { l: "-22px", t: "18px", r: "6deg", w: "86%", h: "82%", a: 0.4 },
  ],
  // 第二组
  [
    { l: "8px", t: "-8px", r: "-3deg", w: "94%", h: "90%", a: 0.7 },
    { l: "-18px", t: "12px", r: "-7deg", w: "88%", h: "84%", a: 0.4 },
  ],
  // 第三组
  [
    { l: "-9px", t: "-7px", r: "-3deg", w: "91%", h: "87%", a: 0.7 },
    { l: "-20px", t: "-14px", r: "2deg", w: "85%", h: "80%", a: 0.4 },
  ],
  // 第四组
  [
    { l: "12px", t: "-6px", r: "2deg", w: "93%", h: "89%", a: 0.7 },
    { l: "-16px", t: "14px", r: "-5deg", w: "87%", h: "83%", a: 0.4 },
  ],
  // 第五组
  [
    { l: "-8px", t: "8px", r: "2deg", w: "90%", h: "86%", a: 0.7 },
    { l: "-19px", t: "-11px", r: "-4deg", w: "84%", h: "79%", a: 0.4 },
  ],
];

export function Ideas({ onBack }: { onBack: () => void }) {
  const { ambient, entries, endNote } = ideasSpace;

  // content.ts 中 entries 已按新→旧排列（十月初 → 八月末），
  // 直接渲染即可，时间线最新在最上方。
  // tone 从上到下递增：上亮下暗。
  const list = entries;

  return (
    <>
      {/* 房间层：微尘、冷顶光、暖窗铺满视口 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />

        {/* 空气：极疏的微尘，随整页滚动分布 */}
        <span className="air-layer air-layer--room">
          {SPECKS.map((s, i) => (
            <span
              key={i}
              className="air-speck"
              style={
                {
                  left: `${s.left}vw`,
                  top: `${(5 + i * 10.3 + (i % 3) * 4) % 92}%`,
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

        {/* 顶部一束更弱的冷光 */}
        <span
          className="t-far"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-2rem",
            height: "16rem",
            background:
              "radial-gradient(48% 62% at 52% 0%, rgba(196,210,230,0.09), transparent 72%)",
          }}
        />

        {/* 右上角：同一扇暖窗，更小更远 */}
        <TraceImage
          src={CLOCK_WARM_IMG}
          className="room-window"
          style={{ right: "10vw", top: "8vh", width: "clamp(6.5rem, 10vw, 10rem)" } as CSSProperties}
        />
      </div>

      <div className="room-content shell-mid relative mx-auto w-full">
      {/* 顶栏：返回 + 空间名 */}
      <div
        className="reveal flex w-full items-center justify-between"
        style={{ "--i": 0 } as CSSProperties}
      >
        <button type="button" onClick={onBack} className="space-back">
          <span className="space-back__arrow" aria-hidden>
            ←
          </span>
          <span>返回</span>
        </button>
        <p className="font-serif text-sm text-ember-soft">Ideas</p>
      </div>

      <p
        className="reveal mt-4 font-serif text-base text-ember-soft"
        style={{ "--i": 1 } as CSSProperties}
      >
        {ambient}
      </p>

      {/* 卡片时间线 */}
      <div className="ideas-flow relative mt-6">
        {list.map((idea, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          const backs = BACK_OFFSETS[i % BACK_OFFSETS.length];
          return (
            <Fragment key={idea.date}>
              {/* 时间注 */}
              <span
                className="idea-gap reveal"
                style={{ "--i": 2 + i * 2, "--gml": l.ml } as CSSProperties}
              >
                · {idea.date}
              </span>
              {/* 卡 + 背后修饰卡：一个 relative 容器包起来 */}
              <div
                className="reveal"
                style={
                  {
                    "--i": 3 + i * 2,
                    marginLeft: l.ml,
                    width: `min(100%, ${l.w})`,
                  } as CSSProperties
                }
              >
                {backs.map((b, bi) => (
                  <span
                    key={bi}
                    className="idea-back-sheet"
                    style={
                      {
                        left: b.l,
                        top: b.t,
                        width: b.w,
                        height: b.h,
                        transform: `rotate(${b.r})`,
                        opacity: b.a,
                      } as CSSProperties
                    }
                  />
                ))}
                <article className="idea-sheet relative z-10">
                  {idea.title ? (
                    <h2 className="idea-sheet__title">{idea.title}</h2>
                  ) : null}
                  <p className="idea-sheet__body">{idea.body}</p>
                </article>
              </div>
            </Fragment>
          );
        })}

        {/* 纸流尽头的一小句 */}
        <p
          className="ideas-end reveal"
          style={{ "--i": 2 + list.length * 2 } as CSSProperties}
        >
          {endNote}
        </p>

        {/* 尽头远岸的几盏灯 */}
        {SHORE.map((x, i) => (
          <TraceLightDot
            key={x}
            className="absolute"
            style={
              {
                left: `${x}%`,
                bottom: `${-4 + (i % 2) * 2}%`,
                animationDelay: `${i * 2.7}s`,
                animationDuration: `${16 + (i % 3) * 4}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      </div>
    </>
  );
}
