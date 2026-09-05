// 占位内容 · 请替换为你自己的真实内容
// “现在的我”：随时可以更新，过期了就改，不必永久准确。
// 这里的内容可以同时具有“时间 / 兴趣 / 思考”属性，不必强行分类。

export type NowBlock = {
  label: string;
  items: string[];
};

export const nowBlocks: NowBlock[] = [
  {
    label: "正在学习",
    items: [
      "（替换为你正在学的内容，例如：线性代数、某门网课、某种乐器）",
    ],
  },
  {
    label: "正在做",
    items: [
      "（替换为你最近在做的事，例如：搭这个网站、读某本书）",
    ],
  },
  {
    label: "最近关注",
    items: [
      "（替换为你最近关注的话题、领域或人）",
    ],
  },
  {
    label: "最近在想",
    items: [
      "（替换成一个最近萦绕在你脑海的问题或念头）",
    ],
  },
];

// 让访客知道“现在”是哪个时间点的你
export const nowUpdated = "2026-09";
