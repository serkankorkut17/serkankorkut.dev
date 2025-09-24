"use client";

import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import Main from "@/components/Navigation/Email/Main";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";
import MyToast from "@/components/Helpers/MyToast";
import { FaCog } from "react-icons/fa";

// Mail service types for selection
const MAIL_TYPES = [
    { value: "gmail", label: "Gmail" },
    { value: "outlook", label: "Outlook" },
    { value: "yahoo", label: "Yahoo" },
    { value: "smtp", label: "SMTP" },
    { value: "custom", label: "Custom" },
];

// Default form values for mail settings
type MailSettingForm = {
    type: string;
    email: string;
    password: string;
    host: string;
    port: string | number;
    secure: boolean;
    name: string;
};

const DEFAULT_FORM: MailSettingForm = {
    type: "gmail",
    email: "",
    password: "",
    host: "",
    port: "",
    secure: true,
    name: "",
};

export default function SettingsPage(): React.ReactElement {
    const [form, setForm] = useState<MailSettingForm>({ ...DEFAULT_FORM });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    // Fetch existing mail settings on component mount
    useEffect(() => {
        let mounted = true;
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/settings");
                const data = await res.json().catch(() => ({}));
                if (!mounted) return;
                if (data.mailSetting) setForm({ ...DEFAULT_FORM, ...data.mailSetting });
                else setForm({ ...DEFAULT_FORM });
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSettings();

        return () => {
            mounted = false;
        };
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const name = target.name;
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: target.checked }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }
        const value = target.value;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Save mail settings to the server
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setErrors({});
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mailSetting: form }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || data.message || "Save failed");
            setMessage(data.message || "Settings saved.");
        } catch (err) {
            const error = err as Error;
            setErrors({ general: error.message });
            setMessage(error.message);
        }
        setLoading(false);
    };

    // Reset to default mail settings
    const handleReset = async () => {
        setLoading(true);
        setForm({ ...DEFAULT_FORM });
        setMessage("");
        setErrors({});
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mailSetting: null }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || data.message || "Reset failed");
            setMessage("Settings reset to default (system mail will be used).");
        } catch (err) {
            const error = err as Error;
            setErrors({ general: error.message });
            setMessage(error.message);
        }
        setLoading(false);
    };

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaCog}
                    label="Settings"
                    title="Mail Account Settings"
                    subtitle="Configure your mail sending account."
                />
                {/* Toast Notifications */}
                {message && (
                    <MyToast
                        type={Object.keys(errors).length ? "error" : "success"}
                        message={message}
                        onClose={() => setMessage("")}
                    />
                )}
                {/* Settings Form */}
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <Label
                            htmlFor="type"
                            className="mb-1 text-sm font-medium"
                        >
                            Mail Service
                        </Label>
                        <Select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full rounded-lg [&>select]:bg-gray-100 dark:[&>select]:bg-gray-800 [&>select]:text-gray-900 dark:[&>select]:text-gray-100"
                        >
                            {MAIL_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label
                            htmlFor="email"
                            className="mb-1 text-sm font-medium"
                        >
                            Email Address
                        </Label>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            color={errors.email ? "failure" : "gray"}
                            placeholder="Enter your email"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                            required
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label
                            htmlFor="password"
                            className="mb-1 text-sm font-medium"
                        >
                            Password / App Password
                        </Label>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            color={errors.password ? "failure" : "gray"}
                            placeholder="Enter your mail password"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                            required
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    {(form.type === "smtp" || form.type === "custom") && (
                        <>
                            <div>
                                <Label
                                    htmlFor="host"
                                    className="mb-1 text-sm font-medium"
                                >
                                    SMTP Host
                                </Label>
                                <TextInput
                                    id="host"
                                    name="host"
                                    value={form.host}
                                    onChange={handleChange}
                                    color={errors.host ? "failure" : "gray"}
                                    placeholder="smtp.example.com"
                                    className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                                />
                                {errors.host && (
                                    <span className="text-red-500 text-sm">
                                        {errors.host}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="port"
                                    className="mb-1 text-sm font-medium"
                                >
                                    SMTP Port
                                </Label>
                                <TextInput
                                    id="port"
                                    name="port"
                                    type="number"
                                    value={form.port}
                                    onChange={handleChange}
                                    color={errors.port ? "failure" : "gray"}
                                    placeholder="465"
                                    className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                                />
                                {errors.port && (
                                    <span className="text-red-500 text-sm">
                                        {errors.port}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="secure"
                                    name="secure"
                                    type="checkbox"
                                    checked={!!form.secure}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="secure"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                                >
                                    Use SSL/TLS
                                </label>
                            </div>
                        </>
                    )}
                    <div>
                        <Label
                            htmlFor="name"
                            className="mb-1 text-sm font-medium"
                        >
                            Sender Name (optional)
                        </Label>
                        <TextInput
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            color={errors.name ? "failure" : "gray"}
                            placeholder="Your name"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name}
                            </span>
                        )}
                    </div>
                    {/* Form Actions */}
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            color="primary"
                            // isProcessing={loading}
                            disabled={loading}
                            className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner size="sm" />
                                    Saving...
                                </div>
                            ) : (
                                "Save Settings"
                            )}
                        </Button>
                        <Button
                            type="button"
                            color="gray"
                            onClick={handleReset}
                            disabled={loading}
                            className="w-full py-2 rounded-lg"
                        >
                            Reset to Default
                        </Button>
                    </div>
                </form>
            </Main>
        </AuthGuard>
    );
}
