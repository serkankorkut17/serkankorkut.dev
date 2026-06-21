"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

/**
 * Theme state synced with the `dark` class on <html>. The initial class is set
 * before paint by the inline script in the root layout (reads localStorage /
 * prefers-color-scheme), so there is no flash. `toggle` persists to localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore storage errors (private mode / quota)
      }
      return next;
    });
  }, []);

  return { theme, toggle, mounted };
}
