# 项目上下文交接文件

> 生成时间：2026-09-19 · 分支 `v3-cold-blue` · 供下一次会话/协作者快速恢复上下文

## 1. 项目概况

个人主页站点：以「蓝调时刻」（blue hour）为统一氛围的静态空间导航站。
状态机空间流：**Entrance →（向下）Fork（双门）→ Personal / Professional →（Personal 内纸张）Things / Ideas / Moments →（Things 中央卡）Photography / Music / Travel / Reading / Food 等内容空间**。

硬约束（必须遵守）：

- 纯静态 + 本地数据（无数据库、无登录、无复杂后端）
- 架构需支持四年以上的长期内容扩展；时间感是底层叙事结构
- 内容与 UI 解耦：文案数据在 `src/data/`，不在页面组件里硬编码
- 视觉：冷灰蓝主导、蓝调时刻氛围；温度感只来自光源（暖白/冷黄）而非黄色调；紫色仅作反射
- 交互原则：「空间回应，而非表演」——动效极少、克制、有呼吸感
- 非阅读类空间固定视口高度无滚动条；阅读类空间（Ideas/Moments/Reading）才允许纵向滚动

## 2. 技术栈与运行

- Next.js + React 19 + TypeScript，视觉全部为 CSS（globals.css 集中管理），无动画库、无 3D 库
- 构建：`node node_modules/next/dist/bin/next build`（Windows）
- 开发：`http://localhost:3000`
- 视觉验收截图：先复制到项目根 `mobile-screenshots\` 再打开（Temp 路径用户打不开）

## 3. 文件地图与职责

```
src/
├─ app/
│  ├─ page.tsx            空间状态机（当前空间、切换动画 is-leaving）
│  ├─ layout.tsx          viewport meta（手机端适配）
│  └─ globals.css         全部视觉 token + 空间样式；桌面样式在顶层，手机覆盖在 @media (max-width: 720px)
├─ data/
│  ├─ content.ts          各内容空间的文案数据（时间线/经历/项目/文章/照片等）
│  └─ profile.ts          个人信息
├─ components/
│  ├─ paper/PaperSurface.tsx  纸张可复用视觉系统
│  └─ spaces/
│     ├─ Entrance.tsx     入口（姓名、contact、向下箭头）
│     ├─ Fork.tsx         双门 + "meet me at the" 文案 + 两层呼吸光点
│     ├─ Personal.tsx     三张纸（Ideas/Things/Moments）
│     ├─ Professional.tsx 时间线·经历·项目·工具 + 顶部索引锚点平滑滚动
│     ├─ Things.tsx       3D 卡片轮播（5 分类）+ 底部颜色晕染
│     ├─ Gallery.tsx      Photography 照片序列（顶部弧形缩略图墙 + 底部展示照片）
│     ├─ Ideas/Moments/Reading/Experience/Contact/ContentReader …
│     └─ primitives.tsx / traces.tsx
```

## 4. 当前 Git 状态

- 分支 `v3-cold-blue`，最后 checkpoint：`8c573f9`（手机端适配第一批）
- **未提交改动**（本阶段手机端第二轮调整，构建已通过、视觉已验收）：
  - `src/app/globals.css` —— 手机端晕染/卡片/遮罩/暗面全部调整
  - `src/components/spaces/Things.tsx` —— 卡片结构拆分 head/foot、晕染搅动逻辑
  - `src/components/spaces/Fork.tsx` —— 两层光点（大光点聚于字背后）
  - `src/components/spaces/Gallery.tsx` —— 手机纵向滑动
  - 未跟踪：`mobile-screenshots/` 4 张过程截图（可不入库）

## 5. 手机端适配：已完成改动清单（≤720px）

1. **Entrance**：文字过长自动缩字号；**Fork**：双门等比缩小；**Personal**：三纸竖向层叠可点击（叠角距离已调，Ideas 文字不被遮挡）
2. **Things 卡片**：`cardInnerTransform` 手机端 `rotate(-90deg)`，内容 `.vynora-card-inner` 绝对居中且**宽高互换**（14.6×9.3rem）后反向旋转——文字正立且精确落在卡面内；结构分 `.vynora-card-head`（分类左+标题）与 `.vynora-card-foot`（地点/氛围句，右对齐落卡底）
3. **Things 分类标题**：移到页面下方 `.things-category--bottom` 随切换更替；原「点击两侧卡片切换」手机端隐藏
4. **Things 底部颜色晕染**（`.things-haze`，三团：左冷蓝/右下暖/底紫）：
   - 静止：`haze-drift-a/b/c` 各自缓流；入场 `haze-enter` 挂在**色斑**上（opacity 层）与缓流（transform 层）分离
   - 翻卡时整层 `haze-stir` 搅动一次（纯 transform，方向跟随卡片来去），由 `animationend` 收尾 + `stirringRef` 防中途重启
   - 饱和度已下调：基底 `saturate(0.82)`，三团 alpha 0.62/0.26/0.28
5. **Gallery**：手机纵向滑动切换；**阴影区在页面下部**——遮罩洞在底部中央（`radial-gradient(... at 50% 102%)`，上部缩略图铺满明亮），`gallery-dark` 渐变 `0deg`（底部最暗 0.56 向上过渡），照片中线压在过渡带、配文在照片下方阴影里
6. **Fork 光点**：30 小光点（文案两肩/头顶密集、向外稀疏）+ 8 大散景光团（**聚在字背后**），全部呼吸律动、相位错开；`prefers-reduced-motion` 停动保留静态微光
7. **触摸滑动**：Things 与 Gallery 均已实测（上滑/下滑/防误触阈值 30px）全部通过

## 6. 关键实现模式（改动时必须同步的地方）

- **双端判定**：CSS 断点 `@media (max-width: 720px)` + TS 里 `MOBILE_MQ`（Gallery.tsx / Things.tsx 各有一处 `matchMedia`）+ `isMobileRef`（供回调/tick 读取）。改断点必须三处同步
- **桌面端零回归**：`.vynora-card-head/foot` 桌面为纵向布局、foot `flex:1`；桌面样式写在媒体查询外，手机覆盖写在查询内
- **动画分层防闪退**：同一元素上多个动画必须分属不同属性（opacity 与 transform）；wrapper 上的 class 增删不能触碰已结束的入场动画（否则 `fill: both` 重放 → 闪退）
- **序列遮罩挖洞方向**：`gallery-curves` 的 mask 洞位置 = 暗色露出区域位置；洞在顶就是顶部黑穹顶（已踩坑）

## 7. 已踩过的坑（勿重复）

1. 搅动动画里加 `brightness/saturate` 峰值 → 视觉闪烁；已改纯 transform
2. `.is-stirred` 移除后重放 `sparks-fade` 入场 → 整层消失再浮现的「闪退」；入场已挪到色斑层
3. 定时器收尾切动画尾帧 → 跳变；一律 `animationend` + reduced-motion 兜底定时器
4. 临时把断点调到 2000px 做浏览器验收 → **用完必须还原 720px**（本次已还原）
5. 卡片内文字随卡体旋转后溢出 → 内容层必须「宽高互换」再反向旋转，而非简单居中

## 8. 待办 / 下一步决策点

- [ ] 提交本阶段 checkpoint（4 个修改文件；建议提交信息主题：手机端晕染/卡片/阴影区/光点调整）
- [ ] `mobile-screenshots/` 是否纳入版本库由用户决定
- [ ] 手机端其余空间（Ideas/Moments/Reading/Professional/Contact）尚未系统验收
- [ ] 光点/晕染粒子层已出现三种同类实现（Fork 小光点、Fork 大散景、Things 晕染），可考虑抽成可复用「呼吸粒子」系统（聚集中心/数量/层次/色温参数化）
- [ ] 四年扩展规划：content.ts 的数据结构按时间叙事继续细化
