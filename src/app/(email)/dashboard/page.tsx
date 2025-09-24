"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import Main from "@/components/Navigation/Email/Main";
import Logo from "@/images/logo/logo-dark.png";
import Image from "next/image";
import { HiMail, HiUserGroup, HiOutlineCheckCircle } from "react-icons/hi";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";

type Mail = {
    _id: string;
    subject: string;
    receivers?: { length: number; status?: string }[];
    createdAt: string;
};

type MailList = {
    _id: string;
    listName: string;
    emails?: string[];
};

type Stats = {
    totalSent: number;
    totalReceivers: number;
    totalOpened: number;
    totalLists: number;
    totalSubscribers: number;
    lastMails: Mail[];
    lastLists: MailList[];
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    

    useEffect(() => {
        Promise.all([
            fetch("/api/mails-sent").then((res) => res.json()),
            fetch("/api/mail-lists").then((res) => res.json()),
        ]).then(([mailsSent, mailLists]) => {
            // Hesaplamalar
            const totalSent = mailsSent.length;
            const totalReceivers = mailsSent.reduce(
                (acc: number, mail: { receivers?: { length: number }[] }) => acc + (mail.receivers?.length || 0),
                0
            );
            const totalOpened = mailsSent.reduce(
                (acc: number, mail: { receivers?: { status: string }[] }) =>
                    acc +
                    (mail.receivers?.filter((r) => r.status === "opened")
                        .length || 0),
                0
            );
            const totalLists = mailLists.length;
            const totalSubscribers = mailLists.reduce(
                (acc: number, list: { emails?: string[] }) => acc + (list.emails?.length || 0),
                0
            );

            setStats({
                totalSent,
                totalReceivers,
                totalOpened,
                totalLists,
                totalSubscribers,
                lastMails: mailsSent.slice(0, 5),
                lastLists: mailLists.slice(0, 5),
            });
            setLoading(false);
        }).catch((err) => {
            console.error("Error fetching dashboard stats:", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingOverlay text="Loading dashboard statistics..." />;
    }

    return (
        <AuthGuard>
            <Main className="py-0 px-0">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 dark:from-orange-700 dark:via-pink-800 dark:to-purple-900 rounded-b-3xl shadow-lg mb-12">
                    <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-white text-lg font-extrabold uppercase tracking-widest drop-shadow">
                                .: Dashboard
                            </p>
                            <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-white drop-shadow">
                                Welcome to Mail Dashboard
                            </h1>
                            <p className="mt-4 text-white/90 max-w-xl">
                                Manage your campaigns, track statistics, and
                                reach your audience with ease. Everything you
                                need for email marketing in one place!
                            </p>
                        </div>
                        <Image
                            src={Logo}
                            alt="Dashboard Illustration"
                            className="w-40 md:w-56 drop-shadow-xl hidden md:block"
                            width={224}
                            height={224}
                            priority={false}
                        />
                    </div>
                </div>

                {/* Shortcuts Buttons Section */}
                <div className="flex flex-wrap gap-4 mb-10 justify-center">
                    <Button
                        onClick={() => router.push("/send-mail")}
                        className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Send New Mail
                    </Button>
                    <Button
                        onClick={() => router.push("/settings")}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Settings
                    </Button>
                    <Button
                        onClick={() => router.push("/mails-sent")}
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Sent Mails
                    </Button>
                    <Button
                        onClick={() => router.push("/mail-lists")}
                        className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Mail Lists
                    </Button>
                    <Button
                        onClick={() => router.push("/templates")}
                        className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-600 border-0 shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Templates
                    </Button>
                </div>

                {/* Statistics Section */}
                <div className="px-4 xl:px-0 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900">
                        <HiMail className="text-4xl text-orange-500 mb-2" />
                        <div className="text-3xl font-extrabold text-orange-500">
                            {stats?.totalSent ?? 0}
                        </div>
                        <div className="text-gray-700 dark:text-gray-200 font-medium mt-1">
                            Total Sent Mails
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-green-100 dark:border-green-900">
                        <HiOutlineCheckCircle className="text-4xl text-green-500 mb-2" />
                        <div className="text-3xl font-extrabold text-green-600">
                            {stats?.totalOpened ?? 0} / {stats?.totalReceivers ?? 0}
                        </div>
                        <div className="text-gray-700 dark:text-gray-200 font-medium mt-1">
                            Total Opens / Receivers
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900">
                        <HiUserGroup className="text-4xl text-blue-500 mb-2" />
                        <div className="text-3xl font-extrabold text-blue-600">
                            {stats?.totalLists ?? 0}
                        </div>
                        <div className="text-gray-700 dark:text-gray-200 font-medium mt-1">
                            Mail Lists
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                            {stats?.totalSubscribers ?? 0} subscribers
                        </div>
                    </div>
                </div>

                {/* Last sent mails */}
                <div className="px-4 xl:px-0 mb-10 max-w-5xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        Last Sent Mails
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg bg-white dark:bg-gray-900">
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
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.lastMails?.map((mail) => (
                                    <tr
                                        key={mail._id}
                                        className="hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 truncate max-w-lg">
                                            {mail.subject}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {mail.receivers?.length}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {new Date(
                                                mail.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Last added mail lists */}
                <div className="px-4 xl:px-0 max-w-5xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        Last Mail Lists
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg bg-white dark:bg-gray-900">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm">
                                <tr>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        List Name
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        Subscribers
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.lastLists?.map((list) => (
                                    <tr
                                        key={list._id}
                                        className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {list.listName}
                                        </td>
                                        <td className="px-4 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {list.emails?.length}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Extra Motivational Section */}
                <div className="max-w-3xl mx-auto mt-12">
                    <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 dark:from-orange-700 dark:via-pink-800 dark:to-purple-900 rounded-xl p-6 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            🚀 Keep Growing!
                        </h3>
                        <p className="text-white/90">
                            Every email you send is a new opportunity. Keep
                            engaging your audience and watch your impact grow!
                        </p>
                    </div>
                </div>
            </Main>
        </AuthGuard>
    );
}