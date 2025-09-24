"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from "flowbite-react";
import { FaTrash, FaEye, FaArrowLeft, FaListUl } from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function MailListsPage() {
    interface MailListItem {
        _id: string;
        id?: string;
        listName: string;
        emails?: { email: string }[];
    }

    const [lists, setLists] = useState<MailListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [listToDelete, setListToDelete] = useState<MailListItem | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const res = await fetch("/api/mail-lists");
                if (!res.ok) throw new Error("Failed to fetch mail lists");
                const data = (await res.json()) as MailListItem[];
                setLists(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setLists([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLists();
    }, []);

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/mail-lists", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(txt || "Failed to delete mail list");
            }
            setLists((prev) => prev.filter((list) => (list._id || list.id) !== id));
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingOverlay text="Mail lists loading..." />;
    }

    return (
        <AuthGuard>
            <Main className="py-4 px-4 sm:py-8 sm:px-8">
                <PageHeader
                    icon={FaListUl}
                    label="Mail Lists"
                    title="Manage Mail Lists"
                    subtitle="View, create or delete your mail lists."
                />
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex justify-start mb-6">
                        <Button
                            color="primary"
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                            onClick={() => router.push("/mail-lists/new")}
                        >
                            New Mail List
                        </Button>
                    </div>
                    <div className="flex justify-end mb-6">
                        <Button
                            color="primary"
                            onClick={() => router.push("/")}
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700
                                dark:hover:bg-gray-300 py-2 rounded-lg transition flex items-center"
                        >
                            <FaArrowLeft className="w-5 h-5 mr-2" />
                            Go back
                        </Button>
                    </div>
                </div>
                {/* Mail Lists Table */}
                {lists.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm">
                                <tr>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        List Name
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700">
                                        Emails Count
                                    </th>
                                    <th className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.map((list) => (
                                    <tr
                                        key={list._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-4 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 truncate max-w-lg">
                                            {list.listName}
                                        </td>
                                        <td className="px-4 py-4 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
                                            {(list.emails?.length) ?? 0}
                                        </td>
                                        <td className="px-4 py-4 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 text-center flex gap-2 justify-center">
                                            <Button
                                                color="primary"
                                                onClick={() =>
                                                    router.push(
                                                        `/mail-lists/${list._id}`
                                                    )
                                                }
                                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                color="failure"
                                                onClick={() => {
                                                    setListToDelete(list);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                            >
                                                <FaTrash className="text-white" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-300 mt-8">
                        No mail lists found.
                    </div>
                )}
                {/* Delete Mail List Modal */}
                <Modal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                >
                    <ModalHeader>Delete Mail List</ModalHeader>
                    <ModalBody>
                        <p className="text-gray-500">
                            Are you sure you want to delete the mail list &quot;
                            <span className="font-semibold">
                                {listToDelete?.listName}
                            </span>
                            &quot;?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="failure"
                            onClick={() => handleDelete(listToDelete?._id)}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button
                            color="gray"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </Main>
        </AuthGuard>
    );
}
