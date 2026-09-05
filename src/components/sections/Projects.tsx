// 项目：简单卡片，不喧宾夺主。

import { projects } from "@/data/projects";
import { Section } from "../ui/Section";

export function Projects() {
  return (
    <Section id="projects" index="06" zh="项目" en="Projects">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <a
            key={p.id}
            href={p.link ?? "#"}
            className="group block rounded-sm border border-rule p-5 transition-colors hover:border-ink/30"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-lg text-ink">{p.name}</h3>
              {p.status && <span className="text-xs text-ink-faint">{p.status}</span>}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}
