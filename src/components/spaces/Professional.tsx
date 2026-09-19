"use client";

// Professional 空间：职业想法时间线、经历、项目、工具。
// 清晰、直接、有结构——像一份放在桌面上的索引。
// 与其他空间同源：蓝调夜色墙、微弱晕染、逐行 reveal。
// 内容是主角，UI 只负责安静的排列。

import type { CSSProperties } from "react";
import { professionalSpace } from "@/data/content";
import { profile } from "@/data/profile";

const KIND_LABEL: Record<string, string> = {
  interest: "兴趣",
  idea: "想法",
  learning: "学习",
  milestone: "节点",
};

export function Professional({ onBack }: { onBack: () => void }) {
  const { ambient, experiences, projects, skills, timeline } = professionalSpace;

  // reveal 索引计数器
  let ri = 0;
  const next = () => ({ "--i": ++ri } as CSSProperties);

  return (
    <>
      {/* 房间层：冷蓝灰单块晕染，克制——信息是主角 */}
      <div className="room-layer" aria-hidden>
        <span className="room-ceiling" />
        <span className="haze-professional" />
      </div>

      <div className="room-content shell-text relative mx-auto w-full">
        {/* 返回 */}
        <button
          type="button"
          onClick={onBack}
          className="space-back reveal"
          style={next()}
          aria-label="返回上一级"
        >
          <span className="space-back__arrow" aria-hidden>←</span>
          <span>返回</span>
        </button>

        {/* 空间标题 */}
        <h1
          className="reveal mt-16 font-serif text-2xl text-ember"
          style={next()}
        >
          {profile.name}
        </h1>
        <p
          className="reveal mt-1 text-sm text-ember-faint"
          style={next()}
        >
          Professional
        </p>
        {/* 索引导航 */}
        <nav
          className="reveal mt-6 professional-index"
          style={next()}
          aria-label="内容索引"
        >
          <span
            className="professional-index__item"
            onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
          >时间线</span>
          <span className="professional-index__sep">·</span>
          <span
            className="professional-index__item"
            onClick={() => document.getElementById("experiences")?.scrollIntoView({ behavior: "smooth" })}
          >经历</span>
          <span className="professional-index__sep">·</span>
          <span
            className="professional-index__item"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >项目</span>
          <span className="professional-index__sep">·</span>
          <span
            className="professional-index__item"
            onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
          >工具</span>
        </nav>

        {/* —— 职业想法时间线 —— */}
        <section id="timeline" className="mt-16">
          <h2
            className="reveal professional-section-title"
            style={next()}
          >
            时间线
          </h2>
          <div className="professional-timeline">
            {timeline.map((entry, i) => (
              <div
                key={i}
                className="reveal professional-timeline__entry"
                style={next()}
                data-kind={entry.kind}
              >
                <div className="professional-timeline__marker">
                  <span className="professional-timeline__dot" />
                  {i < timeline.length - 1 && (
                    <span className="professional-timeline__line" />
                  )}
                </div>
                <div className="professional-timeline__body">
                  <div className="professional-timeline__head">
                    <span className="professional-timeline__year">{entry.year}</span>
                    <span className="professional-timeline__kind">
                      {KIND_LABEL[entry.kind]}
                    </span>
                  </div>
                  <p className="professional-timeline__title">{entry.title}</p>
                  <p className="professional-timeline__detail">{entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* —— 经历 —— */}
        <section id="experiences" className="mt-16">
          <h2
            className="reveal professional-section-title"
            style={next()}
          >
            经历
          </h2>
          <div className="professional-list">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="reveal professional-entry"
                style={next()}
              >
                <div className="professional-entry__head">
                  <span className="professional-entry__role">{exp.role}</span>
                  <span className="professional-entry__org">{exp.org}</span>
                  <span className="professional-entry__period">{exp.period}</span>
                </div>
                <p className="professional-entry__summary">{exp.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* —— 项目 —— */}
        <section id="projects" className="mt-16">
          <h2
            className="reveal professional-section-title"
            style={next()}
          >
            项目
          </h2>
          <div className="professional-list">
            {projects.map((proj, i) => (
              <div
                key={i}
                className="reveal professional-entry"
                style={next()}
              >
                <div className="professional-entry__head">
                  <span className="professional-entry__name">{proj.name}</span>
                  <span className="professional-entry__period">{proj.period}</span>
                </div>
                <p className="professional-entry__role-sub">
                  {proj.role}
                </p>
                <p className="professional-entry__summary">{proj.summary}</p>
                <div className="professional-stack">
                  {proj.stack.map((tech) => (
                    <span key={tech} className="professional-stack__tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* —— 工具 —— */}
        <section id="skills" className="mt-16 mb-32">
          <h2
            className="reveal professional-section-title"
            style={next()}
          >
            工具
          </h2>
          <div
            className="reveal professional-skills"
            style={next()}
          >
            {skills.map((skill) => (
              <span key={skill} className="professional-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
