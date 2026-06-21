"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getAllProjects, type Locale } from "@/lib/projects";

export default function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = getAllProjects();

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-12 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4">
              {t("tag")}
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">
              {t("title")}
            </h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">
            {t("sub")}
          </p>
        </div>

        {/* Index table */}
        <div className="border border-term-border rounded-md overflow-hidden bg-term-bg-elevated">
          <div className="hidden md:grid grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-3 border-b border-term-border bg-term-bg-inset text-[11px] text-term-fg-faint tracking-[0.1em]">
            <div>{t("col1")}</div>
            <div>{t("col2")}</div>
            <div>{t("col3")}</div>
            <div>{t("col4")}</div>
            <div className="text-right">{t("col5")}</div>
          </div>

          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className={cn(
                "group flex flex-col md:grid md:grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-5 items-start md:items-center gap-4 no-underline text-term-fg transition-colors hover:bg-term-bg-inset",
                i < projects.length - 1 ? "border-b border-term-border" : ""
              )}
            >
              <div className="flex w-full md:contents">
                <div className="text-term-accent text-[13px] font-[700] w-16 md:w-auto">
                  {p.n}
                </div>
                <div className="text-term-fg-muted text-[13px] w-20 md:w-auto">
                  {p.year}
                </div>
                <div className="flex-1 md:contents">
                  <div className="md:w-full">
                    <div className="text-[16px] font-[600] text-term-fg">
                      {p.title[locale]}
                    </div>
                    <div className="text-[12px] text-term-fg-faint mt-0.5">
                      {p.kind[locale]}
                    </div>
                  </div>
                </div>
                <div className="text-right text-term-accent text-[16px] ml-auto md:hidden transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                  →
                </div>
              </div>

              <div className="hidden md:flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="hidden md:block text-right text-term-accent text-[16px] transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
