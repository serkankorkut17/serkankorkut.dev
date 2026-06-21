"use client";

import { useTranslations, useLocale } from "next-intl";
import type { Project, Locale } from "@/lib/projects";

interface ProjectMetaProps {
  project: Project;
}

export default function ProjectMeta({ project }: ProjectMetaProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-col gap-5 mb-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-term-fg-muted">
        <span className="text-term-fg-faint">{project.year}</span>
        <span className="text-term-fg-faint">/</span>
        <span>{project.kind[locale]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-term-accent text-black border-none px-[18px] py-[11px] font-mono text-[13px] font-[700] rounded-[3px] flex items-center gap-2 hover:opacity-90 transition-opacity motion-reduce:transition-none no-underline"
        >
          {t("viewSource")} <span className="opacity-70">→</span>
        </a>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-term-fg border border-term-border px-[18px] py-[11px] font-mono text-[13px] rounded-[3px] flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors motion-reduce:transition-none no-underline"
          >
            {t("liveDemo")} <span>↗</span>
          </a>
        ) : (
          <span className="px-[18px] py-[11px] font-mono text-[13px] text-term-fg-faint border border-dashed border-term-border rounded-[3px]">
            {t("noLive")}
          </span>
        )}
      </div>
    </div>
  );
}
