"use client";

// Photography Gallery · 左侧展示照片 + 右侧四行照片序列（手绘构图）
//
// 桌面端：横向布局（照片在左，序列横向滚动，底栏在底部）
// 手机端：纵向布局（照片偏下中部，序列纵向滚动，提示栏在右侧）
// 交互：滚轮 / 触摸切换照片（前景直接替换，无渐显）；
//   背景序列随滚动滑动（rAF 缓动，参考 Things 的过渡节奏），
//   序列以 20 张为周期平铺循环。
// 入场：进入 gallery 时播放一次 bloom 显现；切换照片不触发。

import { useCallback, useEffect, useRef, useState } from "react";
import { photoGallery, type PhotoEntry } from "@/data/content";

// 四行/列序列（桌面横向用 top，手机纵向用 left）
// w/h: 缩略图尺寸；gap: 间距；opacity/blur: 极轻的层次差异
const GALLERY_ROWS = [
  { top: "15%", left: "15%", w: 92, h: 61, gap: 28, opacity: 0.92, blur: 0,   orientation: "landscape" as const },
  { top: "37%", left: "37%", w: 54, h: 76, gap: 24, opacity: 0.8,  blur: 0.5, orientation: "portrait"  as const },
  { top: "56%", left: "56%", w: 84, h: 56, gap: 34, opacity: 0.85, blur: 0.4, orientation: "landscape" as const },
  { top: "72%", left: "72%", w: 58, h: 82, gap: 26, opacity: 0.78, blur: 0.7, orientation: "portrait"  as const },
] as const;

// 每行平铺两个周期（20 张为一周期），保证任意滚动位置都铺满
const REPEAT = 2;

// 手机端断点（与 CSS 一致）
const MOBILE_MQ = "(max-width: 720px)";

export function Gallery({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const lockRef = useRef(false);
  const touchStart = useRef<number | null>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const virtualRef = useRef(0); // 目标滚动量（每切一张 ±1）
  const currentRef = useRef(0); // 缓动后的滚动量
  const isMobileRef = useRef(false);
  const photos = photoGallery;
  const N = photos.length;

  // 监听视口宽度，切换桌面/手机布局
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => {
      setIsMobile(mq.matches);
      isMobileRef.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  // 滚轮切换照片 + 驱动背景序列滚动（桌面端）
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      switchPhoto(dir);
    },
    [switchPhoto]
  );

  // 触摸滑动：桌面横向，手机纵向
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = isMobileRef.current
      ? e.touches[0].clientY
      : e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const mobile = isMobileRef.current;
      const delta = mobile
        ? e.changedTouches[0].clientY - touchStart.current
        : e.changedTouches[0].clientX - touchStart.current;
      touchStart.current = null;
      if (Math.abs(delta) < 30) return;
      // 向上/向左滑 → 下一张
      switchPhoto(delta > 0 ? -1 : 1);
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
  // 位移按 20 张周期取模，平铺内容无缝循环。
  // 桌面端 translateX（横向），手机端 translateY（纵向）。
  useEffect(() => {
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const target = virtualRef.current;
      let c = currentRef.current;
      c += (target - c) * (reduce ? 1 : 0.13);
      if (Math.abs(target - c) < 0.0005) c = target;
      currentRef.current = c;
      const mobile = isMobileRef.current;
      GALLERY_ROWS.forEach((row, i) => {
        const el = rowsRef.current[i];
        if (!el) return;
        const step = mobile ? row.h + row.gap : row.w + row.gap;
        const f = ((c % 20) + 20) % 20;
        const px = (-f * step).toFixed(2);
        el.style.transform = mobile ? `translateY(${px}px)` : `translateX(${px}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentPhoto: PhotoEntry = photos[current];

  return (
    <div
      className={`gallery-root${isMobile ? " is-mobile" : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 背景序列：桌面横向四行 / 手机纵向四列 */}
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
                top: isMobile ? undefined : row.top,
                left: isMobile ? row.left : undefined,
                opacity: row.opacity,
                filter: row.blur ? `blur(${row.blur}px)` : undefined,
              }}
            >
              {strip.map((p, idx) => (
                <span
                  key={`${p.id}-${idx}`}
                  className="gallery-thumb"
                  style={{
                    width: row.w,
                    height: row.h,
                    marginRight: isMobile ? 0 : row.gap,
                    marginBottom: isMobile ? row.gap : 0,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* 暗区（晕染层）：序列之上、展示照片之下 */}
      <div className="gallery-dark" aria-hidden />

      {/* 前景内容层 */}
      <div className="gallery-foreground">
        {/* 顶栏：返回按钮 */}
        <button type="button" onClick={onBack} className="space-back">
          <span className="space-back__arrow">←</span>
          <span>回到 Things</span>
        </button>

        {/* 主内容区：照片 + 说明 */}
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

        {/* 文字栏：桌面底部 / 手机右侧 */}
        <div className="gallery-bottom-bar">
          <span className="gallery-bottom-text">
            Photography · {current + 1} / {N}
          </span>
        </div>

        {/* 切换提示：桌面滚轮 / 手机纵向滑动 */}
        <span className="gallery-hint">
          {isMobile ? "纵向滑动切换" : "滚轮切换"}
        </span>
      </div>
    </div>
  );
}
