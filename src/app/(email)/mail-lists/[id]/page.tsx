"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Label, TextInput, Textarea, Alert } from "flowbite-react";
import {
    FaEdit,
    FaUsers,
    FaEnvelope,
    FaTimes,
    FaCheck,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTrash,
} from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function MailListDetailPage() {
    const router = useRouter();
    const params = useParams() as { id?: string };
    const id = params?.id;

    interface Recipient {
        name: string;
        email: string;
    }
    interface MailListData {
        listName: string;
        emails: Recipient[];
        emailsRaw: string;
    }

    const [listName, setListName] = useState<string>("");
    const [emails, setEmails] = useState<string>("");
    const [originalData, setOriginalData] = useState<MailListData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [emailCount, setEmailCount] = useState<number>(0);
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    // Fetch mail list data when component mounts
    useEffect(() => {
        if (!id) {
            setError("Invalid mail list id.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/mail-lists?id=${encodeURIComponent(id)}`);
                if (!res.ok) {
                    throw new Error("Failed to load mail list data.");
                }
                const data = (await res.json()) as MailListData;

                const emailsText = (data.emails || [])
                    .map((e) =>
                        e.name && e.name !== e.email
                            ? `${e.name} <${e.email}>`
                            : e.email
                    )
                    .join("\n");

                setListName(data.listName || "");
                setEmails(emailsText);
                setOriginalData({ listName: data.listName || "", emails: data.emails || [], emailsRaw: emailsText });
                setEmailCount((data.emails || []).length);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load mail list data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Check for changes in the form fields
    useEffect(() => {
        if (originalData) {
            setHasChanges(
                listName !== originalData.listName ||
                    emails !== originalData.emailsRaw
            );
        }
    }, [listName, emails, originalData]);

    // Validate email addresses in the list
    const validateEmails = (emailsArr: Recipient[]): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailsArr.every((e) => Boolean(e.email) && emailRegex.test(e.email));
    };

    // Parse email text into structured format
    const parseEmails = (emailText: string): Recipient[] => {
        const emailLines = emailText
            .split(/[\n,]+/)
            .map((line) => line.trim())
            .filter((line) => line);

        return emailLines.map((line) => {
            const match = line.match(/^(.*)<(.+@.+\..+)>$/);
            if (match) {
                return {
                    name: match[1].trim() || match[2].trim(),
                    email: match[2].trim(),
                };
            }
            return { name: line, email: line };
        });
    };

    // Handle email input change and update email count
    const handleEmailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setEmails(value);
        setError("");

        if (value.trim()) {
            const parsed = parseEmails(value);
            setEmailCount(parsed.length);
        } else {
            setEmailCount(0);
        }
    };

    // Handle update action - save changes to the mail list
    const handleUpdate = async (): Promise<void> => {
        setError("");
        setSaving(true);

        try {
            const emailsArr = parseEmails(emails);

            if (!listName.trim()) {
                setError("List name cannot be empty.");
                setSaving(false);
                return;
            }

            if (emailsArr.length === 0) {
                setError("Please add at least one email address.");
                setSaving(false);
                return;
            }

            if (!validateEmails(emailsArr)) {
                setError(
                    "One or more email addresses are invalid. Please check the format."
                );
                setSaving(false);
                return;
            }

            const response = await fetch("/api/mail-lists", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, listName, emails: emailsArr }),
            });

            if (response.ok) {
                router.push("/mail-lists");
            } else {
                const errText = await response.text();
                setError("Failed to update mail list. " + (errText || "Please try again."));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while updating the mail list.");
        } finally {
            setSaving(false);
        }
    };

    // Handle delete action and navigate back
    const handleDelete = async (): Promise<void> => {
        if (
            !confirm(
                "Are you sure you want to delete this mail list? This action cannot be undone."
            )
        ) {
            return;
        }

        setDeleting(true);
        try {
            const response = await fetch("/api/mail-lists", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                router.push("/mail-lists");
            } else {
                const errText = await response.text();
                setError("Failed to delete mail list. " + (errText || "Please try again."));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while deleting the mail list.");
        } finally {
            setDeleting(false);
        }
    };

    // Handle cancel action to navigate back
    const handleCancel = (): void => {
        if (hasChanges) {
            if (
                confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                )
            ) {
                router.push("/mail-lists");
            }
        } else {
            router.push("/mail-lists");
        }
    };

    // If loading, show a loading overlay
    if (loading) {
        return <LoadingOverlay text="Loading mail list..." />;
    }

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                {/* Header */}
                <PageHeader
                    icon={FaEdit}
                    label="Edit Mail List"
                    title={originalData?.listName || "Mail List"}
                    subtitle="Modify your email list settings and recipients"
                    actionLink="/mail-lists"
                    actionLabel="Back to Lists"
                />
                {hasChanges && (
                    <div className="mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                            You have unsaved changes
                        </span>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert
                        color="failure"
                        className="mb-6"
                        icon={FaExclamationTriangle}
                    >
                        <span className="font-medium">Error:</span> {error}
                    </Alert>
                )}

                {/* Form */}
                <form
                    className="space-y-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                >
                    {/* List Name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="listName"
                            className="text-lg font-semibold flex items-center gap-2"
                        >
                            <FaUsers className="w-4 h-4 text-orange-500" />
                            List Name
                        </Label>
                        <TextInput
                            id="listName"
                            type="text"
                            placeholder="Enter a descriptive name for your mail list"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            required
                            className="w-full"
                            sizing="lg"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Choose a clear, descriptive name that helps you
                            identify this list.
                        </p>
                    </div>

                    {/* Emails */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="emails"
                            className="text-lg font-semibold flex items-center gap-2"
                        >
                            <FaEnvelope className="w-4 h-4 text-orange-500" />
                            Email Addresses
                            {emailCount > 0 && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                                    {emailCount}{" "}
                                    {emailCount === 1 ? "email" : "emails"}
                                </span>
                            )}
                        </Label>
                        <Textarea
                            id="emails"
                            placeholder={`Add emails in any of these formats:

john@example.com
Jane Doe <jane@example.com>
support@company.com, admin@company.com
Mike Smith <mike@company.com>

You can separate emails with commas or new lines.`}
                            value={emails}
                            onChange={handleEmailsChange}
                            required
                            rows={8}
                            className="w-full font-mono text-sm"
                        />

                        {/* Email Format Help */}
                        <div className="flex items-start gap-2 mt-2">
                            <FaInfoCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    Supported formats:
                                </p>
                                <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-xs sm:text-sm">
                                    <li>
                                        <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                                            john@example.com
                                        </code>{" "}
                                        - Email only
                                    </li>
                                    <li>
                                        <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                                            John Doe &lt;john@example.com&gt;
                                        </code>{" "}
                                        - Name and email
                                    </li>
                                    <li>
                                        Separate multiple emails with commas or
                                        new lines
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-2 sm:order-1">
                            <Button
                                onClick={handleCancel}
                                color="gray"
                                className="hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                                size="lg"
                                type="button"
                            >
                                <FaTimes className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={deleting}
                                color="failure"
                                className="bg-red-600 hover:bg-red-700 transition-all duration-200"
                                size="lg"
                                type="button"
                            >
                                {deleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="w-4 h-4 mr-2" />
                                        Delete List
                                    </>
                                )}
                            </Button>
                        </div>
                        <Button
                            color="primary"
                            onClick={handleUpdate}
                            disabled={
                                saving ||
                                !hasChanges ||
                                !listName.trim() ||
                                !emails.trim()
                            }
                            className="order-1 sm:order-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                            size="lg"
                            type="submit"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="w-4 h-4 mr-2" />
                                    Update Mail List
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Preview Section */}
                {emailCount > 0 && (
                    <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FaUsers className="w-5 h-5" />
                                Preview ({emailCount}{" "}
                                {emailCount === 1 ? "recipient" : "recipients"})
                            </h3>
                        </div>
                        <div className="p-6 max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {parseEmails(emails)
                                    .slice(0, 10)
                                    .map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <FaEnvelope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                                                    {item.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {parseEmails(emails).length > 10 && (
                                    <div className="col-span-1 sm:col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                                        ... and{" "}
                                        {parseEmails(emails).length - 10} more
                                        recipients
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Main>
        </AuthGuard>
    );
}
