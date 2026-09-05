// 占位内容 · 请替换为你自己的真实内容
// 生活中的小片段。可以是照片、音乐、小物件、某个瞬间。
// 这里只决定“结构”，具体放什么是你的事。

export type Fragment = {
  id: string;
  kind: "photo" | "music" | "object" | "moment";
  title: string;
  note?: string;
};

export const fragments: Fragment[] = [
  {
    id: "f1",
    kind: "photo",
    title: "一张照片",
    note: "（在这里放入一张你想留下的照片，并写一句说明）",
  },
  {
    id: "f2",
    kind: "music",
    title: "最近常听的一首歌",
    note: "（歌名 · 为什么留下它）",
  },
  {
    id: "f3",
    kind: "object",
    title: "一个小物件",
    note: "（一件对你有意义的小东西）",
  },
  {
    id: "f4",
    kind: "moment",
    title: "某个瞬间",
    note: "（一个值得记下来的瞬间）",
  },
  {
    id: "f5",
    kind: "photo",
    title: "另一张照片",
    note: "（说明）",
  },
  {
    id: "f6",
    kind: "moment",
    title: "又一个瞬间",
    note: "（说明）",
  },
];
