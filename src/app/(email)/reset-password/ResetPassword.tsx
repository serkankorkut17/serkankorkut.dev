"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import MyToast from "@/components/Helpers/MyToast";
import Main from "@/components/Navigation/Email/Main";
import PageHeader from "@/components/Helpers/PageHeader";
import { FaLock } from "react-icons/fa";
import LoggedInGuard from "@/components/Helpers/LoggedInGuard";

type Errors = Record<string, string>;

export default function ResetPassword(): React.ReactElement {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token: string | null = searchParams?.get("token") ?? null;

    // Check if token is present in the URL
    useEffect(() => {
        if (!token) {
            setMessage(
                "Invalid or missing token. Please check your password reset link."
            );
        }
    }, [token]);

    // Submit handler for the reset password form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setErrors({});

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error((errorData && (errorData.error || errorData.message)) || "Password reset failed.");
            }

            setMessage(
                "Your password has been updated successfully. Redirecting to login page..."
            );
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            const error = err as Error;
            setErrors({ general: error.message });
            setMessage(error.message);
        }
        setLoading(false);
    };

    return (
        <LoggedInGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaLock}
                    label="Reset Password"
                    title="Set your new password"
                    subtitle="Fill out the form below to set your new password."
                    actionLink="/login"
                    actionLabel="Back to login page"
                />
                {/* Toast Notifications */}
                {message && (
                    <MyToast
                        type={Object.keys(errors).length ? "error" : "success"}
                        message={message}
                        onClose={() => setMessage("")}
                    />
                )}
                {/* Reset Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="password" className="mb-1 text-sm font-medium">
                            New Password
                        </Label>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            color={errors.password ? "failure" : "gray"}
                            placeholder="Enter your new password"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                        />
                        {errors.general && (
                            <span className="text-red-500 text-sm">{errors.general}</span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword" className="mb-1 text-sm font-medium">
                            Confirm Password
                        </Label>
                        <TextInput
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            color={errors.confirmPassword ? "failure" : "gray"}
                            placeholder="Re-enter your password"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                        )}
                    </div>
                    <div>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={loading || !token}
                            className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner size="sm" />
                                    Updating...
                                </div>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </form>
            </Main>
        </LoggedInGuard>
    );
}
