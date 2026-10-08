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

// 联系方式：信息直接陈列，不藏在卡片里。
// 真实内容待用户填入；href 留空的行只作展示（不可点）。
export const contact = {
  ambient: "如果有什么想说的，信能寄到这里。",
  entries: [
    { label: "邮箱", value: profile.email, href: `mailto:${profile.email}` },
    { label: "微信", value: "（你的微信号）", href: null as string | null },
    { label: "GitHub", value: "github.com/your-name", href: profile.github },
  ],
  // 留言反馈：提交后存入 Supabase feedback 表，可在 Supabase 后台查看
  feedback: {
    title: "留言",
    note: "想说的话可以留在这里。",
    contactLabel: "称呼 / 联系方式（选填）",
    contactPlaceholder: "怎么称呼你",
    messagePlaceholder: "写点什么…",
    sendLabel: "寄出",
    sendingLabel: "正在寄出…",
    success: "收到了，谢谢你的留言。",
    error: "没有寄出去，稍后再试一次吧。",
    notConfigured: "（留言通道还没接上，稍后再来看看。）",
    againLabel: "再写一条",
  },
};

export const fork = {
  prompt: "meet me at the",
  personal: {
    label: "Personal",
    zh: "私人",
    sliver: "Things · Ideas · Moments",
    whisper: "生活里留下来的东西。",
  },
  professional: {
    label: "Professional",
    zh: "事务",
    sliver: "Projects · Experience · Timeline",
    whisper: "做过的事和正在做的事。",
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
    category: "photography",
    categoryLabel: "Photography",
    title: "（一张照片）",
    subtitle: "（地点 · 季节）",
    whisper: "按下快门的时候，光正好落在那。",
  },
  {
    category: "music",
    categoryLabel: "Music",
    title: "（一首歌）",
    subtitle: "（艺人 · 年份）",
    whisper: "那段时间，它总是在傍晚出现。",
  },
  {
    category: "hobby",
    categoryLabel: "Hobby",
    title: "（一些爱好）",
    subtitle: "（喜欢做的事）",
    whisper: "闲下来的时候，就去做这些。",
  },
  {
    category: "reading",
    categoryLabel: "Reading",
    title: "（一本书）",
    subtitle: "（作者）",
    whisper: "读到那一页停住了。",
  },
  {
    category: "travel",
    categoryLabel: "Travel",
    title: "（一段路程）",
    subtitle: "（起点 → 终点）",
    whisper: "那天的风是冷的。",
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

// Photography Gallery：曲线背景陈列 + 前景单张大图的照片墙。
// 每一项是一张照片：白底占位（用户后续替换为真实图片）+ 1-2 行小字说明。
// orientation: 横屏 / 竖屏，决定背景陈列行和前景照片的宽高比。
export type PhotoEntry = {
  id: string;
  caption: string; // 1-2 行，不超过照片宽度
  hint?: string; // 可选的更短的辅助说明
  orientation: "landscape" | "portrait";
};

export const photoGallery: PhotoEntry[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `p${i + 1}`,
    caption: "（这里放一张照片）",
    hint: "（地点 · 季节）",
    orientation: "landscape" as const,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `p${i + 11}`,
    caption: "（这里放一张照片）",
    hint: "（地点 · 季节）",
    orientation: "portrait" as const,
  })),
];

// Moments 内容空间：蜿蜒暖光路径上散落的记忆痕迹。
// 进入即阅读——不做下一级展开，文字内嵌在痕迹里。
// 每个 Moment 是一段 100-150 字的碎片，纯文字或影像+文字。
// hasImage: true 时 image 字段为占位描述（真实内容由用户后续填入）。
export type MomentEntry = {
  id: string;
  time: string; // 模糊时间："十点半"、"凌晨"、"雨停后"
  body: string; // 100-150 字
  hasImage?: boolean;
  imageDesc?: string; // 影像占位描述
};

