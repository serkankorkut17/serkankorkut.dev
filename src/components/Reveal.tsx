"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export default function Reveal({ children, className }: RevealProps) {
  const { ref, shown } = useReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "w-full transition-all duration-700 ease-out motion-reduce:transition-none",
        shown
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}
