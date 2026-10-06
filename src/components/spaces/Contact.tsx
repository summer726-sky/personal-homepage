"use client";

// Contact：联系方式直接陈列，不装在卡片里。
// 形态：房间里的一行行索引——左侧类别、右侧地址，中间一条极淡的
// 虚线导引（像书的目录、或楼下信箱的名录）。没有框、没有纸，
// 文字直接落在墙上。hover 时整行轻轻亮起，地址微微向前（右）。
// 名录之后是「留言」反馈框（写入 Supabase），末尾是「数字分身」：
// 一道分割线后，三框对话直接呈现（无二级入口）。

import type { CSSProperties } from "react";
import { contact } from "@/data/content";
import { AvatarChat } from "./AvatarChat";
import { Feedback } from "./Feedback";

export function Contact({ onBack }: { onBack: () => void }) {
  return (
    <>
      {/* 房间层：极淡冷蓝灰单块晕染，信息行是主角，晕染最弱 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        <span className="haze-contact" />
      </div>

      <div className="room-content shell-text relative mx-auto w-full">
        {/* 返回上一级 */}
        <button
          type="button"
          onClick={onBack}
          className="space-back reveal"
          style={{ "--i": 0 } as CSSProperties}
          aria-label="返回上一级"
        >
          <span className="space-back__arrow" aria-hidden>←</span>
          <span>返回</span>
        </button>

        <p
          className="reveal mt-16 font-serif text-base text-ember-soft"
          style={{ "--i": 1 } as CSSProperties}
        >
          {contact.ambient}
        </p>

        {/* 名录：一行一个联系方式，直接、不绕弯 */}
        <div className="contact-list mt-10">
          {contact.entries.map((e, i) => {
            const inner = (
              <>
                <span className="contact-row__label">{e.label}</span>
                <span className="contact-row__leader" aria-hidden />
                <span className="contact-row__value">{e.value}</span>
              </>
            );
            const style = { "--i": 2 + i } as CSSProperties;
            return e.href ? (
              <a
                key={e.label}
                className="contact-row reveal"
                href={e.href}
                target={e.href.startsWith("http") ? "_blank" : undefined}
                rel={e.href.startsWith("http") ? "noreferrer" : undefined}
                style={style}
              >
                {inner}
              </a>
            ) : (
              <div key={e.label} className="contact-row reveal" style={style}>
                {inner}
              </div>
            );
          })}
        </div>

        {/* 留言反馈：名录之后，Supabase 存储 */}
        <div className="mt-14">
          <Feedback startIndex={2 + contact.entries.length} />
        </div>

        {/* 数字分身：反馈下方一道分割线，三框对话直接呈现 */}
        <div
          className="avchat-divider reveal"
          style={{ "--i": 4 + contact.entries.length } as CSSProperties}
          aria-hidden
        />
        <AvatarChat />
      </div>
    </>
  );
}
