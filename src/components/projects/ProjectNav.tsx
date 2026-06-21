"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Project, Locale } from "@/lib/projects";

interface ProjectNavProps {
  prev: Project | null;
  next: Project | null;
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale() as Locale;

  return (
    <nav className="mt-14 pt-6 border-t border-dashed border-term-border grid grid-cols-2 gap-4">
      <div>
        {prev && (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-1 no-underline text-term-fg"
          >
            <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
              ← {t("previous")}
            </span>
            <span className="text-[14px] font-[600] text-term-fg-muted group-hover:text-term-accent transition-colors motion-reduce:transition-none">
              {prev.title[locale]}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col gap-1 no-underline text-term-fg items-end"
          >
            <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
              {t("next")} →
            </span>
            <span className="text-[14px] font-[600] text-term-fg-muted group-hover:text-term-accent transition-colors motion-reduce:transition-none">
              {next.title[locale]}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
