"use client";

// Things 内容空间 V2：3D 透视轮播。
// 复刻 Vynora 的卡片形态、3D 轮播动效、点击切换交互、镜面反射与暗色光泽背景。
// 卡片本身无图案图样，是内容载体（真实内容随后由用户填入）。
// 中央卡片点击进入更深一层；两侧卡片点击移到中央。底部播放栏不实现。
// 视觉与 Personal 蓝调夜色一脉相承：墙是夜色，地板是镜面，卡片是冷白纸。

import { useCallback, useState, type CSSProperties } from "react";
import { thingsCards } from "@/data/content";

const CARDS = thingsCards;
const N = CARDS.length;
const HALF = Math.floor(N / 2);

// 循环相对偏移：始终落在 [-HALF, HALF] 区间，让轮播首尾相接
function relOffset(i: number, active: number): number {
  return (((i - active + N + HALF) % N) - HALF);
}

// 依据相对偏移计算 slot 的 transform / opacity / filter / z-index。
// slot 保持矩形（无 rotateY / translateZ）——这是 click hit area，
// 必须规则矩形以保证侧卡片点击可靠命中。
// 3D 倾斜感由 .vynora-card 子元素的 rotateY（视觉层）+ 透视容器共同营造。
function cardStyle(offset: number): CSSProperties {
  const abs = Math.abs(offset);
  // 仅 ±2 内可见；更远的卡片隐藏，但仍占位参与循环
  if (abs > 2) {
    return {
      opacity: 0,
      pointerEvents: "none" as const,
      transform: "translateX(-99rem)",
      zIndex: 0,
    };
  }
  return {
    transform: `translateX(${offset * 8.5}rem) scale(${1 - abs * 0.08})`,
    opacity: 1 - abs * 0.22,
    filter: abs === 0 ? "none" : `brightness(${1 - abs * 0.22}) blur(${abs * 0.5}px)`,
    zIndex: 10 - abs,
  } as CSSProperties;
}

// 卡片本体的视觉 transform：rotateY 朝中心倾斜，营造 3D 透视感。
// 不影响 slot 的 click hit area（这是子元素，不参与父 slot 的 hit-test）。
function cardInnerTransform(offset: number): string {
  const abs = Math.abs(offset);
  if (abs === 0) return "none";
  const sign = offset > 0 ? 1 : -1;
  return `rotateY(${-sign * (abs === 1 ? 28 : 42)}deg)`;
}

export function Things({
  onOpen,
  onBack,
}: {
  onOpen: () => void;
  onBack: () => void;
}) {
  const [active, setActive] = useState(0);

  const handleCard = useCallback(
    (i: number) => {
      const offset = relOffset(i, active);
      if (offset === 0) onOpen();
      else setActive(i);
    },
    [active, onOpen]
  );

  return (
    <div className="things-stage mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
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

      {/* 当前分类名（随轮播切换） */}
      <p
        className="reveal font-serif text-2xl text-ember"
        style={{ "--i": 1 } as CSSProperties}
      >
        {CARDS[active].categoryLabel}
      </p>

      {/* 3D 轮播舞台 */}
      <div
        className="carousel-stage reveal"
        style={{ "--i": 2 } as CSSProperties}
      >
        <div className="carousel-track">
          {CARDS.map((card, i) => {
            const offset = relOffset(i, active);
            return (
              <div
                key={card.category}
                className="carousel-card-slot"
                style={cardStyle(offset)}
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
  );
}
