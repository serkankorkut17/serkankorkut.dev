"use client";

import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    // Check visibility on initial load
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`
        fixed right-5 bottom-5 z-[90]
        w-11 h-11 rounded-lg
        bg-term-bg-inset border border-term-border
        text-term-fg-muted
        cursor-pointer font-mono
        flex items-center justify-center
        shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
        hover:text-term-accent hover:border-term-accent
        transition-all duration-250 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-3 scale-90 pointer-events-none'}
      `}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        aria-hidden="true"
      >
        <path d="M8 13 V3" />
        <path d="M3.5 7.5 L8 3 L12.5 7.5" />
      </svg>
    </button>
  );
}
