// 占位内容 · 请替换为你自己的真实内容
// 一些个人思考。可以是短文字、一个问题、一段随笔。
// 不需要写成正式文章，留白也行。

export type Thought = {
  id: string;
  text: string;
  date?: string;
};

export const thoughts: Thought[] = [
  {
    id: "t1",
    text: "（一段短的思考、一个问题，或一句随手的记录。不需要写成正式文章。）",
    date: "2026-09",
  },
  {
    id: "t2",
    text: "（另一段想法。）",
    date: "2026-09",
  },
  {
    id: "t3",
    text: "（也许是一个还没有答案的问题？）",
    date: "2026-09",
  },
];
