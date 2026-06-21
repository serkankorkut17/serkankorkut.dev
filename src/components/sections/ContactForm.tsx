"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY = { name: "", email: "", message: "", company: "" };

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState(EMPTY);

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden flex flex-col h-full"
    >
      <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2 shrink-0">
        <div className="flex gap-[6px]">
          <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-auto text-[11px] text-term-fg-faint">{t("message")}</div>
      </div>

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Honeypot — hidden from users; bots that fill it are dropped server-side */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.company}
          onChange={update("company")}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <label className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
            <span className="text-term-accent">$</span> {t("nameLabel")}
          </span>
          <input
            required
            value={form.name}
            onChange={update("name")}
            disabled={sending}
            className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors disabled:opacity-60"
            placeholder={t("namePlaceholder")}
          />
        </label>

        <label className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
            <span className="text-term-accent">$</span> {t("emailLabel")}
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            disabled={sending}
            className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors disabled:opacity-60"
            placeholder={t("emailPlaceholder")}
          />
        </label>

        <label className="flex flex-col gap-1.5 flex-1">
          <span className="text-[11px] text-term-fg-faint tracking-[0.1em] shrink-0">
            <span className="text-term-accent">$</span> {t("messageLabel")}
          </span>
          <textarea
            required
            minLength={10}
            value={form.message}
            onChange={update("message")}
            disabled={sending}
            className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors resize-none flex-1 min-h-[100px] disabled:opacity-60"
            placeholder={t("messagePlaceholder")}
          />
        </label>

        {status === "success" && (
          <p className="m-0 text-[13px] text-term-accent">› {t("success")}</p>
        )}
        {status === "error" && (
          <p className="m-0 text-[13px] text-[#ff5f57]">› {t("error")}</p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-2 shrink-0 bg-term-accent text-black border-none py-[14px] px-5 font-mono text-[13px] font-[700] cursor-pointer rounded-[3px] flex items-center justify-between hover:opacity-90 transition-opacity motion-reduce:transition-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{sending ? t("sending") : t("sendBtn")}</span>
          <span>↵</span>
        </button>
      </div>
    </form>
  );
}
