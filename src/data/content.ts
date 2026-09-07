// V2 Phase 1 · 内容与 UI 解耦
//
// 重要原则：
//   - "真实个人内容"只来自用户。用户尚未提供真实歌曲，因此 Things 的歌曲样本
//     使用【明确占位】，不自行编造歌名 / 艺人 / 记忆。
//   - 门与纸上的 whisper（内心独白）使用用户在 brief 中明确给出的示例短句，
//     属于情绪碎片而非个人事实，可保留也可替换。
//
// 体验路径（本阶段唯一）：
//   Entrance → Personal/Professional → Personal → Things/Ideas/Moments
//   → Things → 一个真实内容卡 → 进入内容 → 极简阅读状态

import { profile } from "./profile";

export const entrance = {
  // 逐行、分阶段出现。轻微时间差、blur→clear、轻微错位（在组件里用 --i 控制）。
  lines: ["你来了。", `很高兴见到你，我是 ${profile.name}。`],
};

export const fork = {
  prompt: "或许，我是这样的我",
  personal: {
    label: "Personal",
    zh: "私人",
    // 门缝里隐约透露的内部内容
    sliver: "Things · Ideas · Moments",
    // 鼠标靠近时浮现的内心独白（用户 brief 给出的示例短句）
    whisper: "那段时间，它总是在傍晚出现。",
  },
  professional: {
    label: "Professional",
    zh: "事务",
    sliver: "Projects · Experience",
    whisper: "这里以后会有一些工作。",
  },
};

export const personal = {
  // 一句极轻的环境语，让空间有"人住过"的感觉
  ambient: "在这里，东西还没有完全整理好。",
  things: {
    label: "Things",
    meaning: "被什么吸引",
    whisper: "又翻到了。",
  },
  ideas: {
    label: "Ideas",
    meaning: "在想什么",
    whisper: "这个我一直没想清楚。",
  },
  moments: {
    label: "Moments",
    meaning: "留下什么",
    whisper: "那天晚上。",
  },
  // 环境碎片：暗示空间里已经存在很多真实内容，但它们不是 UI。
  fragments: [
    "2026 · 秋",
    "一些还没整理的东西",
    "……",
  ],
};

// Things 的内容空间 V2：分类以「该分类下的一张具体卡片」出现。
// 卡片本身是载体（无图案图样），真实内容随后由用户填入。
// 本阶段提供分类骨架与占位标题，不编造个人事实。
export type ThingsCard = {
  category: string; // 分类 key（music / photography / travel …）
  categoryLabel: string; // 分类显示名
  title: string; // 这张卡的具体标题（占位）
  subtitle: string; // 副标题 / 来源 / 时间（占位）
  whisper: string; // 一句氛围碎片（情绪，非事实）
};

export const thingsCards: ThingsCard[] = [
  {
    category: "music",
    categoryLabel: "Music",
    title: "（一首歌）",
    subtitle: "（艺人 · 年份）",
    whisper: "那段时间，它总是在傍晚出现。",
  },
  {
    category: "photography",
    categoryLabel: "Photography",
    title: "（一张照片）",
    subtitle: "（地点 · 季节）",
    whisper: "按下快门的时候，光正好落在那。",
  },
  {
    category: "travel",
    categoryLabel: "Travel",
    title: "（一段路程）",
    subtitle: "（起点 → 终点）",
    whisper: "那天的风是冷的。",
  },
  {
    category: "reading",
    categoryLabel: "Reading",
    title: "（一本书）",
    subtitle: "（作者）",
    whisper: "读到那一页停住了。",
  },
  {
    category: "film",
    categoryLabel: "Film",
    title: "（一部电影）",
    subtitle: "（导演 · 年份）",
    whisper: "结尾那个长镜头。",
  },
  {
    category: "object",
    categoryLabel: "Object",
    title: "（一件物件）",
    subtitle: "（来源）",
    whisper: "一直没舍得扔。",
  },
  {
    category: "food",
    categoryLabel: "Food",
    title: "（一种味道）",
    subtitle: "（厨房 · 季节）",
    whisper: "那碗汤端上来，热气把脸糊住了。",
  },
];

// 兼容：旧的单一歌曲样本（保留导入，reading 状态仍用）
export const thingsCard = {
  attitude: "我的音乐态度",
  songTitle: "（在这里填入一首真实的歌）",
  artist: "（艺人）",
  date: "2026",
  line: "（在这里写一句当时与这首歌有关的生活）",
};

// 极简阅读状态。安静，用户控制节奏。
export const reading = {
  songTitle: "（歌名）",
  artist: "（艺人）",
  date: "2026",
  // ↓ 占位：请替换为一段真实的个人记忆。这段文字本身就是内容。
  body:
    "（在这里写一段你和这首歌有关的真实记忆。不需要写成正式文章，几句就够。）",
};
