"use client";

// Ideas 内容空间：深夜手稿。
// 进入 Ideas 就是进入阅读本身——这里没有下一级。
// 每一段想法是桌上的一页手稿：冷白纸、极轻的旋转、横向错落；
// 纸与纸之间漂着极淡的时间小注，把段落分开，却让它们
// 顺着同一条时间流。错落来自内容本身：字数不等，纸的长宽随之不同。
// 环境比 Personal 更深一层、更安静：更疏的微尘、更小更远的暖窗、
// 只在纸流尽头隐约亮着的几盏远灯。
// 原则：空间回应，不让空间表演。hover 只让纸轻轻抬起一点。

import { Fragment, type CSSProperties } from "react";
import { ideasSpace } from "@/data/content";
import { TraceImage, TraceLightDot, CLOCK_WARM_IMG } from "./traces";

// 微尘：比 Personal 更疏、更慢——更深一层的房间，更安静
const SPECKS = Array.from({ length: 9 }, (_, i) => ({
  left: (7 + i * 10.4 + (i % 3) * 3.1) % 92,
  size: 1 + (i % 2) * 0.5,
  dur: 27 + ((i * 3) % 5) * 5,
  delay: -((i * 4.3) % 30),
  o: 0.1 + (i % 3) * 0.04,
}));

// 远岸灯：比 Personal 更少、更低，只在纸流尽头隐约亮着
const SHORE = [12, 34, 63, 84];

// 手稿的错落：横向偏移 / 宽度 / 极轻旋转，交替呼吸。
// 字数不等的段落配上宽窄不一的纸，错落从内容里长出来。
const LAYOUT = [
  { ml: "0%", w: "30rem", rot: "-0.7deg" },
  { ml: "15%", w: "26rem", rot: "1deg" },
  { ml: "3%", w: "31rem", rot: "-0.4deg" },
  { ml: "21%", w: "25.5rem", rot: "0.8deg" },
  { ml: "6%", w: "29rem", rot: "-1deg" },
];

export function Ideas({ onBack }: { onBack: () => void }) {
  const { ambient, entries, endNote } = ideasSpace;

  return (
    <div className="ideas-stage relative mx-auto w-full max-w-3xl">
      {/* 顶栏：返回 + 空间名（与 Things 同构） */}
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

      {/* 顶部一束更弱的冷光，让手稿流起始于微亮的桌面 */}
      <span
        aria-hidden
        className="t-far pointer-events-none absolute inset-x-2 -top-8 h-64"
        style={{
          background:
            "radial-gradient(48% 62% at 52% 0%, rgba(196,210,230,0.09), transparent 72%)",
        }}
      />

      {/* 右上角：同一扇暖窗，更小更远——还是那栋房子，更深的一个房间 */}
      <TraceImage
        src={CLOCK_WARM_IMG}
        className="absolute -top-14 right-[-2%] w-28 sm:w-36"
      />

      {/* 手稿流 */}
      <div className="ideas-flow relative mt-6">
        {/* 空气：极疏的微尘 */}
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

        {entries.map((idea, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          return (
            <Fragment key={idea.date}>
              {/* 纸间时间注：把段落分开的是时间，也是它把段落连成一条流 */}
              <span
                className="idea-gap reveal"
                style={{ "--i": 2 + i * 2, "--gml": l.ml } as CSSProperties}
              >
                · {idea.date}
              </span>
              <article
                className="idea-sheet reveal"
                style={
                  {
                    "--i": 3 + i * 2,
                    "--ml": l.ml,
                    "--w": l.w,
                    "--rot": l.rot,
                  } as CSSProperties
                }
              >
                {idea.title ? (
                  <h2 className="idea-sheet__title">{idea.title}</h2>
                ) : null}
                <p className="idea-sheet__body">{idea.body}</p>
              </article>
            </Fragment>
          );
        })}

        {/* 纸流尽头的一小句：页面安静地收住，不硬收边 */}
        <p
          className="ideas-end reveal"
          style={{ "--i": 2 + entries.length * 2 } as CSSProperties}
        >
          {endNote}
        </p>

        {/* 尽头远岸的几盏灯，很低很远 */}
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
  );
}
