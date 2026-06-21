"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  getAllProjects,
  getProjectBySlug,
  type Locale,
} from "@/lib/projects";
import { useTheme } from "@/hooks/useTheme";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "available commands:",
  "  help               show this help",
  "  ls                 list projects",
  "  cat about          about me",
  "  whoami             quick bio",
  "  open <slug>        open a project",
  "  contact            go to the contact page",
  "  theme dark|light   switch theme",
  "  lang en|tr         switch language",
  "  clear              clear the screen",
].join("\n");

const WELCOME = `${SITE_NAME} — interactive shell. type 'help' to start.`;

export default function Terminal() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { theme, toggle } = useTheme();

  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: WELCOME }]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const listProjects = () =>
    getAllProjects()
      .map((p) => `  ${p.n}  ${p.slug.padEnd(22)} ${p.title[locale]}`)
      .join("\n");

  const about = `${SITE_NAME} — ${SITE_TAGLINE} @ MapaGlobal.\nJava / Spring Boot, MSSQL, Oracle; payments (FAST, BKM, EFT, SWIFT).\ntype 'ls' to see projects, 'contact' to reach out.`;

  // Returns the output line to append (text "" appends nothing).
  const run = (raw: string): { text: string; kind: Line["kind"] } => {
    const cmd = raw.trim();
    if (!cmd) return { text: "", kind: "out" };
    const [name, ...args] = cmd.split(/\s+/);

    switch (name) {
      case "help":
        return { text: HELP, kind: "out" };
      case "ls":
      case "projects":
        return { text: listProjects(), kind: "out" };
      case "cat":
        return args[0] === "about"
          ? { text: about, kind: "out" }
          : { text: `cat: ${args[0] ?? ""}: no such file`, kind: "err" };
      case "whoami":
        return { text: `${SITE_NAME} — ${SITE_TAGLINE} @ MapaGlobal`, kind: "out" };
      case "open": {
        const slug = args[0] ?? "";
        if (!getProjectBySlug(slug))
          return { text: `open: ${slug}: project not found (try 'ls')`, kind: "err" };
        router.push(`/projects/${slug}`);
        return { text: `opening ${slug}…`, kind: "out" };
      }
      case "contact":
        router.push("/contact");
        return { text: "opening contact…", kind: "out" };
      case "theme": {
        const target = args[0];
        if (target !== "dark" && target !== "light")
          return { text: "usage: theme dark|light", kind: "err" };
        if (theme !== target) toggle();
        return { text: `theme → ${target}`, kind: "out" };
      }
      case "lang": {
        const target = args[0];
        if (target !== "en" && target !== "tr")
          return { text: "usage: lang en|tr", kind: "err" };
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000`;
        router.refresh();
        return { text: `lang → ${target}`, kind: "out" };
      }
      default:
        return { text: `command not found: ${name} (type 'help')`, kind: "err" };
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    if (value.trim() === "clear") {
      setLines([]);
      return;
    }
    const result = run(value);
    setLines((prev) => [
      ...prev,
      { kind: "in", text: value },
      ...(result.text ? [{ kind: result.kind, text: result.text }] : []),
    ]);
  };

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">
          {"// try_me.sh"}
        </div>
        <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 mb-8 leading-none text-term-fg">
          Talk to the shell
        </h2>

        <div
          onClick={() => inputRef.current?.focus()}
          className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)] cursor-text"
        >
          {/* window chrome */}
          <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2">
            <div className="flex gap-[6px]">
              <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
              <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
              <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-auto text-[11px] text-term-fg-faint">
              visitor@serkankorkut.dev
            </div>
          </div>

          {/* body */}
          <div
            ref={bodyRef}
            className="p-5 h-[360px] overflow-y-auto text-[13px] leading-[1.7]"
          >
            {lines.map((l, i) => {
              if (l.kind === "in") {
                return (
                  <div key={i} className="flex gap-2">
                    <span className="text-term-accent shrink-0">$</span>
                    <span className="text-term-fg break-all">{l.text}</span>
                  </div>
                );
              }
              return (
                <pre
                  key={i}
                  className={
                    "m-0 whitespace-pre-wrap break-words font-mono " +
                    (l.kind === "err" ? "text-[#ff5f57]" : "text-term-fg-muted")
                  }
                >
                  {l.text}
                </pre>
              );
            })}

            {/* prompt */}
            <form onSubmit={onSubmit} className="flex gap-2 mt-1">
              <span className="text-term-accent shrink-0">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Terminal input"
                className="flex-1 bg-transparent border-none outline-none text-term-fg font-mono text-[13px] p-0"
                placeholder="type 'help'"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
