"use client";

// Entrance → Personal / Professional
// 两扇尚未完全打开的门：门缝透光、隐约的内部内容碎片、靠近时浮现的内心独白。
// Personal 可进入；Professional 只被看见，本阶段不实现内部。

import type { CSSProperties } from "react";
import { fork } from "@/data/content";
import { Door } from "./primitives";

export function Fork({ onPersonal }: { onPersonal: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
      <p
        className="reveal font-serif text-xl text-ember-soft sm:text-2xl"
        style={{ "--i": 0 } as CSSProperties}
      >
        {fork.prompt}
      </p>

      <div
        className="reveal flex flex-col items-stretch gap-6 sm:flex-row sm:gap-10"
        style={{ "--i": 1 } as CSSProperties}
      >
        <Door side="left" {...fork.personal} onEnter={onPersonal} />
        <Door side="right" {...fork.professional} />
      </div>
    </div>
  );
}
