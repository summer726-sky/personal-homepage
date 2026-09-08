"use client";

// Moments 内容空间：纵向暖光时间线 + 左右交错明信片。
// 一条纵向暖光虚线，线上 6 个固定位置的呼吸圆点。
// 每个 Moment 是一张不透明明信片——冷白纸质底 + 极细暗边，
// 交替贴在时间线左右两侧，错落有致。
// 蓝调里渗入极淡琥珀色，稍微明快但不跳脱。

import { type CSSProperties } from "react";
import { momentsSpace } from "@/data/content";

// 暖色光斑（琥珀偏）
const GLOWS = [
  { left: "10%", top: "20%", w: "280px", h: "220px", c: "rgba(240,200,160,0.12)" },
  { left: "75%", top: "60%", w: "260px", h: "200px", c: "rgba(230,180,140,0.1)" },
  { left: "30%", top: "85%", w: "240px", h: "180px", c: "rgba(220,170,130,0.08)" },
];

export function Moments({ onBack }: { onBack: () => void }) {
  const { ambient, entries } = momentsSpace;

  return (
    <div className="moments-stage mx-auto w-full max-w-3xl">
      {/* 返回上一级 */}
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
        className="reveal mt-4 mb-10 font-serif text-base text-ember-soft"
        style={{ "--i": 1 } as CSSProperties}
      >
        {ambient}
      </p>

      {/* 暖色光斑 */}
      {GLOWS.map((g, i) => (
        <span
          key={i}
          className="moments-glow"
          style={
            {
              left: g.left,
              top: g.top,
              width: g.w,
              height: g.h,
              background: `radial-gradient(55% 55% at 50% 50%, ${g.c}, transparent 78%)`,
            } as CSSProperties
          }
        />
      ))}

      {/* 纵向时间线 + 左右交错明信片 */}
      <div className="moments-timeline">
        {/* 时间线：左侧一条暖光虚线 */}
        <div className="moments-timeline__line" aria-hidden />

        {entries.map((m, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={m.id}
              className={`moment-row moment-row--${isLeft ? "left" : "right"}`}
            >
              {/* 时间线上的小圆点——固定位置，不移动 */}
              <div className="moment-row__dot" aria-hidden>
                <span className="moment-row__dot-core" />
              </div>

              {/* 明信片卡片 */}
              <div
                className="moment-postcard reveal"
                style={{ "--i": 2 + i } as CSSProperties}
              >
                <span className="moment-postcard__time">{m.time}</span>
                {m.hasImage ? (
                  <div className="moment-postcard__img">{m.imageDesc}</div>
                ) : null}
                <p className="moment-postcard__body">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
