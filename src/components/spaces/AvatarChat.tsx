"use client";

// 数字分身 · 对话窗口
//
// 直接呈现在 Contact 页（无二级入口）：夜色里的三格线条框。
//   ① 介绍框：分身头像 + 一句问候
//   ② 聊天框：容纳对话，左=分身（夜色头像+暖光），右=访客「我」
//      （一个只写「我」字的线条头像框，无图片）
//   ③ 输入框：线条描边、背景比夜色再深一点，无实体底色
// 风格与 Contact 名录协同：冷灰蓝夜色 + 线条，不做白纸。
// 字体用无衬线（非文艺衬线体）。
//
// 本阶段约束：不接 AI API、不做后端、不做存储。
// 消息只存在于组件状态里；访客发送后，分身先「输入中」片刻，
// 再以轮换的占位语回应，示意真正的对话尚未接入。
// 后续接入数字分身数据时，仅需替换 send() 中的占位回复逻辑，
// UI 与数据结构（role + text）不变。

import { useEffect, useRef, useState } from "react";
import { avatarChat } from "@/data/content";
import { getSupabase } from "@/lib/supabase";

type ChatMessage = {
  id: number;
  role: "avatar" | "visitor";
  text: string;
};

// —— 数字分身知识库（Supabase digital_twin_knowledge）——
// 输入规范化：trim + 去中英文问号。不分词、不模糊搜索、无 AI。
function normalizeInput(text: string): string {
  return text.trim().replace(/[??]/g, "");
}

type KnowledgeRow = {
  question: string;
  variants: string[] | null;
  answer: string;
};

// 关键词意图匹配（兜底）：精确匹配未命中时，按 question 统计
// 用户输入命中了多少个关键词，至少 2 个才算匹配。
const intentKeywords: Record<string, string[]> = {
  "你对 AI 怎么看": ["ai", "人工智能", "看法", "怎么看", "觉得", "有用"],
  "你对 vibe coding 怎么看": ["vibe coding", "ai 写代码", "ai 编程", "写代码", "编程", "怎么看"],
  "你平时喜欢听什么歌": ["音乐", "歌曲", "歌", "听歌", "喜欢听", "听什么歌", "音乐类型"],
  "你喜欢看什么电影": ["电影", "看电影", "影片"],
  "你平时怎么放松": ["放松", "压力", "累", "充电", "休息"],
  "你的兴趣爱好是什么": ["兴趣", "爱好", "喜欢", "感兴趣"],
  "你平时喜欢干什么": ["平时", "空闲", "业余", "干什么", "做什么"],
  "你最近在忙什么": ["最近", "忙", "近况"],
  "你平时用什么工具": ["工具", "软件", "工作流", "用什么"],
  "你想做什么方向的工作": ["工作", "职业", "方向", "未来"],
  "你现在在找机会吗": ["机会", "合作", "工作机会", "找工作"],
};

