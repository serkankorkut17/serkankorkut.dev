"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FadeImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fill image that fades in once loaded. Remount it via a `key` (e.g. the src)
 * so each new image starts hidden and fades — no setState-in-effect needed.
 */
export default function FadeImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
      className={cn(
        "object-contain transition-opacity duration-300 motion-reduce:transition-none",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
}
