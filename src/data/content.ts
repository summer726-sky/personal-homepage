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

// Ideas 内容空间：一段一段正在想、还没想清楚的话。
// 进入 Ideas 就是进入阅读本身——这里没有下一级。
// 真实内容只来自用户，以下全部为【明确占位】；
// 占位文字刻意长短不等，用于呈现"错落有致"的排版规格：
// 真实内容填入时约 150–200 字/段，长短不一即可。
export type IdeaEntry = {
  date: string; // 模糊的时间感（真实内容填入时写成真实的时间）
  title?: string; // 有的想法有名字，大多数没有
  body: string; // 一段话：真实内容约 150–200 字，长短不一
};

export const ideasSpace = {
  // 空间开场的一句氛围语（非个人事实）
  ambient: "有些想法还没想清楚，先写在这里。",
  entries: [
    // 时间线最新在上（十月初），最旧在下（八月末）。Ideas.tsx 会再反转一次确认顺序。
    {
      date: "十月初",
      body: "（这一段打算留到最晚写。前面几段慢慢想清楚的时候，这一段大概也就自然知道了——有些话要放在最后说。不过这几天它好像自己开始长了，早上刷牙的时候、地铁上看窗外的时候，会突然冒出一两句不成形的话。我先不急着把它们整理成完整的段落，就原样放着，像在纸上先写下几个词，等着它们自己长出句子来。）",
    },
    {
      date: "九月末",
      body: "（这一段留着。打算写的那个东西，开头早就有了，中间也零碎记了几行，只是结尾一直没想好——大概是因为事情本身还没有结束。写在纸上的好处是：写不下去的时候可以把纸推远一点，明天再拉回来，字还在原来的地方等着。这个页面也一样：它不催你，只是把位置留出来，等你哪天想清楚了，再回来把话说完。）",
    },
    {
      date: "九月中",
      body: "（这一段同样空着。有时候一个念头会停留很久，久到以为已经忘了它，然后又在某个完全无关的下午突然回来。它回来的时候往往不讲道理，也不挑时间——洗澡水放太烫的时候、在超市挑苹果的时候、等红绿灯的时候——就那样站在你面前，带着第一次见到它时的那种重量。那就先记下第一句，剩下的慢慢补。它不急。）",
    },
    {
      date: "九月初",
      body: "（这一段还没有写。写下它的时候，大概会是一个傍晚：窗外天刚刚暗下去，房间里的灯还没有开，屏幕的光是唯一的光。想说的那件事其实很小，小到不太值得讲给别人听，却又一直搁在心里，隔几天就浮上来一次。真要把它写下来，大概一百多字就够了——不必是文章，也不必想清楚，写到哪算哪。等哪天写完了，就把这几行括号替换掉。）",
    },
    {
      date: "八月末",
      body: "（这一段还没有写。它也许只有一句话，也许写了一半就停住——有些想法就是这样，还没有长成完整的样子，只是一个轮廓，甚至连轮廓都没有，只有一种隐约的感觉，像在暗里摸到一个东西的边角。等它自己落下来，再把它放回这张桌上。不过最近有点怕它落下来——怕落下来的时候，发现它跟记忆里不一样。）",
    },
  ] as IdeaEntry[],
  // 纸流尽头的一小句收尾
  endNote: "（还有一些，等想清楚了再写。）",
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
