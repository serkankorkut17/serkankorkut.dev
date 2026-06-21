"use client";

import { useEffect, useCallback, useRef, type TouchEvent } from "react";
import FadeImage from "./FadeImage";

interface LightboxProps {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function Lightbox({
  images,
  index,
  alt,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const next = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center font-mono outline-none"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-9 h-9 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-sm hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-4 text-[12px] text-term-fg-muted z-10">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          className="absolute left-3 md:left-6 w-10 h-10 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-lg hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
        >
          ←
        </button>
      )}

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-[90vw] h-[82vh]"
      >
        <FadeImage
          key={images[index]}
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          sizes="90vw"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          className="absolute right-3 md:right-6 w-10 h-10 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-lg hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
        >
          →
        </button>
      )}
    </div>
  );
}