export const momentsSpace = {
  ambient: "有些事记得不太清楚了，只留下碎片。",
  entries: [
    {
      id: "m1",
      time: "四月初 · 下午",
      hasImage: true,
      imageDesc: "（一张旧照片）",
      body: "（那天的光特别软，从西边斜过来，把走廊上的灰都照亮了。我走过去拍了一张，拍完才想起来手机快没电了。照片后来好像丢了，但那个光影还留着——像有什么东西在那天下午被轻轻地摆了一下，然后就没动过。）",
    },
    {
      id: "m2",
      time: "五月 · 凌晨",
      body: "（那天下了一整夜的雨。我三点多醒过来，听见雨打在空调外机上的声音，很密，很均匀，像有人在很远的地方一直敲着一扇门。我躺在床上听了很久，直到天开始灰。那扇门一直没有被打开。）",
    },
    {
      id: "m3",
      time: "六月中 · 傍晚",
      hasImage: true,
      imageDesc: "（一段短影像：窗外的街灯亮起来）",
      body: "（下班路上经过那条街，灯一盏一盏亮起来。不是同时亮的，是每隔几秒亮一盏，像有人在里面一盏一盏地按开关。我数了一下，一共七盏，亮到第五盏的时候我走过去了。后面两盏什么时候亮的，不知道。）",
    },
    {
      id: "m4",
      time: "七月 · 夜里",
      body: "（那天晚上翻到一张很老的纸条，上面写的字已经有点洇了。我不记得写过它，但看字迹应该是我自己。写的什么不重要——重要的是我看着它，想了很久也没想起来是什么时候、在什么情况下写的。）",
    },
    {
      id: "m5",
      time: "八月末 · 清晨",
      body: "（清早出门的时候，空气特别凉。抬头看了一眼，月亮还在天上，很淡，像一张被擦了很多遍的白纸。我站在街上看了几秒，然后继续走了。月亮没有再看我。）",
    },
    {
      id: "m6",
      time: "九月 · 还没写",
      body: "（这一天还没有来。它会有什么样的光，会留下什么，现在都不知道。先把位置留着，等它自己走过来。）",
    },
  ] as MomentEntry[],
};

// Professional 空间：项目与经历。
// 清晰、直接、有结构——像一份放在桌面上的索引，
// 而非传统简历。内容随用户填入，以下为占位骨架。
export type ExperienceEntry = {
  role: string;      // 职位
  org: string;       // 组织 / 公司
  period: string;    // 时间段
  summary: string;   // 1-2 句概述
};

export type ProjectEntry = {
  name: string;      // 项目名
  role: string;      // 担任角色
  period: string;    // 时间段
  summary: string;   // 1-2 句描述
  stack: string[];   // 技术栈
  link?: string;     // 链接（可选）
};

// 职业想法时间线：从小到大依次对什么领域感兴趣、
// 什么时候有了什么想法、完成了什么学习或正在学什么。
export type TimelineEntry = {
  year: string;       // 年份或年龄段
  title: string;      // 这个阶段的标题（领域 / 想法 / 事件）
  detail: string;     // 1-2 句描述
  kind: "interest" | "idea" | "learning" | "milestone";
  // interest: 对某领域产生兴趣
  // idea: 有了产品或职业规划的想法
  // learning: 完成了某段学习或正在学
  // milestone: 某个阶段性节点
};

