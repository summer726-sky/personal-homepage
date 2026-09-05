// 占位内容 · 请替换为你自己的真实内容
// 过去留下来的东西。不是传统简历时间线，更像记忆与节点。
// 同一个条目可以同时是“经历 / 记忆 / 兴趣的起点”，不必只归一类。

export type Memory = {
  id: string;
  year: string;
  title: string;
  note?: string;
};

export const memories: Memory[] = [
  {
    id: "p1",
    year: "2026",
    title: "（一个过去的时间节点，例如：进入大学）",
    note: "（留下一句关于它的记忆）",
  },
  {
    id: "p2",
    year: "2025",
    title: "（另一段经历或记忆）",
    note: "（说明）",
  },
  {
    id: "p3",
    year: "更早",
    title: "（一些更早的、值得留下来的东西）",
    note: "（说明）",
  },
];
