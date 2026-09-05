// 首页：按顺序组合各 section。
// 顺序本身是一种叙事，但不是唯一分类——同一内容可以同时属于多个时间。

import { Hero } from "@/components/sections/Hero";
import { Now } from "@/components/sections/Now";
import { Fragments } from "@/components/sections/Fragments";
import { Thoughts } from "@/components/sections/Thoughts";
import { Past } from "@/components/sections/Past";
import { Future } from "@/components/sections/Future";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <Now />
      <Fragments />
      <Thoughts />
      <Past />
      <Future />
      <Projects />
    </>
  );
}
