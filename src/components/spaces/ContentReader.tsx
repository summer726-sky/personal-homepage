"use client";

// Things 各类别的阅读空间。
// 共享壳：返回、reveal 逐行入场、serif + ember。
// 按类别切换布局——每个类别有独有视觉元素，不完全同质化。

import { useState, type CSSProperties } from "react";
import {
  musicContent,
  travelContent,
  readingContent,
  filmContent,
  objectContent,
  foodContent,
} from "@/data/content";

// reveal 索引计数器
let _ri = 0;
const next = () => ({ "--i": ++_ri } as CSSProperties);

export function ContentReader({
  category,
  onBack,
}: {
  category: string;
  onBack: () => void;
}) {
  _ri = 0; // 每次渲染重置

  return (
    <article className="mx-auto w-full max-w-xl">
      <button
        type="button"
        onClick={onBack}
        className="reading-back reveal mb-12 cursor-pointer border-0 bg-transparent p-0 text-left"
        style={next()}
      >
        ← 回到 Things
      </button>

      {category === "music" && <MusicLayout />}
      {category === "travel" && <TravelLayout />}
      {category === "reading" && <ReadingLayout />}
      {category === "film" && <FilmLayout />}
      {category === "object" && <ObjectLayout />}
      {category === "food" && <FoodLayout />}
    </article>
  );
}

// —— Music：3 首歌，左右交错排列，上下滑动阅读 ——
function MusicLayout() {
  const songs = musicContent;
  return (
    <>
      {songs.map((song, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div
            key={i}
            className={`reveal cr-music-row cr-music-row--${isLeft ? "left" : "right"}`}
            style={next()}
          >
            <div className="cr-music-cover image-slot block rounded-[2px]">
              封面
            </div>
            <div className="cr-music-info">
              <h2 className="font-serif text-2xl leading-snug text-ember">
                {song.title}
              </h2>
              <p className="mt-1 text-sm text-ember-soft">
                {song.artist} · {song.date}
              </p>
              <p className="mt-4 font-serif text-base leading-loose text-ember">
                {song.body}
              </p>
            </div>
          </div>
        );
      })}
      <div className="reveal cr-playbar mt-10" style={next()}>
        <span className="cr-playbar__track" />
        <span className="cr-playbar__head" />
      </div>
    </>
  );
}

// —— Travel：Moments 式明信片卡片，每张是一个地方的印象手记 ——
function TravelLayout() {
  const places = travelContent;
  return (
    <>
      {places.map((entry, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div
            key={i}
            className={`reveal cr-travel-row cr-travel-row--${isLeft ? "left" : "right"}`}
            style={next()}
          >
            <div className="cr-travel-card">
              <p className="cr-travel-card__place font-serif text-lg text-ember">
                {entry.place}
              </p>
              <p className="cr-travel-card__impression mt-3 font-serif text-base leading-loose text-ember-soft">
                {entry.impression}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}

// —— Reading：书名 + 作者 + 摘抄块 + 笔记，多篇 ——
function ReadingLayout() {
  const entries = readingContent;
  return (
    <>
      {entries.map((c, i) => (
        <div key={i} className="reveal" style={next()}>
          {i > 0 && <div className="cr-divider" />}
          <h1 className="font-serif text-3xl leading-snug text-ember">
            {c.title}
          </h1>
          <p className="mt-2 text-sm text-ember-soft">
            {c.author} · {c.date}
          </p>
          <blockquote className="cr-quote mt-8">
            {c.excerpt}
          </blockquote>
          <p className="mt-8 font-serif text-base leading-loose text-ember">
            {c.notes}
          </p>
        </div>
      ))}
    </>
  );
}

// —— Film：剧照（16:9 + 胶片孔装饰）+ 导演 + 场景，多篇 ——
function FilmLayout() {
  const entries = filmContent;
  return (
    <>
      {entries.map((c, i) => (
        <div key={i} className="reveal" style={next()}>
          {i > 0 && <div className="cr-divider" />}
          <div className="image-slot cr-film-still block rounded-[2px]">
            在这里放入让你记住的那个画面
          </div>
          <h1 className="mt-6 font-serif text-3xl leading-snug text-ember">
            {c.title}
          </h1>
          <p className="mt-2 text-sm text-ember-soft">
            {c.director} · {c.year}
          </p>
          <p className="mt-8 font-serif text-base leading-loose text-ember">
            {c.scene}
          </p>
        </div>
      ))}
    </>
  );
}

// —— Object：居中标本卡 + 左右三角形箭头切换 ——
function ObjectLayout() {
  const objects = objectContent;
  const [idx, setIdx] = useState(0);
  const obj = objects[idx];

  const go = (dir: number) => {
    setIdx((prev) => (prev + dir + objects.length) % objects.length);
  };

  return (
    <div className="cr-object-stage reveal" style={next()}>
      {/* 左箭头 */}
      <button
        type="button"
        className="cr-object-arrow cr-object-arrow--left"
        onClick={() => go(-1)}
        aria-label="上一个"
      >
        <span className="cr-object-arrow__tri" />
      </button>

      {/* 标本卡 */}
      <div className="cr-object-center">
        <div className="image-slot cr-object-card mx-auto block rounded-[2px]">
          物件照片
        </div>
        <h1 className="mt-6 text-center font-serif text-3xl leading-snug text-ember">
          {obj.name}
        </h1>
        <p className="mt-2 text-center text-sm text-ember-faint">
          {obj.origin}
        </p>
        <p className="mt-8 font-serif text-base leading-loose text-ember">
          {obj.story}
        </p>
        <p className="cr-object-pager mt-6 text-center text-xs text-ember-faint">
          {idx + 1} / {objects.length}
        </p>
      </div>

      {/* 右箭头 */}
      <button
        type="button"
        className="cr-object-arrow cr-object-arrow--right"
        onClick={() => go(1)}
        aria-label="下一个"
      >
        <span className="cr-object-arrow__tri" />
      </button>
    </div>
  );
}

// —— Food：Ideas 式虚线卡片框，多篇 ——
function FoodLayout() {
  const entries = foodContent;
  return (
    <>
      {entries.map((c, i) => (
        <div key={i} className="reveal cr-food-card" style={next()}>
          <h1 className="font-serif text-3xl leading-snug text-ember">
            {c.name}
          </h1>
          <p className="mt-2 text-sm text-ember-soft">
            {c.kitchen} · {c.season}
          </p>
          <p className="mt-8 font-serif text-base leading-loose text-ember">
            {c.memory}
          </p>
          <div className="cr-food-tags mt-8">
            {c.ingredients.map((ing, j) => (
              <span key={j} className="cr-food-tag">{ing}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
