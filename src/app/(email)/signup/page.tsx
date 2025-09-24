"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Label, Spinner } from "flowbite-react";
import { FaCheck } from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import Main from "@/components/Navigation/Email/Main";
import MyToast from "@/components/Helpers/MyToast";
import LoggedInGuard from "@/components/Helpers/LoggedInGuard";

type SignupForm = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type Errors = Record<string, string>;

export default function Signup(): React.ReactElement {
    const [formData, setFormData] = useState<SignupForm>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    // Handle input changes and reset error messages
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Submit handler for the signup form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setErrors({});

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || data.message || "Signup failed");
            }

            setMessage("Successfully registered! Redirecting to login page...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            const error = err as Error;
            setMessage(error.message);
            setErrors({ general: error.message });
        }
        setLoading(false);
    };

    return (
        <LoggedInGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaCheck}
                    label="Sign Up"
                    title="Create a new account"
                    subtitle="Fill in the details below to get started."
                    actionLink="/"
                    actionLabel="Go back"
                />
                {/* Toast Notifications */}
                {message && (
                    <MyToast type={Object.keys(errors).length ? "error" : "success"} message={message} onClose={() => setMessage("")} />
                )}
                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="firstName" className="mb-1 text-sm font-medium">
                            First Name
                        </Label>
                        <TextInput id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} color={errors.firstName ? "failure" : "gray"} placeholder="Enter your first name" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="lastName" className="mb-1 text-sm font-medium">Last Name</Label>
                        <TextInput id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} color={errors.lastName ? "failure" : "gray"} placeholder="Enter your last name" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="username" className="mb-1 text-sm font-medium">Username</Label>
                        <TextInput id="username" name="username" type="text" value={formData.username} onChange={handleChange} color={errors.username ? "failure" : "gray"} placeholder="Enter your username" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email" className="mb-1 text-sm font-medium">Email</Label>
                        <TextInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} color={errors.email ? "failure" : "gray"} placeholder="Enter your email" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password" className="mb-1 text-sm font-medium">Password</Label>
                        <TextInput id="password" name="password" type="password" value={formData.password} onChange={handleChange} color={errors.password ? "failure" : "gray"} placeholder="Enter your password" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword" className="mb-1 text-sm font-medium">Confirm Password</Label>
                        <TextInput id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} color={errors.confirmPassword ? "failure" : "gray"} placeholder="Re-enter your password" className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100" />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                    <div>
                        <Button type="submit" color="primary" disabled={loading} className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 mt-8">
                            {loading ? (<div className="flex items-center justify-center gap-2"><Spinner size="sm" />Loading...</div>) : ("Sign Up")}
                        </Button>
                    </div>
                </form>
            </Main>
        </LoggedInGuard>
    );
}
