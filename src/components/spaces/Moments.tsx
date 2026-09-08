"use client";

// Moments 内容空间：蜿蜒暖光路径 + 极淡记忆痕迹。
// 一条 SVG 暖光虚线像在深色桌面上随手画的记号，
// 沿线散落 6 个 Moment 痕迹——极淡琥珀底色 + 1px 暗边，
// 像压在桌上的极薄纸片。没有 box-shadow。
// 蓝调里渗入极淡琥珀色，稍微明快但不跳脱。
// 移动端放弃蜿蜒路径，改为纵向单列流。

import { type CSSProperties } from "react";
import { momentsSpace } from "@/data/content";

// SVG 路径节点坐标（viewBox 768 x 600）
// 从上到下蜿蜒：左上 → 右上 → 再右上 → 右下 → 左下 → 再左下
const PATH_POINTS = [
  { x: 80, y: 80 },
  { x: 280, y: 180 },
  { x: 520, y: 120 },
  { x: 640, y: 300 },
  { x: 380, y: 440 },
  { x: 160, y: 520 },
];
// 贝塞尔曲线：让路径自然弯曲
const PATH_D =
  "M 80 80 C 150 120, 220 180, 280 180" +
  " C 340 180, 460 120, 520 120" +
  " C 580 120, 620 200, 640 300" +
  " C 650 400, 500 440, 380 440" +
  " C 260 440, 200 500, 160 520";

// 暖色光斑（琥珀偏）
const GLOWS = [
  { left: "35%", top: "30%", w: "320px", h: "240px", c: "rgba(240,200,160,0.15)" },
  { left: "60%", top: "75%", w: "280px", h: "220px", c: "rgba(230,180,140,0.11)" },
  { left: "5%", top: "55%", w: "260px", h: "200px", c: "rgba(220,170,130,0.1)" },
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
        className="reveal mt-4 mb-8 font-serif text-base text-ember-soft"
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

      {/* 蜿蜒路径 + 沿线痕迹 */}
      <div className="moments-path-wrap">
        {/* SVG 暖光路径 */}
        <svg
          className="moments-path-svg reveal"
          viewBox="0 0 768 600"
          preserveAspectRatio="none"
          style={{ "--i": 2 } as CSSProperties}
        >
          <path className="moments-path" d={PATH_D} />
          {/* 节点圆点 */}
          {PATH_POINTS.map((p, i) => (
            <circle
              key={i}
              className="moments-node"
              cx={p.x}
              cy={p.y}
              r={2.5}
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </svg>

        {/* Moment 痕迹：沿线左右交替散落 */}
        {entries.map((m, i) => {
          const p = PATH_POINTS[i % PATH_POINTS.length];
          // 偶数靠左、奇数靠右，稍微偏移避免挡路径
          const side = i % 2 === 0 ? -1 : 1;
          const offsetX = side * 70;
          const offsetY = side * 18;
          return (
            <div
              key={m.id}
              className="moment-mark reveal"
              style={
                {
                  "--i": 3 + i,
                  left: `${((p.x + offsetX) / 768) * 100}%`,
                  top: `${((p.y + offsetY) / 600) * 100}%`,
                } as CSSProperties
              }
            >
              <span className="moment-mark__time">{m.time}</span>
              {m.hasImage ? (
                <div className="moment-mark__img">{m.imageDesc}</div>
              ) : null}
              <p className="moment-mark__body">{m.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
