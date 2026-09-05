// 占位内容 · 请替换为你自己的真实内容
// 对未来的想象。可以模糊，可以不确定，也可以只是一个问题。
// 不要写成传统职业规划。

export type FutureItem = {
  id: string;
  kind: "direction" | "question" | "imagining";
  text: string;
};

export const futureItems: FutureItem[] = [
  {
    id: "fu1",
    kind: "direction",
    text: "（一个正在尝试的方向，不必确定）",
  },
  {
    id: "fu2",
    kind: "question",
    text: "（一个你还没想清楚的问题？）",
  },
  {
    id: "fu3",
    kind: "imagining",
    text: "（对未来的某种想象，可以很模糊）",
  },
];