// 匹配顺序：question 完全匹配 → variant 完全匹配 →
// 输入包含 question / variant → 关键词意图匹配（≥2 命中）。
// 全部未命中返回 null（走占位轮换）。
async function matchKnowledge(text: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const input = normalizeInput(text);
  if (!input) return null;

  const { data, error } = await supabase
    .from("digital_twin_knowledge")
    .select("question, variants, answer");
  if (error || !data) return null;

  const rows = (data as KnowledgeRow[]).filter(
    (r) => r && typeof r.answer === "string"
  );

  // ① question 完全匹配 ② variant 完全匹配
  for (const r of rows) {
    if (normalizeInput(r.question) === input) {
      return r.answer;
    }
  }
  for (const r of rows) {
    if (r.variants?.some((v) => normalizeInput(v) === input)) {
      return r.answer;
    }
  }
  // ③ 输入包含 question / variant
  for (const r of rows) {
    if (normalizeInput(r.question) && input.includes(normalizeInput(r.question))) {
      return r.answer;
    }
  }
  for (const r of rows) {
    for (const v of r.variants ?? []) {
      const nv = normalizeInput(v);
      if (nv && input.includes(nv)) {
        return r.answer;
      }
    }
  }

  // ④ 关键词意图匹配（兜底）：对每条 knowledge 统计命中关键词数，
  // 取最高分；至少 2 个命中才算匹配，否则回退占位轮换。
  const inputLower = input.toLowerCase();
  let bestQuestion = "";
  let bestScore = 0;
  for (const r of rows) {
    const kws = intentKeywords[r.question];
    if (!kws) continue;
    let score = 0;
    for (const kw of kws) {
      if (!kw) continue;
      // 中文按原词包含；英文关键词统一小写比较
      const nkw = normalizeInput(kw).toLowerCase();
      if (nkw && inputLower.includes(nkw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestQuestion = r.question;
    }
  }

  if (bestScore >= 2) {
    const hit = rows.find((r) => r.question === bestQuestion);
    return hit ? hit.answer : null;
  }

  return null;
}

export function AvatarChat({ avatarSrc }: { avatarSrc?: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const replyIdx = useRef(0); // 轮换占位回复
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 打开：分身先开口（聊天框第一条消息）
  useEffect(() => {
    setMessages([
      { id: idRef.current++, role: "avatar", text: avatarChat.greeting },
    ]);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 新消息 / 输入中：滚到底部
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  // 发送一句：记下访客的话 → 短暂「输入中」→
  // 先查 Supabase 知识库匹配回答；未命中/失败/未配置时
  // 回退到轮换占位语（原行为）。
  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMessages((m) => [...m, { id: idRef.current++, role: "visitor", text: t }]);
    setDraft("");
    setTyping(true);
    timerRef.current = setTimeout(() => {
      matchKnowledge(t)
        .then((hit) => {
          const reply =
            hit ??
            avatarChat.pendingReplies[
              replyIdx.current % avatarChat.pendingReplies.length
            ];
          if (!hit) replyIdx.current += 1;
          setMessages((m) => [
            ...m,
            { id: idRef.current++, role: "avatar", text: reply },
          ]);
        })
        .catch(() => {
          const reply =
            avatarChat.pendingReplies[
              replyIdx.current % avatarChat.pendingReplies.length
            ];
          replyIdx.current += 1;
          setMessages((m) => [
            ...m,
            { id: idRef.current++, role: "avatar", text: reply },
          ]);
        })
        .finally(() => setTyping(false));
    }, 1100);
  };

  return (
    <div className="avchat" aria-label="数字分身">
      {/* ① 介绍框：头像 + 一句问候 */}
      <section className="avchat-box avchat-box--intro">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt=""
            className="avchat-avatar avchat-avatar--avatar"
          />
        ) : (
          <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
        )}
        <p className="avchat-intro">{avatarChat.intro}</p>
      </section>

      {/* ② 聊天框：容纳对话 */}
      <section className="avchat-box avchat-box--chat" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`avchat-msg avchat-msg--${m.role}`}>
            {m.role === "avatar" ? (
              avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt=""
                  className="avchat-avatar avchat-avatar--avatar"
                />
              ) : (
                <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
              )
            ) : (
              <span className="avchat-avatar avchat-avatar--me" aria-hidden>
                我
              </span>
            )}
            <div className="avchat-bubble">
              <p className="avchat-text">{m.text}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="avchat-msg avchat-msg--avatar">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt=""
                className="avchat-avatar avchat-avatar--avatar"
              />
            ) : (
              <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
            )}
            <div className="avchat-bubble avchat-bubble--dots" aria-label="正在输入">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </section>

      {/* ③ 输入框：线条描边、背景比夜色再深一点 */}
      <section className="avchat-box avchat-box--input">
        <div className="avchat-chips">
          {avatarChat.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="avchat-chip"
              onClick={() => send(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="avchat-inputrow"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <input
            ref={inputRef}
            className="avchat-input"
            value={draft}
            placeholder={avatarChat.inputPlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={200}
            aria-label={avatarChat.inputPlaceholder}
          />
          <button
            type="submit"
            className="avchat-send"
            aria-label={avatarChat.sendLabel}
          >
            {avatarChat.sendLabel}
          </button>
        </form>
      </section>
    </div>
  );
}
