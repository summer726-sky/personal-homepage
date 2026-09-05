"use client";

// 极简阅读状态：安静。用户控制节奏，系统负责动画。
// 进入这里就是进入内容本身，不是进入另一个菜单。

import type { CSSProperties } from "react";
import { reading } from "@/data/content";

export function Reading({ onBack }: { onBack: () => void }) {
  return (
    <article className="mx-auto w-full max-w-xl">
      <button
        type="button"
        onClick={onBack}
        className="reading-back reveal mb-12 cursor-pointer border-0 bg-transparent p-0 text-left"
        style={{ "--i": 0 } as CSSProperties}
      >
        ← 回到 Things
      </button>

      <h1
        className="reveal font-serif text-3xl leading-snug text-ember"
        style={{ "--i": 1 } as CSSProperties}
      >
        {reading.songTitle}
      </h1>
      <p
        className="reveal mt-2 text-sm text-ember-soft"
        style={{ "--i": 2 } as CSSProperties}
      >
        {reading.artist} · {reading.date}
      </p>

      <div
        className="image-slot reveal mt-8 block rounded-[2px]"
        style={{ "--i": 3 } as CSSProperties}
      >
        在这里放入这首歌的封面 / 一张相关的图片
      </div>

      <p
        className="reveal mt-8 font-serif text-base leading-loose text-ember"
        style={{ "--i": 4 } as CSSProperties}
      >
        {reading.body}
      </p>
    </article>
  );
}