export const professionalSpace = {
  ambient: "这里有一些做过的事。",
  experiences: [
    {
      role: "（职位）",
      org: "（公司 / 组织）",
      period: "2025 — 至今",
      summary: "（一两句话描述这段经历中做的事。）",
    },
    {
      role: "（职位）",
      org: "（公司 / 组织）",
      period: "2023 — 2025",
      summary: "（一两句话描述这段经历中做的事。）",
    },
    {
      role: "（职位）",
      org: "（公司 / 组织）",
      period: "2021 — 2023",
      summary: "（一两句话描述这段经历中做的事。）",
    },
  ] as ExperienceEntry[],
  projects: [
    {
      name: "（项目名）",
      role: "（角色）",
      period: "2025",
      summary: "（一两句话描述这个项目。）",
      stack: ["React", "Next.js", "TypeScript"],
      link: undefined as string | undefined,
    },
    {
      name: "（项目名）",
      role: "（角色）",
      period: "2024",
      summary: "（一两句话描述这个项目。）",
      stack: ["Node.js", "PostgreSQL"],
      link: undefined as string | undefined,
    },
    {
      name: "（项目名）",
      role: "（角色）",
      period: "2023",
      summary: "（一两句话描述这个项目。）",
      stack: ["React", "Tailwind CSS"],
      link: undefined as string | undefined,
    },
  ] as ProjectEntry[],
  skills: [
    "React", "Next.js", "TypeScript", "JavaScript",
    "HTML", "CSS", "Tailwind", "Node.js",
    "PostgreSQL", "Git",
  ],
  timeline: [
    {
      year: "小时候",
      title: "（对什么领域产生了兴趣）",
      detail: "（一两句话描述当时的兴趣和契机。）",
      kind: "interest" as const,
    },
    {
      year: "2015",
      title: "（一个想法的萌芽）",
      detail: "（什么时候有了一个产品或职业规划的想法。）",
      kind: "idea" as const,
    },
    {
      year: "2018",
      title: "（完成了一段学习）",
      detail: "（学完了什么、达到了什么程度。）",
      kind: "learning" as const,
    },
    {
      year: "2020",
      title: "（一个阶段性节点）",
      detail: "（做成了什么、转折点是什么。）",
      kind: "milestone" as const,
    },
    {
      year: "2023",
      title: "（正在学习的东西）",
      detail: "（现在在学什么、目标是什么。）",
      kind: "learning" as const,
    },
  ] as TimelineEntry[],
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

// —— Things 各类别的内容空间 ——
// 每个类别有独立的数据结构与布局，共享阅读壳（返回、reveal、serif）。
// 以下全部为占位骨架，真实内容随用户填入。

// Music：三首歌的记忆，左右交错排列。
export const musicContent = [
  {
    title: "（歌名一）",
    artist: "（艺人）",
    date: "2026",
    body:
      "（在这里写一段你和这首歌有关的真实记忆。几句就够。）",
  },
  {
    title: "（歌名二）",
    artist: "（艺人）",
    date: "2025",
    body:
      "（在这里写一段你和这首歌有关的真实记忆。几句就够。）",
  },
  {
    title: "（歌名三）",
    artist: "（艺人）",
    date: "2024",
    body:
      "（在这里写一段你和这首歌有关的真实记忆。几句就够。）",
  },
];

// Travel：对各个地方的印象手记（卡片式）。
export const travelContent = [
  { place: "（地名一）", impression: "（在这里写对这个地方的印象手记。几句就够。）" },
  { place: "（地名二）", impression: "（在这里写对这个地方的印象手记。几句就够。）" },
  { place: "（地名三）", impression: "（在这里写对这个地方的印象手记。几句就够。）" },
  { place: "（地名四）", impression: "（在这里写对这个地方的印象手记。几句就够。）" },
];

// Reading：阅读笔记，多篇。
export const readingContent = [
  {
    title: "（书名一）",
    author: "（作者）",
    date: "2026",
    excerpt: "（在这里放一句书中的摘抄。让你停下来想了想的那一句。）",
    notes:
      "（在这里写你的阅读笔记。可以是对摘抄的回应，也可以是整本书留下的感觉。）",
  },
  {
    title: "（书名二）",
    author: "（作者）",
    date: "2025",
    excerpt: "（在这里放一句书中的摘抄。让你停下来想了想的那一句。）",
    notes:
      "（在这里写你的阅读笔记。可以是对摘抄的回应，也可以是整本书留下的感觉。）",
  },
  {
    title: "（书名三）",
    author: "（作者）",
    date: "2024",
    excerpt: "（在这里放一句书中的摘抄。让你停下来想了想的那一句。）",
    notes:
      "（在这里写你的阅读笔记。可以是对摘抄的回应，也可以是整本书留下的感觉。）",
  },
];

// —— 数字分身 · 对话窗口原型 ————————————————————————————————————
// 本阶段：纯前端占位——不接 AI API、不做后端、不做存储。
// 消息只存在于组件状态里；访客发送后，分身以轮换占位语回应，
// 示意「真正的对话尚未接入」。后续接入数字分身数据后，
// 只需替换 pendingReplies 为真实对话逻辑，UI 不动。
export const avatarChat = {
  // ① 介绍框里的问候
  intro: "hi，我是summer的数字分身",
  // ② 聊天框里的第一条消息
  greeting: "随便说说或者问点啥~",
  // 输入框占位
  inputPlaceholder: "说点什么…",
  sendLabel: "发送",
  // 建议泡泡
  suggestions: [
    "平时喜欢干什么",
    "喜欢听什么歌",
    "有什么兴趣爱好",
    "最近在忙什么",
  ],
  // 占位回复：访客每发一句，按顺序轮换其中一条
  pendingReplies: [
    "（这句话我先记在纸上了。等我学会说话，第一个回答你。）",
    "（现在还答不上来——不过我已经听到了。）",
    "（嗯。这张纸上的字，又多了一行。）",
  ],
};

// Hobby：爱好，内部样式参考 Professional（索引 + 分区）。
// 四项：美术、摄影、运动、音乐。每项有标题、一句说明、相关标签。
export type HobbyEntry = {
  name: string;        // 爱好名
  detail: string;      // 1-2 句说明
  tags: string[];      // 相关关键词/标签
};

export const hobbyContent: HobbyEntry[] = [
  {
    name: "美术",
    detail: "（在这里写和美术有关的事。画了什么、喜欢什么风格、什么时候开始的。）",
    tags: ["（画种）", "（风格）", "（工具）"],
  },
  {
    name: "摄影",
    detail: "（在这里写和摄影有关的事。拍什么、用什么、喜欢什么样的光。）",
    tags: ["（题材）", "（器材）", "（地点）"],
  },
  {
    name: "运动",
    detail: "（在这里写和运动有关的事。做什么运动、频率、为什么喜欢。）",
    tags: ["（项目）", "（频率）", "（场所）"],
  },
  {
    name: "音乐",
    detail: "（在这里写和音乐有关的事。听什么、玩什么、音乐在生活里是什么角色。）",
    tags: ["（风格）", "（乐器）", "（场合）"],
  },
  {
    name: "写作",
    detail: "（在这里写和写作有关的事。写什么、什么时候写、写作在生活里是什么角色。）",
    tags: ["（体裁）", "（工具）", "（场合）"],
  },
];
