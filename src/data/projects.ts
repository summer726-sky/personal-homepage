// 占位内容 · 请替换为你自己的真实内容
// 真实项目。V1 只用简单卡片，项目不是网站的主角，保持安静。

export type Project = {
  id: string;
  name: string;
  description: string;
  link?: string;
  status?: string;
};

export const projects: Project[] = [
  {
    id: "pr1",
    name: "（项目名）",
    description: "（一句话说明它是什么，以及你为什么做它）",
    link: "#",
    status: "进行中",
  },
  {
    id: "pr2",
    name: "（另一个项目）",
    description: "（说明）",
    link: "#",
    status: "已暂停",
  },
  {
    id: "pr3",
    name: "（过去的项目）",
    description: "（说明）",
    status: "已完成",
  },
];
