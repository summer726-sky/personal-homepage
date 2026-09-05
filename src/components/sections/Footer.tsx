// 页脚：联系方式等。保持安静。

import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule px-6 sm:px-8">
      <div className="mx-auto w-full max-w-3xl py-14">
        <p className="font-serif text-sm text-ink-faint">联系</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-ink">
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <span className="text-ink-faint">{profile.location}</span>
        </div>
        <p className="mt-10 text-xs text-ink-faint">
          © {year} {profile.name}. 由 Next.js 驱动。
        </p>
      </div>
    </footer>
  );
}
