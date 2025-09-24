"use client";

import { useEffect, useState } from "react";
import Main from "@/components/Navigation/Email/Main";
import { Spinner } from "flowbite-react";
import DOMPurify from "isomorphic-dompurify";

// cleaned duplicate directives and imports

type ViewMode = "html" | "text";
interface Attachment {
    filename?: string;
    contentType?: string;
    size?: number;
}
interface MailItem {
    subject?: string;
    from?: string;
    date?: string | Date;
    text?: string;
    html?: string | false;
    hasHtml: boolean;
    attachments?: Attachment[];
}

export default function InboxPage() {
    const [mails, setMails] = useState<MailItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [selectedMail, setSelectedMail] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<Record<number, ViewMode>>({});
    const [page, setPage] = useState<number>(1);
    const limit = 20;

    useEffect(() => {
        setLoading(true);
        type InboxSuccess = { mails: MailItem[]; total: number };
        type InboxError = { error: string };
        type InboxResponse = InboxSuccess | InboxError;

        fetch(`/api/inbox?page=${page}&limit=${limit}`)
            .then((res) => res.json() as Promise<InboxResponse>)
            .then((data) => {
                if ("error" in data) {
                    setError(data.error);
                    return;
                }
                setMails(data.mails || []);
                setTotal(data.total || 0);
            })
            .catch(() => setError("Failed to fetch mails."))
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    const formatDate = (date: string | Date | undefined | null): string => {
        if (!date) return "";
        const mailDate = new Date(date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const mailDay = new Date(
            mailDate.getFullYear(),
            mailDate.getMonth(),
            mailDate.getDate()
        );

        if (mailDay.getTime() === today.getTime()) {
            return mailDate.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (mailDay.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
            return "Dün";
        } else {
            return mailDate.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
            });
        }
    };

    const getInitials = (email?: string): string => {
        if (!email) return "?";
        const name = email.split("<")[0].replace(/^["']+|["']+$/g, "").trim();
        if (name && name !== email) {
            return name
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0] || "")
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return email.replace(/^["']+|["']+$/g, "").trim()[0]?.toUpperCase() || "?";
    };

    const truncateText = (text: string | undefined, maxLength = 100): string => {
        if (!text) return "";
        const cleanText = text.replace(/<[^>]*>/g, "");
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substring(0, maxLength) + "...";
    };

    const sanitizeHtml = (html: string | false | undefined): string => {
        if (!html) return "";
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "em",
                "i",
                "u",
                "a",
                "ul",
                "ol",
                "li",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "blockquote",
                "div",
                "span",
                "img",
                "table",
                "tr",
                "td",
                "th",
                "thead",
                "tbody",
            ],
            ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "style"],
            ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|data:image\/)/i,
        });
    };

    const toggleViewMode = (mailIndex: number) => {
        setViewMode((prev) => ({
            ...prev,
            [mailIndex]: prev[mailIndex] === "html" ? "text" : "html",
        }));
    };

    const extractBody = (html: string): string => {
        if (!html) return "";
        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        return match ? match[1] : html;
    };

    const getCurrentContent = (mail: MailItem, mailIndex: number): string => {
        const mode = viewMode[mailIndex] || (mail.hasHtml ? "html" : "text");
        if (mode === "html" && mail.html) {
            const bodyContent = extractBody(mail.html);
            if (bodyContent.trim()) return bodyContent;
            return mail.text || "";
        }
        return mail.text || "";
    };

    const getCurrentMode = (mail: MailItem, mailIndex: number): ViewMode => {
        return viewMode[mailIndex] || (mail.hasHtml ? "html" : "text");
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <Spinner size="xl" />
            </div>
        );

    if (error)
        return (
            <Main>
                <div className="mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        Gelen Kutusu
                    </h1>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="text-red-600 dark:text-red-400 font-medium">
                            Hata: {error}
                        </div>
                    </div>
                </div>
            </Main>
        );

    return (
        <Main>
            {/* Ana kapsayıcıda overflow-x-auto'yu kaldırıp overflow-x-hidden ekledim */}
            <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6 overflow-x-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Gelen Kutusu
                    </h1>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {total} mail
                    </div>
                </div>

                {mails.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-600 text-5xl sm:text-6xl mb-4">
                            📧
                        </div>
                        <div className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                            Henüz mail bulunmuyor
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-2 w-full">
                        {mails.map((mail, i) => (
                            <div
                                key={i}
                                className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedMail === i
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                                        : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                } border border-gray-200 dark:border-gray-700 rounded-lg w-full overflow-hidden`}
                                onClick={() =>
                                    setSelectedMail(
                                        selectedMail === i ? null : i
                                    )
                                }
                            >
                                <div className="p-3 sm:p-4 w-full">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0 w-full">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 mb-2 sm:mb-0">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {getInitials(mail.from)}
                                            </div>
                                        </div>

                                        {/* Mail İçeriği */}
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1 min-w-0 w-full">
                                                <div className="flex flex-wrap items-center space-x-2 min-w-0 max-w-full">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate overflow-hidden whitespace-nowrap max-w-full sm:max-w-xs">
                                                        {mail.from
                                                            ? mail.from
                                                                  .replace(
                                                                      /<.*>/,
                                                                      ""
                                                                  )
                                                                  .trim()
                                                                  .replace(
                                                                      /^["']+|["']+$/g,
                                                                      ""
                                                                  ) ||
                                                              "Bilinmeyen Gönderici"
                                                            : "Bilinmeyen Gönderici"}
                                                    </div>
                                                    {mail.hasHtml && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            HTML
                                                        </span>
                                                    )}
                                                    {(mail.attachments?.length ?? 0) > 0 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            📎 {mail.attachments?.length ?? 0}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-0 sm:ml-2 truncate overflow-hidden whitespace-nowrap">
                                                    {formatDate(mail.date)}
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate overflow-hidden whitespace-nowrap max-w-full">
                                                {mail.subject || "Konu yok"}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-full">
                                                {truncateText(
                                                    getCurrentContent(mail, i)
                                                )}
                                            </div>
                                        </div>

                                        {/* Expand Icon */}
                                        <div className="flex-shrink-0 ml-auto">
                                            <div
                                                className={`transform transition-transform duration-200 text-gray-400 ${
                                                    selectedMail === i
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {selectedMail === i && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 w-full">
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="min-w-0 overflow-hidden">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Gönderen:
                                                        </span>
                                                        <div className="text-gray-600 dark:text-gray-400 break-all">
                                                            {mail.from}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 overflow-hidden">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Tarih:
                                                        </span>
                                                        <div className="text-gray-600 dark:text-gray-400">
                                                            {mail.date &&
                                                                new Date(
                                                                    mail.date
                                                                ).toLocaleString(
                                                                    "tr-TR"
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 overflow-hidden">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        Konu:
                                                    </span>
                                                    <div className="text-gray-900 dark:text-white font-medium mt-1 break-words">
                                                        {mail.subject ||
                                                            "Konu belirtilmemiş"}
                                                    </div>
                                                </div>

                                                {/* Attachments */}
                                                {(mail.attachments?.length ?? 0) > 0 && (
                                                    <div className="min-w-0 overflow-hidden">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Ekler:
                                                        </span>
                                                        <div className="mt-2 space-y-1">
                                                            {(mail.attachments ?? []).map(
                                                                (att, idx) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                                                                    >
                                                                        <span>
                                                                            📎
                                                                        </span>
                                                                        <span className="truncate overflow-hidden max-w-full">
                                                                            {
                                                                                att.filename
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs flex-shrink-0">
                                                                            (
                                                                            {att.size
                                                                                ? Math.round(
                                                                                      att.size /
                                                                                          1024
                                                                                  ) +
                                                                                  " KB"
                                                                                : "Bilinmeyen boyut"}
                                                                            )
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* View Mode Toggle */}
                                                {mail.hasHtml && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Görünüm:
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleViewMode(
                                                                    i
                                                                );
                                                            }}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                                                        >
                                                            {getCurrentMode(
                                                                mail,
                                                                i
                                                            ) === "html"
                                                                ? "🔤 Metin"
                                                                : "🎨 HTML"}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Content - Sadece bu kısımda overflow-x-auto var */}
                                                <div>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        İçerik:
                                                    </span>
                                                    <div className="mt-2 p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-96 overflow-y-auto text-xs sm:text-sm overflow-x-auto">
                                                        {getCurrentMode(
                                                            mail,
                                                            i
                                                        ) === "html" &&
                                                        mail.html ? (
                                                            <div
                                                                className="prose prose-sm max-w-full dark:prose-invert prose-img:max-w-full prose-img:h-auto break-words"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: sanitizeHtml(
                                                                        mail.html
                                                                    ),
                                                                }}
                                                                style={{
                                                                    wordBreak:
                                                                        "break-word",
                                                                    overflowWrap:
                                                                        "break-word",
                                                                    maxWidth:
                                                                        "100%",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words max-w-full">
                                                                {mail.text ||
                                                                    "İçerik bulunamadı"}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                    <button
                        className="w-full sm:w-auto px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Önceki
                    </button>
                    <span className="text-center py-1">
                        Sayfa {page} / {totalPages}
                    </span>
                    <button
                        className="w-full sm:w-auto px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        Sonraki
                    </button>
                </div>
            </div>
        </Main>
    );
}