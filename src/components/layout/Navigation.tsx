"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Brand = ({ size = "sm", onClick }: { size?: "sm" | "lg"; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-[10px] bg-transparent border-none cursor-pointer text-term-fg p-0 font-inherit"
  >
    <div
      className={cn(
        "bg-term-accent text-black flex items-center justify-center font-[800] font-display rounded-[3px]",
        size === "lg" ? "w-7 h-7 text-base" : "w-[22px] h-[22px] text-[13px]"
      )}
    >
      S
    </div>
    <span className={cn("font-[600] text-term-fg", size === "lg" ? "text-[15px]" : "text-[13px]")}>
      serkankorkut
    </span>
    <span className={cn("text-term-fg-faint", size === "lg" ? "text-[15px]" : "text-[13px]")}>
      .dev
    </span>
  </button>
);

export default function Navigation() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "tr">("en");
  const [current, setCurrent] = useState("home");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const onToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const onToggleLang = () => {
    setLang(lang === "en" ? "tr" : "en");
  };

  const items = [
    { id: "home", label: "home", cmd: "~" },
    { id: "projects", label: "projects", cmd: "projects/" },
    { id: "contact", label: "contact", cmd: "contact.sh" },
  ];

  const handleNav = (id: string) => {
    setCurrent(id);
  };

  if (!isMounted) return null;

  return (
    <header className="sticky top-0 z-[100] bg-term-bg border-b border-term-border font-mono text-[13px]">
      <div className="max-w-[1280px] mx-auto px-8 h-14 flex items-center gap-6">
        <Brand onClick={() => handleNav("home")} />

        <nav className="hidden md:flex gap-1 ml-6">
          {items.map((it) => {
            const active = current === it.id;
            return (
              <button
                key={it.id}
                onClick={() => handleNav(it.id)}
                className={cn(
                  "border-none px-3 py-1.5 rounded bg-transparent text-[13px] cursor-pointer flex items-center gap-1.5 transition-colors font-inherit",
                  active ? "bg-term-bg-inset text-term-fg" : "text-term-fg-muted hover:text-term-fg"
                )}
              >
                <span className={active ? "text-term-accent" : "text-term-fg-faint"}>./</span>
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-term-bg-inset text-[11px] text-term-fg-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)]" />
            @ MapaGlobal
          </div>

          <button
            onClick={onToggleLang}
            className="bg-transparent border border-term-border text-term-fg-muted px-2.5 py-1 rounded font-inherit text-[11px] cursor-pointer flex gap-1.5"
          >
            <span className={cn(lang === "en" ? "text-term-fg font-semibold" : "text-term-fg-faint font-normal")}>
              EN
            </span>
            <span className="text-term-fg-faint">/</span>
            <span className={cn(lang === "tr" ? "text-term-fg font-semibold" : "text-term-fg-faint font-normal")}>
              TR
            </span>
          </button>

          <button
            onClick={onToggleTheme}
            title="Toggle theme"
            className="w-[30px] h-[30px] bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center font-inherit"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden w-8 h-8 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-lg leading-none font-inherit"
                aria-label="Open menu"
              >
                ≡
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(86vw,320px)] p-0 bg-term-bg border-r border-term-border font-mono border-none shadow-[8px_0_32px_rgba(0,0,0,0.4)] flex flex-col [&>button]:hidden">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Access site pages and preferences</SheetDescription>
              
              <div className="h-[56px] px-[18px] flex items-center justify-between border-b border-term-border bg-term-bg-inset shrink-0">
                <Brand size="lg" onClick={() => handleNav("home")} />
                <SheetClose asChild>
                  <button className="w-[30px] h-[30px] bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-sm font-inherit">
                    ✕
                  </button>
                </SheetClose>
              </div>

              <div className="px-[18px] pt-5 pb-2 text-[10px] text-term-fg-faint tracking-[0.18em] shrink-0">
                {"// navigation"}
              </div>

              <nav className="px-3 flex flex-col gap-0.5 shrink-0">
                {items.map((it) => {
                  const active = current === it.id;
                  return (
                    <SheetClose asChild key={it.id}>
                      <button
                        onClick={() => handleNav(it.id)}
                        className={cn(
                          "bg-transparent border-none py-[14px] px-[14px] rounded text-[15px] cursor-pointer flex items-center gap-3 text-left transition-colors font-inherit",
                          active ? "bg-term-bg-inset text-term-fg border-l-2 border-l-term-accent" : "text-term-fg-muted border-l-2 border-l-transparent hover:bg-term-bg-inset"
                        )}
                      >
                        <span className={cn("text-[13px]", active ? "text-term-accent" : "text-term-fg-faint")}>./</span>
                        <span className="flex-1">{it.label}</span>
                        <span className="text-term-fg-faint text-[11px]">{it.cmd}</span>
                      </button>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="flex-1" />

              <div className="px-[18px] py-[14px] border-t border-term-border text-[11px] text-term-fg-muted flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)]" />
                @ MapaGlobal
              </div>

              <div className="px-[18px] py-[14px] border-t border-term-border bg-term-bg-inset flex items-center gap-2.5 shrink-0">
                <div className="text-[10px] text-term-fg-faint tracking-[0.15em] shrink-0">
                  {"// prefs"}
                </div>

                <div className="flex-1" />

                <button
                  onClick={onToggleLang}
                  className="bg-transparent border border-term-border text-term-fg-muted px-3 py-1.5 rounded font-inherit text-[11px] cursor-pointer flex gap-1.5"
                >
                  <span className={cn(lang === "en" ? "text-term-fg font-semibold" : "text-term-fg-faint font-normal")}>
                    EN
                  </span>
                  <span className="text-term-fg-faint">/</span>
                  <span className={cn(lang === "tr" ? "text-term-fg font-semibold" : "text-term-fg-faint font-normal")}>
                    TR
                  </span>
                </button>

                <button
                  onClick={onToggleTheme}
                  title="Toggle theme"
                  className="w-8 h-8 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-sm font-inherit"
                >
                  {theme === "dark" ? "☀" : "☾"}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
