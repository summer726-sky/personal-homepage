// 顶部导航：极简、半透明、锚点跳转、平滑滚动（CSS 已设置 scroll-behavior）。
// 移动端链接横向滚动，避免汉堡菜单的额外复杂度。

import { profile } from "@/data/profile";
import { sections } from "@/data/nav";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule/60 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-4 sm:px-8">
        <a href="#top" className="font-serif text-base text-ink">
          {profile.name}
        </a>
        <span className="text-ink-faint">·</span>
        <nav className="no-scrollbar ml-auto flex min-w-0 gap-5 overflow-x-auto whitespace-nowrap text-sm text-ink-soft">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="transition-colors hover:text-ink">
              {s.zh}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
