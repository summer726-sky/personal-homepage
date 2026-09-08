# 项目上下文 · Personal Homepage

> 本文件是项目的单一事实来源（single source of truth）：设计风格、色调、空间结构、动画原则、工程约定。
> 新会话 / 新协作者从这里开始。修改视觉或交互约定时，先改这里，再改代码。

---

## 1. 项目定位

一个**个人主页**，以"蓝调夜色里的私人空间"为总体隐喻：访客像在傍晚推开一扇门，逐层走进主人留着的房间。内容（真实的歌、照片、想法）由用户陆续填入，网站本身是**容器与氛围**。

- **纯静态**：无数据库、无登录、无复杂后端。
- **长期生长**：架构须支持四年量级的持续扩展（时间感是底层叙事，不是导航分类）。
- **内容为王**：内容是视觉主体，UI 克制、退后。

## 2. 技术栈

| 项 | 值 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript 5 |
| 样式 | Tailwind CSS 4（`@theme` tokens）+ 全局 CSS（globals.css） |
| 动效 | 纯 CSS + 少量 inline transform（无动画库；WebGL/3D 未引入） |
| 数据 | 本地 TS 文件（`src/data/`），无运行时数据源 |

## 3. 目录结构与职责

```
src/
├── app/
│   ├── layout.tsx        # 根布局、字体
│   ├── page.tsx          # 唯一路由 "/"，挂载 Experience
│   └── globals.css       # ★ 所有视觉 token 与组件样式集中于此
├── components/spaces/
│   ├── Experience.tsx    # 空间状态机（空间切换 + 转场）
│   ├── Entrance.tsx      # 开场：逐行显现的欢迎语
│   ├── Fork.tsx          # 分岔：Personal / Professional 两扇门
│   ├── Personal.tsx      # Personal 第一级：Things/Ideas/Moments 三张纸
│   ├── Things.tsx        # Things 内部：3D 透视轮播卡片
│   ├── Reading.tsx       # 极简阅读状态
│   ├── primitives.tsx    # 复用原语（Door、EnvFragment 等）
│   └── traces.tsx        # 环境痕迹组件（虚化照片、暖灯、窗角、擦除字迹…）
└── data/
    ├── content.ts        # ★ 全部文案与内容数据（与 UI 解耦）
    └── profile.ts        # 个人基本信息
```

**原则：内容与 UI 解耦。** 页面组件不得硬编码大段内容；所有文案进 `data/`。

## 4. 空间路径（当前实现）

```
Entrance → Fork (Personal/Professional) → Personal (Things/Ideas/Moments)
         → Things (3D 轮播) → Reading（内容阅读）
```

- Professional / Ideas / Moments 目前只有入口视觉（`aria-disabled`），尚未实现内部。
- `Experience.tsx` 用 `space` 状态 + `is-leaving` 收束类实现转场（EXIT_MS = 520ms）。

## 5. 设计风格 · Blue Hour（蓝调时刻）

### 5.1 总气质

- **冷灰蓝主导**的城市私人空间：深夜蓝灰的墙、微光的地平线。
- 温暖感**只来自光源**（窗、灯、高光的暖黄/暖白），**不来自黄褐色调**。
- 紫色**只作反射**（阴影深处、玻璃回弹），绝不作主题色。
- 安静、优雅、文学性；拒绝简历感 / SaaS 落地页感 / 过度动画。

### 5.2 色彩角色（globals.css `@theme`，不要混用）

| Token | 值 | 角色 |
|---|---|---|
| `--color-env` | `#131a26` | 空间基底（deep blue-gray，非纯黑） |
| `--color-env-2` | `#1a2332` | 空间层次 |
| `--color-env-3` | `#232f42` | 空间亮层 |
| `--color-paper` | `#e8edf3` | 纸张（冷近白，被蓝雾包围） |
| `--color-paper-2` | `#d9e1ea` | 纸张渐变端 |
| `--color-paper-edge` | `#b7c5d5` | 纸边 |
| `--color-ink` | `#1d2634` | 纸上墨色（深蓝灰墨） |
| `--color-ink-soft` | `#505e70` | 次级墨 |
| `--color-ink-faint` | `#78859a` | 淡墨 |
| `--color-glow` | `#f0d3a2` | ★ 暖光源：窗、灯、高光 |
| `--color-ember` | `#d3dce7` | 暗环境主文字（月光冷白） |
| `--color-ember-soft` | `#93a1b5` | 暗环境次级文字 |
| `--color-ember-faint` | `#617088` | 暗环境弱文字（按钮默认态） |
| `--color-rule` | `#4b5a72` | 分隔线 |
| `--color-reflect` | `#8d86c3` | ★ 紫色：只作反射 |

