"use client";

// Entrance：推开一扇门的感觉。
// 文字逐行、分阶段出现：轻微时间差 + blur→clear + 轻微不规则错位。
// 底部一根极细的向下箭头，告诉访客"这里还有下一层空间"。不是 CTA。

import type { CSSProperties } from "react";
import { entrance } from "@/data/content";
import { ArrowDown } from "./primitives";
import { TraceLightDot } from "./traces";

// 每行一个轻微的横向错位，让排版不死板
const offsets = ["0.15rem", "-0.35rem", "0.1rem"];

export function Entrance({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="relative mx-auto flex w-full max-w-2xl flex-col justify-between"
      style={{ minHeight: "64vh" }}
    >
      {/* 很远的一盏灯：入口处唯一的痕迹，安静地在 */}
      <TraceLightDot className="absolute -top-6 right-[8%] h-1.5 w-1.5" />

      <div className="flex flex-col gap-7 pt-4">
        {entrance.lines.map((line, i) => (
          <p
            key={i}
            className="reveal font-serif text-2xl leading-relaxed text-ember sm:text-3xl"
            style={
              {
                "--i": i,
                marginLeft: offsets[i % offsets.length],
              } as CSSProperties
            }
          >
            {line}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="arrow-down mb-1 cursor-pointer self-center border-0 bg-transparent p-0"
        aria-label="向下，进入下一层空间"
      >
        <ArrowDown />
      </button>
    </div>
  );
}
