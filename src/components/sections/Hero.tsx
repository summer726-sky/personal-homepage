// Hero：名字 + 一句表达 + 向下探索的入口。
// 不喧哗，留白为主，让访客慢慢往下看。

import { profile } from "@/data/profile";
import { FadeIn } from "../ui/FadeIn";

export function Hero() {
  return (
    <section id="top" className="flex min-h-[78vh] items-center px-6 sm:px-8">
      <div className="mx-auto w-full max-w-3xl py-24">
        <FadeIn>
          <p className="font-serif text-sm text-ink-faint">个人主页 · 2026</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {profile.tagline}
          </p>
          <div className="mt-12">
            <a
              href="#now"
              className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <span>向下慢慢看</span>
              <span className="inline-block translate-y-px">↓</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
