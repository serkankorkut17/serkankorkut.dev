import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-term-bg text-term-fg font-mono px-8 border-b border-term-border">
      <div className="max-w-[560px] w-full">
        <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">
          {"// 404"}
        </div>
        <h1 className="font-display text-[80px] md:text-[120px] font-[800] leading-none tracking-[-0.04em] m-0 text-term-fg">
          404
        </h1>
        <p className="mt-5 text-sm text-term-fg-muted">
          <span className="text-term-accent">$</span> cat {t("title").toLowerCase()}
        </p>
        <p className="mt-2 text-[13px] text-term-fg-faint leading-[1.7] max-w-[480px]">
          {t("longDescription")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="bg-term-accent text-black px-5 py-3 font-mono text-[13px] font-[700] rounded-[3px] no-underline flex items-center gap-2 hover:opacity-90 transition-opacity motion-reduce:transition-none"
          >
            {t("backToHome")} <span className="opacity-70">↵</span>
          </Link>
          <Link
            href="/contact"
            className="bg-transparent border border-term-border text-term-fg px-5 py-3 font-mono text-[13px] rounded-[3px] no-underline flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors motion-reduce:transition-none"
          >
            {t("contact")} <span className="text-term-fg-faint">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
