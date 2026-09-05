"use client";

// V2 空间共享原件。
// 材质感在 globals.css；这里只组装结构与可访问性。
// hover/proximity 的回应全部用 CSS，无持续动画，无 JS 表演。

import type { CSSProperties, ReactNode } from "react";

/* 一张纸。rotation / 偏移由调用方通过 style 传入，构成不规则的呼吸构图。 */
export function Paper({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`paper ${className}`} style={style}>
      {children}
    </div>
  );
}

/* 环境碎片：非常淡的纸片 / 日期 / 半句话。是环境，不是 UI。 */
export function EnvFragment({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`env-fragment ${className}`} style={style}>
      {children}
    </span>
  );
}

/* 极细的向下箭头：告诉访客"这里还有下一层空间"。不是 CTA。 */
export function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="42"
      viewBox="0 0 14 42"
      fill="none"
      className={className}
      aria-hidden
    >
      <line x1="7" y1="2" x2="7" y2="34" stroke="currentColor" strokeWidth="0.6" />
      <path
        d="M2.5 30.5 L7 35 L11.5 30.5"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* 一扇门 / 一个尚未完全打开的房间。
   onEnter 给定则可进入（button），否则仅为可被看见的入口（div）。 */
type DoorProps = {
  label: string;
  zh: string;
  sliver: string;
  whisper: string;
  side: "left" | "right";
  onEnter?: () => void;
};

export function Door({ label, zh, sliver, whisper, side, onEnter }: DoorProps) {
  const cls = `door door-${side}`;
  const face = (
    <>
      <span className="door-glow" />
      <span className="door-crack" />
      <div>
        <span className="door-label">{label}</span>
        <span className="door-zh">{zh}</span>
      </div>
      <div>
        <span className="door-sliver">{sliver}</span>
      </div>
      <span className="door-whisper">{whisper}</span>
    </>
  );

  if (onEnter) {
    return (
      <button type="button" className={cls} onClick={onEnter}>
        {face}
      </button>
    );
  }
  return (
    <div className={cls} aria-disabled>
      {face}
    </div>
  );
}
