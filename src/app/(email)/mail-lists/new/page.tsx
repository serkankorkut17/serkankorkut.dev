"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Textarea, Alert } from "flowbite-react";
import {
    FaPlus,
    FaUsers,
    FaEnvelope,
    FaTimes,
    FaCheck,
    FaExclamationTriangle,
    FaInfoCircle,
} from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function NewMailListPage() {
    const [listName, setListName] = useState("");
    const [emails, setEmails] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailCount, setEmailCount] = useState(0);
    const router = useRouter();

    // Validate email format using a simple regex
    const validateEmails = (emailsArr: { name: string; email: string }[]) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailsArr.every((e) => emailRegex.test(e.email));
    };

    // Parse email input text into structured objects
    const parseEmails = (emailText: string) => {
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

    // Handle email input changes and update email count
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

    // Handle form submission to create a new mail list
    const handleSave = async () => {
        setError("");
        setLoading(true);

        try {
            const emailsArr = parseEmails(emails);

            if (!listName.trim()) {
                setError("List name cannot be empty.");
                setLoading(false);
                return;
            }

            if (emailsArr.length === 0) {
                setError("Please add at least one email address.");
                setLoading(false);
                return;
            }

            if (!validateEmails(emailsArr)) {
                setError(
                    "One or more email addresses are invalid. Please check the format."
                );
                setLoading(false);
                return;
            }

            const response = await fetch("/api/mail-lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listName, emails: emailsArr }),
            });

            if (response.ok) {
                router.push("/mail-lists");
            } else {
                setError("Failed to create mail list. Please try again.");
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("An error occurred while creating the mail list.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                {/* Header */}
                <PageHeader
                    icon={FaPlus}
                    label="Create Mail List"
                    title="New Mail List"
                    subtitle="Create a new email list to organize your recipients."
                    actionLink="/mail-lists"
                    actionLabel="View Mail Lists"
                    actionIcon={FaUsers}
                />

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
                        handleSave();
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
                            identify this list later.
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
                            placeholder={`john@example.com
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
                        <Button
                            onClick={() => router.push("/mail-lists")}
                            color="gray"
                            className="order-2 sm:order-1 dark:hover:bg-gray-500 transition-all duration-200"
                            size="lg"
                            type="button"
                        >
                            <FaTimes className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleSave}
                            disabled={
                                loading || !listName.trim() || !emails.trim()
                            }
                            className="order-1 sm:order-2 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                            size="lg"
                            type="submit"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="w-4 h-4 mr-2" />
                                    Create Mail List
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
                        {/* Preview Emails */}
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
