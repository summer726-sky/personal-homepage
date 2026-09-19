"use client";

// Photography Gallery · 左侧展示照片 + 右侧四行照片序列（手绘构图）
//
// 构图（手绘参考图）：
//   左侧为当前展示的大照片；右侧为四行照片序列（横/竖屏分行），
//   序列从页面中部一直延伸到右缘，行内卡片间距每行不同。
//   左侧有一条弧形隐没边界（用 mask 椭圆渐变实现，不画线）：
//   序列在边界处柔和过渡显现/隐没；在页面右缘直接切入切出（无过渡）。
// 明暗：背景与 Things 界面同色；左侧（展示照片附近）暗、右侧亮，
//   两区各自均匀，差别微弱但可察觉，无晕染。
// 交互：鼠标滚轮切换照片（前景直接替换，无渐显）；
//   背景序列随滚动横向滑动（rAF 缓动，参考 Things 的过渡节奏），
//   序列以 20 张为周期平铺循环，任意滚动位置都铺满右缘。
// 入场：进入 gallery 时播放一次 bloom 显现；切换照片不触发。

import { useCallback, useEffect, useRef, useState } from "react";
import { photoGallery, type PhotoEntry } from "@/data/content";

// 四行序列（对应手绘图从上到下的空间分布）
// top: 距页面顶部；w/h: 缩略图尺寸；gap: 行内卡片间距（每行不同）；
// opacity/blur: 极轻的层次差异
const GALLERY_ROWS = [
  { top: "15%", w: 92, h: 61, gap: 28, opacity: 0.92, blur: 0,   orientation: "landscape" as const },
  { top: "37%", w: 54, h: 76, gap: 24, opacity: 0.8,  blur: 0.5, orientation: "portrait"  as const },
  { top: "56%", w: 84, h: 56, gap: 34, opacity: 0.85, blur: 0.4, orientation: "landscape" as const },
  { top: "72%", w: 58, h: 82, gap: 26, opacity: 0.78, blur: 0.7, orientation: "portrait"  as const },
] as const;

// 每行平铺两个周期（20 张为一周期），保证任意滚动位置都铺满右缘
const REPEAT = 2;

export function Gallery({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const lockRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const virtualRef = useRef(0); // 目标滚动量（每切一张 ±1）
  const currentRef = useRef(0); // 缓动后的滚动量
  const photos = photoGallery;
  const N = photos.length;

  // 切换一张照片（滚轮 / 触摸共用）
  const switchPhoto = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setTimeout(() => { lockRef.current = false; }, 400);
      setCurrent((prev) => (prev + dir + N) % N);
      virtualRef.current += dir;
    },
    [N]
  );

  // 滚轮切换照片 + 驱动背景序列滚动
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      switchPhoto(dir);
    },
    [switchPhoto]
  );

  // 触摸滑动（移动端）：向左滑→下一张，向右滑→上一张
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 30) return;
      switchPhoto(dx > 0 ? -1 : 1);
    },
    [switchPhoto]
  );

  // 监听绑定在 window：页面任意位置的滚轮都能捕获；
  // passive: false 允许 preventDefault，阻止页面滚动
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // rAF 缓动：序列滑动带 Things 式的减速节奏；
  // 位移按 20 张周期取模，平铺内容无缝循环，右缘直接切入切出。
  useEffect(() => {
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const target = virtualRef.current;
      let c = currentRef.current;
      c += (target - c) * (reduce ? 1 : 0.13);
      if (Math.abs(target - c) < 0.0005) c = target;
      currentRef.current = c;
      GALLERY_ROWS.forEach((row, i) => {
        const el = rowsRef.current[i];
        if (!el) return;
        const step = row.w + row.gap;
        const f = ((c % 20) + 20) % 20; // 周期 = 每行照片数 20
        el.style.transform = `translateX(${(-f * step).toFixed(2)}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentPhoto: PhotoEntry = photos[current];

  return (
    <div
      className="gallery-root"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 右侧四行照片序列：左缘沿弧形边界柔和隐没，右缘直接切出 */}
      <div className="gallery-curves" aria-hidden>
        {GALLERY_ROWS.map((row, li) => {
          const rowPhotos = photos.filter((p) => p.orientation === row.orientation);
          const strip = Array.from({ length: REPEAT }, () => rowPhotos).flat();
          return (
            <div
              key={li}
              className="gallery-curve-row"
              ref={(el) => {
                rowsRef.current[li] = el;
              }}
              style={{
                top: row.top,
                opacity: row.opacity,
                filter: row.blur ? `blur(${row.blur}px)` : undefined,
              }}
            >
              {strip.map((p, idx) => (
                <span
                  key={`${p.id}-${idx}`}
                  className="gallery-thumb"
                  style={{ width: row.w, height: row.h, marginRight: row.gap }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* 左侧暗区（晕染层）：滚动序列之上、展示照片之下 */}
      <div className="gallery-dark" aria-hidden />

      {/* 前景内容层 */}
      <div className="gallery-foreground">
        {/* 顶栏：返回按钮 */}
        <button type="button" onClick={onBack} className="space-back">
          <span className="space-back__arrow">←</span>
          <span>回到 Things</span>
        </button>

        {/* 主内容区：左侧照片 + 说明 */}
        <div className="gallery-main">
          <div className="gallery-photo-block">
            <div className={`gallery-photo gallery-photo--${currentPhoto.orientation}`} />
            <div className={`gallery-caption gallery-caption--${currentPhoto.orientation}`}>
              <p className="gallery-caption__main">{currentPhoto.caption}</p>
              {currentPhoto.hint && (
                <p className="gallery-caption__hint">{currentPhoto.hint}</p>
              )}
            </div>
          </div>
        </div>

        {/* 底栏：纯色文字条 */}
        <div className="gallery-bottom-bar">
          <span className="gallery-bottom-text">
            Photography · {current + 1} / {N}
          </span>
        </div>

        {/* 滚轮提示 */}
        <span className="gallery-hint">滚轮切换</span>
      </div>
    </div>
  );
}
