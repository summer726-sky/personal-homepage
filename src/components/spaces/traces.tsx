"use client";

// 视觉痕迹 · Visual Traces
// 空间本来就在那里的东西——被发现，而不是被摆放。
// 全部无内容功能、不可交互；深度用 .t-far / .t-mid / .t-near 表达。
// 材质与光效在 globals.css（.trace-*）；这里只提供形状。

import type { CSSProperties } from "react";

const WINDOW_IMG =
  "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=" +
  encodeURIComponent(
    "out of focus blue hour window view, warm yellow street lights as soft bokeh seen through glass at night, deep blue grey twilight city, quiet misty mood, cinematic soft light, abstract blur, no text, no people, low contrast"
  ) +
  "&image_size=landscape_4_3";

/* 图片碎片：一块模糊的窗/夜景，裁切融入背景，像记忆残片 */
export function TraceImage({
  className = "",
  style,
  src,
}: {
  className?: string;
  style?: CSSProperties;
  src?: string;
}) {
  return (
    <img
      src={src ?? WINDOW_IMG}
      alt=""
      aria-hidden
      className={`trace trace-img t-far ${className}`}
      style={style}
    />
  );
}

/* 远灯：一盏极小的暖色灯（窗 / 路灯）。live 时极慢呼吸，否则静止 */
export function TraceLightDot({
  className = "",
  style,
  live = true,
}: {
  className?: string;
  style?: CSSProperties;
  live?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`trace trace-dot t-far ${live ? "live" : ""} ${className}`}
      style={style}
    />
  );
}

/* 窗框的一角：只露两条边，暗示画外有一扇窗 */
export function TraceWindowCorner({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={`trace t-mid ${className}`}
      style={style}
      fill="none"
    >
      <path className="trace-line" d="M6 74 L6 6 L74 6" strokeWidth="0.8" />
      <path
        className="trace-line"
        d="M6 34 L30 34"
        strokeWidth="0.7"
        opacity="0.6"
      />
    </svg>
  );
}

/* 被擦掉的一行字：断续的书写痕迹，不承载任何可读内容 */
export function TraceFadedWriting({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 140 36"
      aria-hidden
      className={`trace t-far ${className}`}
      style={style}
      fill="none"
    >
      <path
        className="trace-faded-writing"
        d="M4 10 h26 M36 10 h14 M62 10 h30 M98 10 h12
           M8 22 h18 M32 22 h34 M72 22 h22 M100 22 h24"
        strokeDasharray="1 0"
        strokeWidth="1.4"
        opacity="0.55"
      />
      <path
        className="trace-faded-writing"
        d="M14 22 h8 M52 22 h10 M84 22 h6"
        strokeWidth="1.4"
        opacity="0.3"
      />
    </svg>
  );
}

/* 印刷残痕：被撕掉的东西在墙上留下的一块色差 */
export function TracePrintGhost({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`trace trace-print t-far ${className}`}
      style={style}
    />
  );
}
