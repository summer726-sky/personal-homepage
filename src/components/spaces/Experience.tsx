"use client";

// V2 Phase 1 · 空间状态机
// 单一路由 "/"，内部空间状态：entrance → fork → personal → things → reading。
// 转场：当前空间先"收束"（opacity/blur/scale），短暂停顿后，新空间"展开"（逐行 reveal）。
// 原则：让空间回应，不让空间表演。所有动画遵守 prefers-reduced-motion。

import { useCallback, useEffect, useRef, useState } from "react";
import { Entrance } from "./Entrance";
import { Fork } from "./Fork";
import { Personal } from "./Personal";
import { Professional } from "./Professional";
import { Things } from "./Things";
import { Ideas } from "./Ideas";
import { Moments } from "./Moments";
import { ContentReader } from "./ContentReader";
import { Contact } from "./Contact";
import { Gallery } from "./Gallery";

type SpaceId = "entrance" | "fork" | "personal" | "professional" | "things" | "ideas" | "moments" | "reading" | "contact" | "gallery";

const EXIT_MS = 520;

// Things 需要区分：photography → gallery，其他 → reading
const THINGS_OPEN_MAP: Record<string, SpaceId> = {
  photography: "gallery",
  music: "reading",
  travel: "reading",
  reading: "reading",
  film: "reading",
  object: "reading",
  food: "reading",
};

export function Experience() {
  const [space, setSpace] = useState<SpaceId>("entrance");
  const [leaving, setLeaving] = useState(false);
  const [thingsCategory, setThingsCategory] = useState("music");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const go = useCallback(
    (next: SpaceId) => {
      if (leaving || next === space) return;
      const dur = reduceRef.current ? 0 : EXIT_MS;
      setLeaving(true);
      timer.current = setTimeout(() => {
        setSpace(next);
        setLeaving(false);
        if (typeof window !== "undefined")
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, dur);
    },
    [leaving, space]
  );

  const isScrollSpace = space === "ideas" || space === "moments" || space === "reading" || space === "professional";

  return (
    <div
      key={space}
      className={`space-root ${isScrollSpace ? "space-root--scroll" : ""} ${
        leaving ? "is-leaving" : ""
      }`}
    >
      {space === "entrance" && (
        <Entrance
          onContinue={() => go("fork")}
          onContact={() => go("contact")}
        />
      )}
      {space === "fork" && (
        <Fork
          onPersonal={() => go("personal")}
          onProfessional={() => go("professional")}
          onBack={() => go("entrance")}
        />
      )}
      {space === "personal" && (
        <Personal
          onThings={() => go("things")}
          onIdeas={() => go("ideas")}
          onMoments={() => go("moments")}
          onBack={() => go("fork")}
        />
      )}
      {space === "things" && (
        <Things
          onOpen={(cat) => {
            setThingsCategory(cat);
            go(THINGS_OPEN_MAP[cat] || "reading");
          }}
          onBack={() => go("personal")}
        />
      )}
      {space === "ideas" && <Ideas onBack={() => go("personal")} />}
      {space === "moments" && <Moments onBack={() => go("personal")} />}
      {space === "reading" && (
        <ContentReader category={thingsCategory} onBack={() => go("things")} />
      )}
      {space === "contact" && <Contact onBack={() => go("entrance")} />}
      {space === "gallery" && <Gallery onBack={() => go("things")} />}
      {space === "professional" && <Professional onBack={() => go("fork")} />}
    </div>
  );
}
