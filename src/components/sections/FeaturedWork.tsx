"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getFeaturedProjects, type Locale } from "@/lib/projects";

export default function FeaturedWork() {
  const t = useTranslations("FeaturedWork");
  const locale = useLocale() as Locale;
  const featured = getFeaturedProjects(3);

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">
              {t("tag")}
            </div>
            <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 leading-none text-term-fg">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/projects"
            className="bg-transparent border border-term-border text-term-fg px-4 py-2.5 font-mono text-xs rounded flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors motion-reduce:transition-none w-fit no-underline"
          >
            <span>{t("viewAll")}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group font-mono bg-term-bg-elevated border border-term-border rounded-md overflow-hidden flex flex-col text-term-fg hover:border-term-accent transition-colors motion-reduce:transition-none no-underline"
            >
              <div className="relative w-full aspect-video bg-term-bg-inset border-b border-term-border overflow-hidden">
                <Image
                  src={p.images[0]}
                  alt={p.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-baseline text-[11px] text-term-fg-faint tracking-[0.15em]">
                  <span className="text-term-accent font-[700]">{p.n}</span>
                  <span>{p.year}</span>
                </div>
                <div className="font-display text-[20px] font-[700] tracking-[-0.01em] text-term-fg leading-[1.15]">
                  {p.title[locale]}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-term-border text-[11px] text-term-fg-muted mt-auto">
                  <span>{p.stack.join(" · ")}</span>
                  <span className="text-term-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
