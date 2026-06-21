"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getAllProjects, type Locale } from "@/lib/projects";
import { useTheme } from "@/hooks/useTheme";

interface Action {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { theme, toggle } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  };

  // Global ⌘K / Ctrl+K toggle, plus a custom event so other UI can open it.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk-open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const actions = useMemo<Action[]>(() => {
    const nav: Action[] = [
      { id: "home", label: "Home", hint: "go", run: () => router.push("/") },
      { id: "projects", label: "Projects", hint: "go", run: () => router.push("/projects") },
      { id: "contact", label: "Contact", hint: "go", run: () => router.push("/contact") },
    ];
    const projects: Action[] = getAllProjects().map((p) => ({
      id: `p-${p.slug}`,
      label: p.title[locale],
      hint: "project",
      run: () => router.push(`/projects/${p.slug}`),
    }));
    const prefs: Action[] = [
      {
        id: "theme",
        label: `Switch theme → ${theme === "dark" ? "light" : "dark"}`,
        hint: "pref",
        run: toggle,
      },
      {
        id: "lang",
        label: `Switch language → ${locale === "en" ? "Türkçe" : "English"}`,
        hint: "pref",
        run: () => {
          document.cookie = `NEXT_LOCALE=${locale === "en" ? "tr" : "en"}; path=/; max-age=31536000`;
          router.refresh();
        },
      },
    ];
    return [...nav, ...projects, ...prefs];
  }, [router, locale, theme, toggle]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  const runAt = (i: number) => {
    const action = filtered[i];
    if (!action) return;
    action.run();
    close();
  };

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(selected);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={close}
      className="fixed inset-0 z-[300] bg-black/60 flex items-start justify-center pt-[12vh] px-4 font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] bg-term-bg-elevated border border-term-border rounded-md overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-2 px-4 border-b border-term-border">
          <span className="text-term-accent text-[13px]">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKeyDown}
            spellCheck={false}
            aria-label="Search commands"
            placeholder="Jump to… (projects, theme, lang)"
            className="flex-1 bg-transparent border-none outline-none py-3.5 text-sm text-term-fg font-mono"
          />
          <kbd className="text-[10px] text-term-fg-faint border border-term-border rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>

        <ul className="list-none m-0 p-1.5 max-h-[320px] overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-3 py-3 text-[13px] text-term-fg-faint">no matches</li>
          )}
          {filtered.map((a, i) => (
            <li key={a.id}>
              <button
                onMouseEnter={() => setSelected(i)}
                onClick={() => runAt(i)}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded text-[13px] cursor-pointer border-none bg-transparent font-mono transition-colors motion-reduce:transition-none",
                  i === selected ? "bg-term-bg-inset text-term-fg" : "text-term-fg-muted"
                )}
              >
                <span className={i === selected ? "text-term-accent" : "text-term-fg-faint"}>
                  ›
                </span>
                <span className="flex-1">{a.label}</span>
                <span className="text-[10px] text-term-fg-faint tracking-[0.1em] uppercase">
                  {a.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
