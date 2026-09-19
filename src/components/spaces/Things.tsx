"use client";

// Things 内容空间 V2：3D 透视轮播（安静版）。
// 复刻 Vynora 的卡片形态、3D 轮播动效、点击切换交互、镜面反射与暗色光泽背景。
// 卡片本身无图案图样，是内容载体（真实内容随后由用户填入）。
// 中央卡片点击进入更深一层；两侧卡片点击移到中央。底部播放栏不实现。
// 视觉与 Personal 蓝调夜色一脉相承：墙是夜色，地板是镜面，卡片是冷白纸。
//
// 切换氛围：端卡片不横穿舞台——在原位缓缓隐退（外漂 + 模糊 + 淡出），
// 再从另一端缓缓显现（内漂 + 清晰 + 淡入）。类别词随切换直接更替，不加动效。

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { thingsCards } from "@/data/content";

const CARDS = thingsCards;
const N = CARDS.length;
const HALF = Math.floor(N / 2);

// 循环相对偏移：始终落在 [-HALF, HALF] 区间，让轮播首尾相接
function relOffset(i: number, active: number): number {
  return (((i - active + N + HALF) % N) - HALF);
}

// slot 样式（click hit area，保持规则矩形，不用 rotateY / translateZ）。
// 间距走 --slide-gap 变量（CSS 中按视口调整），移动端自动收紧。
// 隐藏卡（|offset| > 2）不再甩到远处，只停在可见边缘外一点：
// 切换时它从边缘原地隐退，或从边缘原地显现，营造安静的呼吸感。
function slotStyle(offset: number): CSSProperties {
  const abs = Math.abs(offset);
  if (abs > 2) {
    const sign = offset > 0 ? "1" : "-1";
    return {
      transform: `translateX(calc(${sign} * var(--slide-gap, 9.5rem) * 1.3)) scale(0.85)`,
      opacity: 0,
      filter: "blur(5px) brightness(0.6)",
      pointerEvents: "none" as const,
      zIndex: 0,
    };
  }
  return {
    transform: `translateX(calc(${offset} * var(--slide-gap, 9.5rem))) scale(${1 - abs * 0.08})`,
    opacity: 1 - abs * 0.22,
    filter: abs === 0 ? "none" : `brightness(${1 - abs * 0.22}) blur(${abs * 0.5}px)`,
    zIndex: 10 - abs,
  } as CSSProperties;
}

// 卡片本体的视觉 transform：rotateY 朝中心倾斜，营造 3D 透视感。
// 只作用于视觉层（.vynora-card），不影响 slot 的 click hit area。
function cardInnerTransform(offset: number): string {
  const abs = Math.abs(offset);
  if (abs === 0) return "none";
  const sign = offset > 0 ? 1 : -1;
  return `rotateY(${-sign * (abs === 1 ? 26 : 40)}deg)`;
}

export function Things({
  onOpen,
  onBack,
}: {
  onOpen: (category: string) => void;
  onBack: () => void;
}) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchLock = useRef(false);

  const handleCard = useCallback(
    (i: number) => {
      const offset = relOffset(i, active);
      if (offset === 0) {
        onOpen(CARDS[i].category);
        return;
      }
      setActive(i);
    },
    [active, onOpen]
  );

  // 手指滑动切换（移动端）：向左滑→下一张，向右滑→上一张
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 30) return; // 阈值，避免误触
      if (touchLock.current) return;
      touchLock.current = true;
      setTimeout(() => { touchLock.current = false; }, 350);
      const dir = dx > 0 ? -1 : 1;
      setActive((p) => (p + dir + N) % N);
    },
    [N]
  );

  return (
    <>
      {/* 房间层：冷蓝灰（上方墙）+ 紫（下方地板暮光）横向延展，
          填补轮播舞台上下空区，不进入舞台 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        <span className="haze-things-top" />
        <span className="haze-things-bottom" />
      </div>

      <div className="room-content things-stage mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
      {/* 顶栏：返回 + 空间名 */}
      <div
        className="reveal flex w-full items-center justify-between px-2"
        style={{ "--i": 0 } as CSSProperties}
      >
        <button type="button" onClick={onBack} className="things-back">
          ← 回到入口
        </button>
        <p className="font-serif text-sm text-ember-soft">Things</p>
      </div>

      {/* 当前分类名：随切换直接更替，不加动效 */}
      <p className="things-category font-serif text-ember">
        {CARDS[active].categoryLabel}
      </p>

      {/* 3D 轮播舞台 */}
      <div
        className="carousel-stage reveal"
        style={{ "--i": 2 } as CSSProperties}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-track">
          {CARDS.map((card, i) => {
            const offset = relOffset(i, active);
            return (
              <div
                key={card.category}
                className="carousel-card-slot"
                style={slotStyle(offset)}
                data-active={offset === 0}
                role="button"
                tabIndex={0}
                aria-label={`${card.categoryLabel} 卡片${offset === 0 ? "，进入" : ""}`}
                onClick={() => handleCard(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCard(i);
                  }
                }}
              >
                <div
                  className="vynora-card"
                  style={{ "--rot-y": cardInnerTransform(offset) } as CSSProperties}
                >
                  <span className="vynora-card-category">{card.categoryLabel}</span>
                  <span className="vynora-card-title">{card.title}</span>
                  <span className="vynora-card-subtitle">{card.subtitle}</span>
                  <span className="vynora-card-whisper">{card.whisper}</span>
                </div>
                {/* 镜面倒影 */}
                <span className="vynora-card-reflect" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>

      {/* 提示 */}
      <p
        className="reveal text-xs text-ember-faint"
        style={{ "--i": 3 } as CSSProperties}
      >
        点击两侧卡片切换 · 中央卡片进入
      </p>
      </div>
    </>
  );
}
