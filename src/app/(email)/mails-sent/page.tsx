"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import PageHeader from "@/components/Helpers/PageHeader";
import { FaEye, FaEnvelopeOpenText } from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function MailsSentPage() {
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
        receivers?: Receiver[];
    }

    const [mails, setMails] = useState<Mail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    // Fetch sent mails from the API
    useEffect(() => {
        let mounted = true;

        const fetchMails = async () => {
            try {
                const res = await fetch("/api/mails-sent");
                if (!res.ok) throw new Error("Failed to fetch mails");
                const data = (await res.json()) as Mail[];
                if (mounted) setMails(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                if (mounted) setMails([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchMails();

        return () => {
            mounted = false;
        };
    }, []);

    // If loading, show a loading overlay
    if (loading) {
        return <LoadingOverlay text="Loading mails..." />;
    }

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaEnvelopeOpenText}
                    label="Mails Sent"
                    title="Sent Mails"
                    subtitle="View all sent emails and their details."
                    actionLink="/"
                    actionLabel="Go back"
                />
                {/* Table for sent mails */}
                {mails.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm">
                                <tr>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        Subject
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        Receivers
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 text-center dark:border-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mails.map((mail, idx) => (
                                    <tr
                                        key={mail._id ?? `mail-${idx}`}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 truncate max-w-lg">
                                            {mail.subject ?? "(No subject)"}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 text-ellipsis overflow-hidden">
                                            {(mail.receivers ?? [])
                                                .map((r) => r.email ?? "")
                                                .filter(Boolean)
                                                .join(", ") || "-"}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {mail.createdAt ? new Date(mail.createdAt).toLocaleString() : "-"}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 text-center flex gap-2 justify-center">
                                            <Button
                                                color="primary"
                                                onClick={() =>
                                                    router.push(
                                                        `/mails-sent/${mail._id}`
                                                    )
                                                }
                                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-300 mt-8">
                        No sent mails found.
                    </div>
                )}
            </Main>
        </AuthGuard>
    );
}
