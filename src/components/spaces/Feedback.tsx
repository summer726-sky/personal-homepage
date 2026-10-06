"use client";

// 留言反馈：Contact 页里的一个线条框，与数字分身同款视觉语言。
// 提交后写入 Supabase 的 feedback 表，可在 Supabase 后台直接查看。
// 安全：表开启 RLS，仅允许匿名 INSERT，不可读取 / 修改。

import { useState, type CSSProperties, type FormEvent } from "react";
import { contact } from "@/data/content";
import { getSupabase } from "@/lib/supabase";

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

export function Feedback({ startIndex }: { startIndex: number }) {
  const fb = contact.feedback;
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || status === "sending") return;

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    const { error } = await supabase.from("feedback").insert({
      name: name.trim() || null,
      message: text,
    });

    if (error) {
      setStatus("error");
      return;
    }
    setName("");
    setMessage("");
    setStatus("success");
  };

  const statusText =
    status === "success"
      ? fb.success
      : status === "unconfigured"
        ? fb.notConfigured
        : status === "error"
          ? fb.error
          : "";

  return (
    <section className="feedback" aria-label={fb.title}>
      <div className="reveal" style={{ "--i": startIndex } as CSSProperties}>
        <h2 className="feedback-title font-serif">{fb.title}</h2>
        <p className="feedback-note">{fb.note}</p>
      </div>

      {status === "success" ? (
        <div
          className="feedback-done reveal"
          style={{ "--i": startIndex + 1 } as CSSProperties}
        >
          <p className="feedback-status feedback-status--success">{statusText}</p>
          <button
            type="button"
            className="feedback-again"
            onClick={() => setStatus("idle")}
          >
            {fb.againLabel}
          </button>
        </div>
      ) : (
        <form
          className="feedback-box reveal"
          style={{ "--i": startIndex + 1 } as CSSProperties}
          onSubmit={submit}
        >
          <label className="feedback-label" htmlFor="fb-contact">
            {fb.contactLabel}
          </label>
          <input
            id="fb-contact"
            className="feedback-input"
            value={name}
            placeholder={fb.contactPlaceholder}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />

          <label className="feedback-label" htmlFor="fb-message">
            留言
          </label>
          <textarea
            id="fb-message"
            className="feedback-textarea"
            value={message}
            placeholder={fb.messagePlaceholder}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={5}
          />

          <div className="feedback-foot">
            <p
              className={`feedback-status ${
                status === "error" || status === "unconfigured"
                  ? "feedback-status--error"
                  : ""
              }`}
              aria-live="polite"
            >
              {statusText}
            </p>
            <button
              type="submit"
              className="feedback-send"
              disabled={status === "sending" || !message.trim()}
            >
              {status === "sending" ? fb.sendingLabel : fb.sendLabel}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
