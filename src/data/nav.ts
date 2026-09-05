// 信息架构 · 单一来源
// 这里集中管理首页各 section 的 id 与中英文标签。
// 增加 / 调整板块时，Nav 和 Section 都会跟着变化，不用改多处。

export type NavItem = {
  id: string;
  zh: string;
  en: string;
};

export const sections: NavItem[] = [
  { id: "now", zh: "现在", en: "Now" },
  { id: "fragments", zh: "碎片", en: "Fragments" },
  { id: "thoughts", zh: "想法", en: "Thoughts" },
  { id: "past", zh: "从前", en: "Past" },
  { id: "future", zh: "未来", en: "Future" },
  { id: "projects", zh: "项目", en: "Projects" },
];
