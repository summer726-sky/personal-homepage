"use client";

// Things 各类别的阅读空间。
// 共享壳：返回、reveal 逐行入场、serif + ember。
// 按类别切换布局——每个类别有独有视觉元素，不完全同质化。
//
// 数据源（2026-10-08 起）：music/travel/reading/hobby 内容从 Supabase
//   contents 加载；静态 content.ts 切片保留为 fallback。
//   - 查询：type=things, category=<x>, order sort_order asc
//   - 失败/未配置/空数据 → 保留 fallback，不崩页面。

import { useEffect, useState, type CSSProperties } from "react";
import {
  musicContent,
  travelContent,
  readingContent,
  hobbyContent,
} from "@/data/content";
import { getSupabase } from "@/lib/supabase";

// reveal 索引计数器
let _ri = 0;
const next = () => ({ "--i": ++_ri } as CSSProperties);

// —— Supabase contents 行类型 + 各分类转换 ——
type DBRow = {
  content_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_key: string | null;
  sort_order: number;
};

type MusicRow = {
  title: string;
  artist: string;
  date: string;
  body: string;
  coverSrc?: string;
};
type TravelRow = { place: string; impression: string };
type ReadingRow = {
  title: string;
  author: string;
  date: string;
  excerpt: string;
  notes: string;
};
type HobbyRow = { name: string; detail: string; tags: string[] };

// Music 三张封面的实际文件名（Storage 中首字母 M 大写，扩展名不一致）
const musicImageFile: Record<string, string> = {
  music001: "Music001.jpg",
  music002: "Music002.png",
  music003: "Music003.jpg",
};

// 拉指定 category 的 contents；失败/未配置/空数据返回 null
async function fetchRows(category: string): Promise<DBRow[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("contents")
    .select("content_key, title, subtitle, content, image_key, sort_order")
    .eq("type", "things")
    .eq("category", category)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return null;
  return data as DBRow[];
}

// subtitle 形如 "艺人 · 年份" → 拆 artist + date
function splitArtistDate(subtitle: string | null): {
  artist: string;
  date: string;
} {
  const parts = (subtitle ?? "").split(" · ");
  return {
    artist: parts[0]?.trim() ?? "",
    date: parts[1]?.trim() ?? "",
  };
}

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
      {category === "hobby" && <HobbyLayout />}
    </article>
  );
}

// —— Music：3 首歌，左右交错排列，上下滑动阅读 ——
function MusicLayout() {
  const [songs, setSongs] = useState<MusicRow[]>(musicContent as MusicRow[]);
  useEffect(() => {
    fetchRows("music").then((rows) => {
      if (!rows) return;
      const supabase = getSupabase();
      setSongs(
        rows.map((r) => {
          let coverSrc: string | undefined;
          if (supabase && r.image_key && musicImageFile[r.image_key]) {
            const path = `things/music/${musicImageFile[r.image_key]}`;
            coverSrc = supabase.storage
              .from("images")
              .getPublicUrl(path).data.publicUrl;
          }
          return {
            title: r.title ?? "",
            ...splitArtistDate(r.subtitle),
            body: r.content ?? "",
            coverSrc,
          };
        })
      );
    });
  }, []);
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
            {song.coverSrc ? (
              <img
                src={song.coverSrc}
                alt={song.title || ""}
                className="cr-music-cover image-slot block rounded-[2px]"
                style={{ objectFit: "cover" } as CSSProperties}
              />
            ) : (
              <div className="cr-music-cover image-slot block rounded-[2px]">
                封面
              </div>
            )}
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

// —— Travel：Moments 式明信片卡片，每张是一个地方的印象手记。
// 卡片背面（页面中间）一条折线交错的 moments 时间线样式虚线，
// 锐利折线（非平滑曲线）左右交错，把明信片串起来。
// 估算每个 row 在容器中的中心 y 百分比（纯文字卡约 17%，gap 约 4.5%）
function estimateTravelCenters(count: number): number[] {
  const h = 17;
  const gap = 4.5;
  let y = 2;
  const centers: number[] = [];
  for (let i = 0; i < count; i++) {
    centers.push(y + h / 2);
    y += h + gap;
  }
  return centers;
}

function TravelLayout() {
  const [places, setPlaces] = useState<TravelRow[]>(
    travelContent as TravelRow[]
  );
  useEffect(() => {
    fetchRows("travel").then((rows) => {
      if (!rows) return;
      setPlaces(
        rows.map((r) => ({
          place: r.title ?? "",
          impression: r.content ?? "",
        }))
      );
    });
  }, []);

  const centers = estimateTravelCenters(places.length);
  // 折线节点 x：卡片在左→偏向 40，在右→偏向 60，锐利交错
  const xs = places.map((_, i) => (i % 2 === 0 ? 40 : 60));
  // 折线路径：M 起点 L 下一节点 …
  const d = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${centers[i]}`)
    .join(" ");
  return (
    <div className="cr-travel-timeline">
      {/* 折线虚线：在卡片背面 */}
      <svg
        className="cr-travel-timeline__svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="cr-travel-timeline__path"
          d={d}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

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
    </div>
  );
}

// —— Reading：书名 + 作者 + 摘抄块 + 笔记，多篇 ——
function ReadingLayout() {
  const [entries, setEntries] = useState<ReadingRow[]>(
    readingContent as ReadingRow[]
  );
  useEffect(() => {
    fetchRows("reading").then((rows) => {
      if (!rows) return;
      setEntries(
        rows.map((r) => ({
          title: r.title ?? "",
          author: r.subtitle ?? "",
          date: "",
          excerpt: r.content ?? "",
          notes: "",
        }))
      );
    });
  }, []);
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

// —— Hobby：参考 Professional 样式——顶部索引（点击平滑滚动）+ 分区。
// 美术、摄影、运动、音乐、写作，每项一个分区：标题 + 说明 + 标签。
function HobbyLayout() {
  const [entries, setEntries] = useState<HobbyRow[]>(
    hobbyContent as HobbyRow[]
  );
  useEffect(() => {
    fetchRows("hobby").then((rows) => {
      if (!rows) return;
      setEntries(
        rows.map((r) => ({
          name: r.title ?? "",
          detail: r.content ?? "",
          tags: [],
        }))
      );
    });
  }, []);
  return (
    <>
      {/* 索引 */}
      <nav className="reveal professional-index" style={next()} aria-label="爱好索引">
        {entries.map((e, i) => (
          <span key={e.name} className="professional-index__wrap">
            {i > 0 && <span className="professional-index__sep">·</span>}
            <span
              className="professional-index__item"
              onClick={() =>
                document.getElementById(`hobby-${e.name}`)?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {e.name}
            </span>
          </span>
        ))}
      </nav>

      {entries.map((c, i) => (
        <section
          key={c.name}
          id={`hobby-${c.name}`}
          className={i === 0 ? "mt-16" : "mt-16"}
        >
          <h2 className="reveal professional-section-title" style={next()}>
            {c.name}
          </h2>
          <div className="reveal professional-entry" style={next()}>
            <p className="professional-entry__summary">{c.detail}</p>
            <div className="professional-stack">
              {c.tags.map((tag) => (
                <span key={tag} className="professional-stack__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      ))}
      <div className="mb-32" />
    </>
  );
}
