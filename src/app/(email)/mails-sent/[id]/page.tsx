"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    FaEnvelope,
    FaUser,
    FaCheck,
    FaTimes,
    FaEye,
    FaClock,
    FaPaperclip,
} from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function MailSentDetailPage() {
    const params = useParams() as { id?: string };
    const id = params?.id;
    interface Receiver {
        name?: string;
        email?: string;
        status?: string;
        sentAt?: string | number;
        openedAt?: string | number;
    }
    interface Mail {
        _id?: string;
        subject?: string;
        createdAt?: string | number;
        body?: string;
        attachments?: Array<string> | Array<{ filename?: string }>;
        receivers?: Receiver[];
    }

    const [mail, setMail] = useState<Mail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // router not used in this view

    // Fetch mail details by ID from the API
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchMail = async () => {
            try {
                const res = await fetch(`/api/mails-sent?id=${encodeURIComponent(id)}`);
                if (!res.ok) throw new Error("Failed to fetch mail");
                const data = (await res.json()) as Mail;
                setMail(data ?? null);
            } catch (err) {
                console.error(err);
                setMail(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMail();
    }, [id]);

    // Function to get status icon based on status value
    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "sent":
                return <FaCheck className="w-4 h-4" />;
            case "failed":
                return <FaTimes className="w-4 h-4" />;
            case "opened":
                return <FaEye className="w-4 h-4" />;
            case "sending":
                return <FaClock className="w-4 h-4" />;
            default:
                return <FaClock className="w-4 h-4" />;
        }
    };

    // Function to get status color based on status value
    const getStatusColor = (status?: string) => {
        switch (status) {
            case "sent":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "failed":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "opened":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "sending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    // Function to get status text based on status value
    const getStatusText = (status?: string) => {
        switch (status) {
            case "sent":
                return "Sent";
            case "failed":
                return "Failed";
            case "opened":
                return "Opened";
            case "sending":
                return "Sending";
            default:
                return status;
        }
    };

    // If loading, show a loading overlay
    if (loading) {
        return <LoadingOverlay text="Loading mail details..." />;
    }

    // If no mail found, show a not found message
    if (!mail) {
        return (
            <Main className="py-4 px-4 sm:py-8 sm:px-8">
                <div className="text-center text-gray-500 mt-8">
                    <FaEnvelope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Mail not found.</p>
                </div>
            </Main>
        );
    }

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaEnvelope}
                    label="Mail Details"
                    title={mail.subject ?? "Mail Details"}
                    subtitle={
                        `Created: ${mail.createdAt ? new Date(mail.createdAt).toLocaleString() : "-"}`
                    }
                    actionLink="/mails-sent"
                    actionLabel="Back"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Mail Content */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaEnvelope className="w-5 h-5" />
                                    Mail Content
                                </h2>
                            </div>
                            <div className="p-6">
                                <div
                                    className="prose prose-sm sm:prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                                    dangerouslySetInnerHTML={{
                                        __html: mail.body ?? "",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        {(mail.attachments && mail.attachments.length > 0) && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <FaPaperclip className="w-5 h-5" />
                                        Attachments ({mail.attachments?.length ?? 0})
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(mail.attachments ?? []).map((item, i) => {
                                            const filename = typeof item === "string" ? item : ((item as { filename?: string })?.filename) || "attachment";
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <FaPaperclip className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                        {filename}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recipients Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-4">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaUser className="w-5 h-5" />
                                    Recipients ({mail.receivers?.length ?? 0})
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {(mail.receivers ?? []).map((receiver, i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                        {receiver.name ?? receiver.email ?? "-"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                                                        {receiver.email ?? "-"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(receiver.status)}`}>
                                                    {getStatusIcon(receiver.status)}
                                                    {getStatusText(receiver.status)}
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-1">
                                                {receiver.sentAt && (
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FaClock className="w-3 h-3" />
                                                        Sent: {new Date(receiver.sentAt).toLocaleString()}
                                                    </div>
                                                )}
                                                {receiver.openedAt && (
                                                    <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                        <FaEye className="w-3 h-3" />
                                                        Opened: {new Date(receiver.openedAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Statistics */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {(mail.receivers ?? []).filter((r) => r.status === "sent" || r.status === "opened").length}
                                            </div>
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                Sent
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {(mail.receivers ?? []).filter((r) => r.status === "opened").length}
                                            </div>
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                Opened
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Main>
        </AuthGuard>
    );
}
