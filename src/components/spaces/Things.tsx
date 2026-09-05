"use client";

// Things 内容空间：一张真实内容卡（Music / 一首歌）。
// 卡片本身就是内容，同时暗示自己可以进入更深。
// 卡片下方露出一两层纸边 → "这里还有更多内容"，而不是"这是一个按钮"。

import type { CSSProperties } from "react";
import { thingsCard } from "@/data/content";

export function Things({
  onOpen,
  onBack,
}: {
  onOpen: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-14">
      <p
        className="reveal font-serif text-base text-ember-soft"
        style={{ "--i": 0 } as CSSProperties}
      >
        Things
      </p>

      <button
        type="button"
        onClick={onOpen}
        className="reveal paper things-card block cursor-pointer text-left"
        style={{ "--i": 1 } as CSSProperties}
        aria-label="打开这首歌"
      >
        {/* 露出的纸边：暗示还有更多内容 */}
        <span className="things-edge edge-2" style={{ bottom: "-14px" }} />
        <span className="things-edge" style={{ bottom: "-7px" }} />

        <span className="relative block">
          <span className="block font-serif text-xs text-ink-faint">
            {thingsCard.attitude}
          </span>
          <span className="mt-3 block font-serif text-2xl text-ink">
            {thingsCard.songTitle}
          </span>
          <span className="mt-1 block text-sm text-ink-soft">
            {thingsCard.artist} · {thingsCard.date}
          </span>
          <span className="image-slot mt-4 block rounded-[2px]">
            在这里放入这首歌的封面 / 一张相关的图片
          </span>
          <span className="mt-4 block font-serif text-sm leading-relaxed text-ink-soft">
            {thingsCard.line}
          </span>
          <span className="mt-4 block font-serif text-sm text-ink-faint">……</span>
        </span>
      </button>
    </div>
  );
}
