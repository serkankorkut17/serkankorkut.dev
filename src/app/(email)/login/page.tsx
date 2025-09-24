"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import AuthContext, { type AuthUser } from "@/contexts/AuthContext";
import Main from "@/components/Navigation/Email/Main";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import MyToast from "@/components/Helpers/MyToast";
import LoggedInGuard from "@/components/Helpers/LoggedInGuard";
import { FaCheck } from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";

export default function Login() {
    interface FormValues {
        email: string;
        password: string;
        rememberMe: boolean;
    }
    type Errors = Partial<Record<keyof FormValues | "general", string>>;

    const [formData, setFormData] = useState<FormValues>({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const auth = useContext(AuthContext);
    if (!auth) {
        // Auth provider not mounted; render nothing or a fallback
        return null;
    }
    const { login } = auth;

    // Handle input changes for the login form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Submit handler for the login form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setErrors({});

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = (await response.json()) as { error?: string };
                throw new Error(errorData.error || "Login failed");
            }

            const data = (await response.json()) as { user: AuthUser };
            // Set user in context; AuthContext handles redirect
            login(data.user);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed";
            if (msg === "Invalid credentials") {
                setErrors({
                    email: "Invalid email or password",
                    password: "Invalid email or password",
                });
                setMessage("Invalid email or password");
            } else {
                setErrors({ email: msg });
                setMessage(msg);
            }
        }
        setLoading(false);
    };

    return (
        <LoggedInGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaCheck}
                    label="Login"
                    title="Sign in to your account"
                    subtitle="Access your dashboard and manage your mails."
                    actionLink="/"
                    actionLabel="Go back"
                />
                {/* Display any error or success messages */}
                {message && (
                    <MyToast
                        type={Object.keys(errors).length ? "error" : "success"}
                        message={message}
                        onClose={() => setMessage("")}
                    />
                )}
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="mb-1 text-sm font-medium">Email</Label>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            color={errors.email ? "failure" : "gray"}
                            placeholder="Enter your email"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="password" className="mb-1 text-sm font-medium">Password</Label>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            color={errors.password ? "failure" : "gray"}
                            placeholder="Enter your password"
                            className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-orange-500 dark:text-orange-400 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    {/* Registration Link */}
                    <div>
                        <Link
                            href="/signup"
                            className="text-sm font-medium text-orange-500 dark:text-orange-400 hover:underline"
                        >
                            Don&apos;t have an account? Register
                        </Link>
                    </div>
                    {/* Submit Button */}
                    <div>
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
                                    Loading...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                </form>
            </Main>
        </LoggedInGuard>
    );
}