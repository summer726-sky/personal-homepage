"use client";

// Entrance → Personal / Professional
// 两扇尚未完全打开的门：门缝透光、隐约的内部内容碎片、靠近时浮现的内心独白。
// Personal 可进入；Professional 只被看见，本阶段不实现内部。

import type { CSSProperties } from "react";
import { fork } from "@/data/content";
import { Door } from "./primitives";
import { TraceLightDot } from "./traces";

// 呼吸光点：围绕 "meet me at the" 文案的上方与左右聚集，向外渐疏（非均匀）。
// 坐标单位为 %，文案中心约在 (50, 50)；第三个元素标记远处的一点暖光。
// 位置手工排布，其余参数在模块初始化时一次性算出——避免重渲染导致光点跳变。
const SPARK_POINTS: Array<[number, number, boolean?]> = [
  // 内层：贴着文案上缘与两肩，最密
  [44, 44], [48, 40], [52, 39], [56, 43], [50, 46],
  [40, 49], [59, 48], [46, 52], [54, 51],
  [50, 35], [42, 38], [58, 37],
  // 中层：向头顶与两肩散开
  [34, 40], [65, 39], [30, 50], [70, 49],
  [38, 30], [62, 29], [50, 28], [44, 23], [57, 22],
  [26, 43], [74, 44],
  // 外层：稀疏的远光
  [20, 35], [81, 34], [30, 15, true], [71, 14, true],
  [50, 10], [14, 51, true], [87, 50],
];

const FORK_SPARKS = SPARK_POINTS.map(([x, y, warm], i) => ({
  x,
  y,
  warm: warm ?? false,
  size: 1.5 + ((i * 7) % 11) * 0.12 + (i % 4 === 0 ? 0.5 : 0),
  dur: 3.8 + ((i * 13) % 17) * 0.18,
  delay: -((i * 1.73) % 6).toFixed(2),
  o: 0.55 + ((i * 29) % 38) * 0.01,
  dx: (((i * 37) % 7) - 3) * 0.55,
  dy: -(0.8 + ((i * 23) % 5) * 0.45),
}));

// 模糊的大光点（散景）：全部聚集在 "meet me at the" 文字的字背后，
// 沿字行轻微高低错落，像每个字后面洇开的一小团光；不外扩到字行之外。
const GLOW_POINTS: Array<[number, number, boolean?]> = [
  [40, 50], [43, 46], [47, 52], [50, 47],
  [53, 53], [56, 46], [60, 50], [63, 48, true],
];

const FORK_GLOWS = GLOW_POINTS.map(([x, y, warm], i) => ({
  x,
  y,
  warm: warm ?? false,
  size: 26 + ((i * 13) % 5) * 5,
  dur: 6.5 + ((i * 11) % 6) * 0.55,
  delay: -((i * 2.31) % 8).toFixed(2),
  o: 0.16 + ((i * 17) % 4) * 0.035,
  dx: (((i * 29) % 5) - 2) * 1.2,
  dy: -(1.2 + ((i * 19) % 4) * 0.7),
}));

export function Fork({
  onPersonal,
  onProfessional,
  onBack,
}: {
  onPersonal: () => void;
  onProfessional: () => void;
  onBack: () => void;
}) {
  return (
    <>
      {/* 房间层：门之外的夜色铺满视口 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        {/* 两侧低处各有一盏很远的灯 */}
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              left: "11vw",
              bottom: "20vh",
              animationDelay: "6s",
              animationDuration: "24s",
            } as CSSProperties
          }
        />
        <TraceLightDot
          className="h-1.5 w-1.5"
          style={
            {
              right: "9vw",
              bottom: "16vh",
              animationDelay: "12s",
              animationDuration: "20s",
            } as CSSProperties
          }
        />
        <span className="room-horizon" />
      </div>

      <div className="room-content shell-fork relative mx-auto flex w-full flex-col items-center gap-12">
        {/* 返回上一级：左上角一抹细线箭头，最后才浮现，安静得像墙面的一部分 */}
        <button
          type="button"
          onClick={onBack}
          className="space-back reveal absolute left-0 top-0"
          style={{ "--i": 3 } as CSSProperties}
          aria-label="返回上一级"
        >
          <span className="space-back__arrow" aria-hidden>←</span>
          <span>返回</span>
        </button>

        {/* 两扇门之上：一盏灯，像街对面 */}
        <TraceLightDot
          className="-top-10 right-[24%] h-1.5 w-1.5"
          style={{ animationDelay: "5s", animationDuration: "21s" } as CSSProperties}
        />

        <div className="fork-prompt-field">
          {/* 呼吸光点：聚集在文案上方与左右，向外渐疏 */}
          <span className="fork-sparks" aria-hidden>
            {/* 底层：模糊的大光点（散景），先渲染、落在小光点之下 */}
            {FORK_GLOWS.map((g, i) => (
              <span
                key={`g-${i}`}
                className={`fork-glow${g.warm ? " fork-glow--warm" : ""}`}
                style={
                  {
                    left: `${g.x}%`,
                    top: `${g.y}%`,
                    width: `${g.size}px`,
                    height: `${g.size}px`,
                    "--d": `${g.dur}s`,
                    "--del": `${g.delay}s`,
                    "--o": g.o,
                    "--dx": `${g.dx}px`,
                    "--dy": `${g.dy}px`,
                  } as CSSProperties
                }
              />
            ))}
            {/* 上层：锐利的小光点 */}
            {FORK_SPARKS.map((s, i) => (
              <span
                key={`s-${i}`}
                className={`fork-spark${s.warm ? " fork-spark--warm" : ""}`}
                style={
                  {
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    "--d": `${s.dur}s`,
                    "--del": `${s.delay}s`,
                    "--o": s.o,
                    "--dx": `${s.dx}px`,
                    "--dy": `${s.dy}px`,
                  } as CSSProperties
                }
              />
            ))}
          </span>

          <p
            className="fork-prompt reveal font-serif text-ember-soft"
            style={{ "--i": 0 } as CSSProperties}
          >
            {fork.prompt}
          </p>
        </div>

        <div
          className="reveal flex flex-col items-stretch gap-6 sm:flex-row sm:gap-10"
          style={{ "--i": 1 } as CSSProperties}
        >
          <Door side="left" {...fork.personal} onEnter={onPersonal} />
          <Door side="right" {...fork.professional} onEnter={onProfessional} />
        </div>
      </div>
    </>
  );
}
