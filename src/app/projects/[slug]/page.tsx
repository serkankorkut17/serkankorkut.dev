import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getAllProjects,
  getProjectBySlug,
  getAdjacent,
  type Locale,
} from "@/lib/projects";
import ProjectMeta from "@/components/projects/ProjectMeta";
import ProjectGallery from "@/components/projects/ProjectGallery";
import ProjectNav from "@/components/projects/ProjectNav";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const locale = (await getLocale()) as Locale;
  return {
    title: project.title[locale],
    description: project.description[locale],
    openGraph: {
      title: project.title[locale],
      description: project.description[locale],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("ProjectDetail");
  const { prev, next } = getAdjacent(slug);

  return (
    <section className="bg-term-bg text-term-fg font-mono py-16 md:py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[12px] text-term-fg-muted hover:text-term-accent transition-colors motion-reduce:transition-none no-underline mb-10"
        >
          ← {t("backToProjects")}
        </Link>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-term-accent text-[14px] font-[700]">
            {project.n}
          </span>
          <h1 className="font-display text-[36px] md:text-[56px] leading-[1.05] font-[800] tracking-[-0.03em] m-0 text-term-fg">
            {project.title[locale]}
          </h1>
        </div>

        <ProjectMeta project={project} />
        <ProjectGallery images={project.images} title={project.title[locale]} />

        <p className="m-0 text-[15px] leading-[1.75] text-term-fg-muted max-w-[760px]">
          {project.description[locale]}
        </p>

        <ProjectNav prev={prev} next={next} />
      </div>
    </section>
  );
}
