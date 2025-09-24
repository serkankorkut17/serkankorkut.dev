"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import Main from "@/components/Navigation/Email/Main";
import {
    HiMail,
    HiUser,
    HiClock,
    HiCog,
    HiUserCircle,
    HiServer,
    HiShieldCheck,
} from "react-icons/hi";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function ProfilePage() {
    interface MailSetting {
        type?: string;
        email?: string;
        name?: string;
        host?: string;
        port?: number | string;
        secure?: boolean;
    }

    interface User {
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        createdAt?: string | number;
        updatedAt?: string | number;
        mailSetting?: MailSetting | null;
    }

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams() as { username?: string };
    const router = useRouter();
    const username = params.username;

    // Fetch user profile data based on username from URL
    useEffect(() => {
        let mounted = true;

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/${encodeURIComponent(username ?? "")}`);
                if (!response.ok) {
                    throw new Error("User not found");
                }
                const userData = (await response.json()) as User;
                if (mounted) setUser(userData ?? null);
            } catch (err) {
                if (mounted) setError((err as Error)?.message ?? String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        } else {
            setLoading(false);
            setUser(null);
        }

        return () => {
            mounted = false;
        };
    }, [username]);

    // Loading state until user data is fetched
    if (loading) {
        return <LoadingOverlay text="Loading profile..." />;
    }

    // Error state if user profile is not found
    if (error) {
        return (
            <AuthGuard>
                <Main className="py-0 px-0">
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md">
                            <HiUser className="text-6xl text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Profile Not Found
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                The user profile you&apos;re looking for doesn&apos;t
                                exist.
                            </p>
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="bg-orange-500 hover:bg-orange-600 border-0"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </Main>
            </AuthGuard>
        );
    }

    if (!user) {
        return (
            <AuthGuard>
                <Main className="py-0 px-0">
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md">
                            <HiUser className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No Profile Data
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                No user data is available for this profile.
                            </p>
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="bg-orange-500 hover:bg-orange-600 border-0"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </Main>
            </AuthGuard>
        );
    }

    // Function to get mail provider icon based on type
    const getMailProviderIcon = (type?: string) => {
        switch (type) {
            case "gmail":
                return "📧";
            case "outlook":
                return "📮";
            case "yahoo":
                return "💌";
            case "smtp":
            case "custom":
                return "🔧";
            default:
                return "📧";
        }
    };

    // Function to get mail provider name based on type
    const getMailProviderName = (type?: string) => {
        switch (type) {
            case "gmail":
                return "Gmail";
            case "outlook":
                return "Outlook";
            case "yahoo":
                return "Yahoo Mail";
            case "smtp":
                return "SMTP";
            case "custom":
                return "Custom SMTP";
            default:
                return type?.toUpperCase() || "Not Set";
        }
    };

    return (
        <AuthGuard>
            <Main className="py-0 px-0">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 dark:from-orange-700 dark:via-pink-800 dark:to-purple-900 rounded-b-3xl shadow-lg mb-12">
                    <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-white text-lg font-extrabold uppercase tracking-widest drop-shadow">
                                .: Profile
                            </p>
                            <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-white drop-shadow">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.username}
                            </h1>
                            <p className="mt-4 text-white/90 max-w-xl">
                                View profile information and mail settings for
                                this user account.
                            </p>
                        </div>
                        <div className="w-40 md:w-56 flex items-center justify-center">
                            <HiUserCircle className="text-white text-8xl md:text-9xl drop-shadow-xl" />
                        </div>
                    </div>
                </div>

                {/* Profile Information Cards */}
                <div className="px-4 xl:px-0 max-w-5xl mx-auto space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center mb-6">
                            <HiUser className="text-3xl text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Personal Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Username
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            @{user.username ?? "-"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Email Address
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        {user.email ?? "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        First Name
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        {user.firstName || "Not provided"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Last Name
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        {user.lastName || "Not provided"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-green-900">
                        <div className="flex items-center mb-6">
                            <HiClock className="text-3xl text-green-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Account Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Account Created
                                </label>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "-"}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Last Updated
                                </label>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.updatedAt
                                        ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mail Settings */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-orange-100 dark:border-orange-900">
                        <div className="flex items-center mb-6">
                            <HiCog className="text-3xl text-orange-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Mail Configuration
                            </h2>
                        </div>

                        {user.mailSetting ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Mail Provider
                                        </label>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center">
                                            <span className="text-2xl mr-2">
                                                {getMailProviderIcon(
                                                    user.mailSetting?.type
                                                )}
                                            </span>
                                            {getMailProviderName(
                                                user.mailSetting?.type
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Mail Account
                                        </label>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            {user.mailSetting?.email ?? "-"}
                                        </div>
                                    </div>
                                </div>

                                {user.mailSetting?.name && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Sender Name
                                        </label>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            {user.mailSetting?.name}
                                        </div>
                                    </div>
                                )}

                                {(user.mailSetting?.type === "smtp" ||
                                    user.mailSetting?.type === "custom") && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <div className="flex items-center mb-4">
                                            <HiServer className="text-2xl text-purple-500 mr-2" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                SMTP Configuration
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Host
                                                </label>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                    {user.mailSetting?.host || "Not set"}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Port
                                                </label>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                    {user.mailSetting?.port ?? "Not set"}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Security
                                                </label>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded flex items-center">
                                                    <HiShieldCheck
                                                        className={`mr-1 ${
                                                            user.mailSetting?.secure
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }`}
                                                    />
                                                    {user.mailSetting?.secure
                                                        ? "Secure (TLS/SSL)"
                                                        : "Not Secure"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <HiMail className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    No Mail Configuration
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500">
                                    This user hasn&apos;t configured their mail
                                    settings yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-10 justify-center pb-12">
                    <Button
                        onClick={() => router.push("/")}
                        className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        onClick={() => router.push("/settings")}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Edit Mail Settings
                    </Button>
                </div>
            </Main>
        </AuthGuard>
    );
}
