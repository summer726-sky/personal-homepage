"use client";

// Entrance：推开一扇门的感觉。
// 文字逐行、分阶段出现：轻微时间差 + blur→clear + 轻微不规则错位。
// 自我介绍下一行有一个很轻的"联系我"——像落款旁的一行小字，
// hover 时才轻轻亮起。底部一根极细的向下箭头，不是 CTA。
// 房间铺满整个视口：天花板的暗带、低岸的几盏灯、
// 地平线最后一缕暮光——宽屏下两侧是房间的延伸，不是死区。

import type { CSSProperties } from "react";
import { entrance } from "@/data/content";
import { ArrowDown } from "./primitives";
import { TraceLightDot } from "./traces";

// 每行一个轻微的横向错位，让排版不死板
const offsets = ["0.15rem", "-0.35rem"];

export function Entrance({
  onContinue,
  onContact,
}: {
  onContinue: () => void;
  onContact: () => void;
}) {
  return (
    <>
      {/* 房间层：铺满视口的环境证据 */}
      <div className="room-layer" aria-hidden>
        {/* 天花板暗带：墙与顶的交界 */}
        <span className="room-ceiling" />
        {/* 远灯：一盏在高处右，两盏在低处对岸 */}
        <TraceLightDot
          className="h-2 w-2"
          style={
            {
              right: "8vw",
              top: "30vh",
              animationDelay: "3s",
              animationDuration: "22s",
            } as CSSProperties
          }
        />
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              left: "17vw",
              bottom: "15vh",
              animationDelay: "9s",
              animationDuration: "26s",
            } as CSSProperties
          }
        />
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              right: "25vw",
              bottom: "10vh",
              animationDelay: "14s",
              animationDuration: "19s",
            } as CSSProperties
          }
        />
        {/* 地平线：紫反射 + 靠窗一侧的微暖 */}
        <span className="room-horizon" />
      </div>

      <div
        className="room-content shell-text relative mx-auto flex w-full flex-col justify-between"
        style={{ minHeight: "62vh" }}
      >
        {/* 文字整体下移一行、左移约一个字 */}
        <div
          className="intro-block flex flex-col"
          style={{ marginTop: "1.4em", marginLeft: "-1em" }}
        >
          {entrance.lines.map((line, i) => (
            <p
              key={i}
              className="intro-line reveal font-serif leading-relaxed text-ember"
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

          {/* 联系我：落款旁的一行小字，靠左、不超过上一行 */}
          <button
            type="button"
            onClick={onContact}
            className="contact-link reveal"
            style={{ "--i": entrance.lines.length, marginLeft: "0.15rem" } as CSSProperties}
            aria-label="联系我"
          >
            <span>联系我</span>
            <span className="contact-link__arrow" aria-hidden>→</span>
          </button>
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
    </>
  );
}
