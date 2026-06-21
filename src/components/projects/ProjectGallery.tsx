"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Lightbox from "./Lightbox";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const t = useTranslations("ProjectDetail");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">
        {t("screenshots")}
      </div>

      {/* Main image */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open image"
        className="relative w-full aspect-video rounded-md overflow-hidden border border-term-border bg-term-bg-inset cursor-pointer block group"
      >
        <Image
          src={images[active]}
          alt={`${title} — ${active + 1}`}
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-contain"
          priority
        />
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative shrink-0 w-[112px] aspect-video rounded overflow-hidden border bg-term-bg-inset cursor-pointer transition-colors motion-reduce:transition-none",
                i === active
                  ? "border-term-accent"
                  : "border-term-border hover:border-term-fg-muted"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          index={active}
          alt={title}
          onClose={() => setOpen(false)}
          onIndexChange={setActive}
        />
      )}
    </div>
  );
}
