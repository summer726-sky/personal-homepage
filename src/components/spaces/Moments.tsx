"use client";

// Moments 内容空间：轻微蜿蜒的纵向暖光时间线 + 左右交错明信片。
// 时间线用 SVG path 画一条幅度很小的蜿蜒曲线（±3%），
// 线上 6 个呼吸圆点跟随曲线位置（不移动，只有呼吸动画）。
// 时间标签写在时间线的另一侧（与卡片对面）。
// 蓝调里渗入极淡琥珀色，稍微明快但不跳脱。

import { type CSSProperties } from "react";
import { momentsSpace } from "@/data/content";

// 暖色光斑（琥珀偏）
const GLOWS = [
  { left: "10%", top: "20%", w: "280px", h: "220px", c: "rgba(240,200,160,0.12)" },
  { left: "75%", top: "60%", w: "260px", h: "200px", c: "rgba(230,180,140,0.1)" },
  { left: "30%", top: "85%", w: "240px", h: "180px", c: "rgba(220,170,130,0.08)" },
];

// 蜿蜒路径节点 x（viewBox 宽 100），幅度 ±3px（容器宽度约 ±1.5%）
const WOBBLE_X = [47, 53, 46, 54, 48, 52];

// 估算每个 row 在容器中的中心 y 百分比
// 假设有图卡约占 22%，纯文字卡约占 14%，gap 约 3%
function estimateRowCenters(count: number): number[] {
  const heights = [22, 14, 22, 14, 14, 14]; // 百分比估算
  const gap = 3;
  let y = 3; // 顶部 padding
  const centers: number[] = [];
  for (let i = 0; i < count; i++) {
    const h = heights[i] ?? 15;
    centers.push(y + h / 2);
    y += h + gap;
  }
  return centers;
}

export function Moments({ onBack }: { onBack: () => void }) {
  const { ambient, entries } = momentsSpace;
  const centers = estimateRowCenters(entries.length);

  // 生成蜿蜒 SVG path（viewBox 0 0 100 100，y 用百分比）
  let d = `M ${WOBBLE_X[0]} ${centers[0]}`;
  for (let i = 1; i < entries.length; i++) {
    const px = WOBBLE_X[i - 1];
    const py = centers[i - 1];
    const cx = WOBBLE_X[i];
    const cy = centers[i];
    const cpx1 = px + (cx - px) * 0.5;
    const cpx2 = cx - (cx - px) * 0.5;
    const cpy1 = py + (cy - py) * 0.5;
    const cpy2 = cy - (cy - py) * 0.5;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${cx} ${cy}`;
  }

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

      {/* 蜿蜒时间线 + 交错明信片 */}
      <div className="moments-timeline">
        {/* 蜿蜒暖光路径（仅画曲线；圆点用 HTML 元素保证正圆） */}
        <svg
          className="moments-timeline__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            className="moments-timeline__path"
            d={d}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 时间线上的呼吸圆点：HTML 元素，绝对定位，保持正圆 */}
        {entries.map((_, i) => (
          <span
            key={i}
            className="moments-timeline__dot"
            style={
              {
                left: `${WOBBLE_X[i]}%`,
                top: `${centers[i]}%`,
                animationDelay: `${i * 0.6}s`,
              } as CSSProperties
            }
          />
        ))}

        {entries.map((m, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={m.id}
              className={`moment-row moment-row--${isLeft ? "left" : "right"}`}
            >
              {/* 时间标签：在时间线另一侧 */}
              <span
                className="moment-time reveal"
                style={{ "--i": 2 + i } as CSSProperties}
              >
                {m.time}
              </span>

              {/* 明信片卡片 */}
              <div
                className="moment-postcard reveal"
                style={{ "--i": 2 + i } as CSSProperties}
              >
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
