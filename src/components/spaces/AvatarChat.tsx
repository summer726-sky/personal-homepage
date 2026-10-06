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

type ChatMessage = {
  id: number;
  role: "avatar" | "visitor";
  text: string;
};

export function AvatarChat() {
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

  // 发送一句：本阶段不做真实对话——
  // 记下访客的话 → 短暂「输入中」→ 轮换占位语。
  // 后续接入数字分身数据时，把 setTimeout 里的占位回复
  // 换成真实对话来源即可。
  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMessages((m) => [...m, { id: idRef.current++, role: "visitor", text: t }]);
    setDraft("");
    setTyping(true);
    timerRef.current = setTimeout(() => {
      const reply =
        avatarChat.pendingReplies[replyIdx.current % avatarChat.pendingReplies.length];
      replyIdx.current += 1;
      setMessages((m) => [...m, { id: idRef.current++, role: "avatar", text: reply }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="avchat" aria-label="数字分身">
      {/* ① 介绍框：头像 + 一句问候 */}
      <section className="avchat-box avchat-box--intro">
        <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
        <p className="avchat-intro">{avatarChat.intro}</p>
      </section>

      {/* ② 聊天框：容纳对话 */}
      <section className="avchat-box avchat-box--chat" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`avchat-msg avchat-msg--${m.role}`}>
            {m.role === "avatar" ? (
              <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
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
            <span className="avchat-avatar avchat-avatar--avatar" aria-hidden />
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