### 5.3 光照约定

1. **暖光来自右上方**（一扇看不见的窗/街灯）。
2. **冷雾弥漫**（蓝灰基底 + 中央雾 + 左侧冷填充）。
3. **紫色只在深处反射**（低处、阴影、玻璃回弹，透明度极低）。
4. 空气颗粒：粗尺度 SVG turbulence，冷色、极淡（screen 混合）。

### 5.4 字体

- 标题/氛围语：`font-serif`（衬线，文学感）。
- 正文/UI 小字：`--font-sans`。
- 弱文字一律 `ember-faint` + 小字号，hover 才提亮到 `ember`。

## 6. 交互与动画原则

**核心原则：「空间回应，不让空间表演」**（space responds, not performs）。
所有动效服务于氛围（安静），宁少勿多；`prefers-reduced-motion` 必须遵守。

### 6.1 空间转场
- 离开：`opacity + blur(4px) + scale(0.975) + translateY(8px)`，0.5s。
- 进入：逐行 `reveal`（blur→clear + 轻上移，0.85s，`--i` 控制 100ms 级差）。

### 6.2 Things 3D 轮播
- 卡片槽位 `.carousel-card-slot`：规则矩形，承担点击命中；尺寸 15×21rem（移动端 12×17.5rem）。
- 视觉层 `.vynora-card`：`rotateY` 朝中心倾斜（仅视觉，不影响 hit area）。
- 循环偏移 `relOffset` 落在 `[-HALF, HALF]`，首尾相接。
- **端卡片切换：原地隐退/显现**（外漂+模糊+淡出 ↔ 内漂+清晰+淡入），绝不横穿舞台；过渡 0.9s `cubic-bezier(0.25, 0.46, 0.45, 0.94)`。
- 隐藏卡停在可见边缘外 1.3 倍间距处。
- 类别词随切换**直接更替，无动效**（曾做过隐退/显现，已按需求取消）。
- **镜面倒影** `.vynora-card-reflect`：
  - 与卡片同宽、上下对齐（`top: calc(100% - 2px)` 微重叠封缝）；
  - `border-radius: 6px` 与卡片底角一致；
  - `mask-image` 向下渐隐，底部完全融入背景，无可见分界线；
  - 在 slot 内随 `scale` 同步缩放（侧卡倒影同比例变小变暗）；
  - 基础 opacity 0.5，活跃卡 0.8。

### 6.3 Personal 入口
- 三张错落层叠的纸，各自极慢漂浮（动画在包裹层 `.sheet-float`，不触碰纸的 reveal/hover）。
- 衬纸 `back-sheet--bridge/mid/far` 扇出 + `link-sheet` 连接纸，让入口之间无突兀感、逐渐融入背景。
- 返回按钮 `.space-back`：细线箭头 + "返回"小字，hover 轻微左移并亮起。

## 7. 内容原则

- **真实个人内容只来自用户**。缺内容时用【明确占位】（如"（一首歌）"），绝不编造。
- whisper / 氛围碎片是情绪短句（非个人事实），可用 brief 中的示例，也可替换。
- 新增内容一律进 `src/data/content.ts`，遵循现有类型（如 `ThingsCard`）。

## 8. 工程约定与经验教训

1. **视觉 token 集中管理**：颜色、光照、间距语义只写在 `globals.css`；组件不硬编码样式值。
2. **CSS+SVG 可达 ~90% 视觉真实感**；引入 WebGL/3D 前先权衡复杂度收益。
3. **避免过早加功能**：先完成当前层级骨架，验收"内容容纳 + 整体美观精致"。
4. **Git 工作流**：分支 `v3-cold-blue`；阶段性成果用 checkpoint 提交（`checkpoint: ...`），不重写历史。
5. **半透明层叠 + 渐变/mask** 是连接入口与背景、消除硬边界的惯用手法。
6. **Windows 环境注意**：
   - PowerShell 不支持 `&&`，用 `;` 分隔命令；
   - `npx`/`npm` 被 Execution Policy 阻止，构建用 `node node_modules/next/dist/bin/next build`。

## 9. 待办 / 下一步决策点

- [ ] 用户填入真实内容（歌曲、照片、旅行记忆…），替换占位。
- [ ] Ideas / Moments 内部界面（Personal 第二级）。
- [ ] Professional 空间。
- [ ] Reading 阅读态的内容承载细化（照片/长文排版）。

---

*最后更新：2026-09-07 · checkpoint `3008425`（things v2：类别词直切 + Personal 返回按钮 + 倒影自然化）*
