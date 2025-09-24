"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "flowbite-react";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";

export default function TemplatesPage(): React.ReactElement {
    interface Template {
        _id?: string;
        name?: string;
        [key: string]: unknown;
    }

    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
    const router = useRouter();

    // Fetch templates from the API
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch("/api/templates");
                const data = await res.json();
                if (!mounted) return;
                setTemplates(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load templates:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    // deleteTemplate was removed in favor of `handleDelete` which handles UI state

    // Handle delete confirmation
    const handleDelete = async (id?: string) => {
        if (!id) return;
        setDeleting(true);
        try {
            await fetch(`/api/templates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
            setTemplates((prev) => prev.filter((template) => template._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setTemplateToDelete(null);
        }
    };

    if (loading) {
        return <LoadingOverlay text="Templates loading..." />;
    }

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaEdit}
                    label="Templates"
                    title="Manage Templates"
                    subtitle="View, edit or delete your email templates."
                />

                <div className="flex flex-col xl:flex-row justify-between items-center">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="justify-start mb-6">
                                <Button
                                    color="primary"
                                    onClick={() =>
                                        router.push("/templates/new")
                                    }
                                    className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                                >
                                    New Template
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
                        {/* Templates Table */}
                        {templates.length > 0 ? (
                            <div className="overflow-x-auto mb-16">
                                <table className="table-auto w-full text-left text-sm text-gray-500 border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm">
                                        <tr>
                                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-700 w-3/4">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-700 w-1/4 text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                        {templates.map((template, idx) => (
                                            <tr key={template._id ?? idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4 border text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 truncate max-w-lg">
                                                    {template.name}
                                                </td>
                                                <td className="px-6 py-4 border border-gray-300 dark:border-gray-700 flex justify-center gap-2">
                                                    <button onClick={() => router.push(`/templates/edit/${template._id}`)} className="bg-blue-500 text-white p-2 rounded-sm hover:bg-blue-600 transition">
                                                        <FaEdit className="text-white" />
                                                    </button>
                                                    <button onClick={() => { setTemplateToDelete(template); setShowDeleteModal(true); }} className="bg-red-500 text-white p-2 rounded-sm hover:bg-red-600 transition">
                                                        <FaTrash className="text-white" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                                No templates found.
                            </div>
                        )}
                    </div>
                </div>
                {/* Delete Confirmation Modal */}
                <Modal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                >
                    <ModalHeader>Delete Template</ModalHeader>
                    <ModalBody>
                        <p className="text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete the template &quot;
                            <span className="font-semibold">
                                {templateToDelete?.name}
                            </span>
                            &quot;?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => setShowDeleteModal(false)}
                            className="bg-gray-200 dark:bg-white text-gray-800 dark:text-black hover:bg-gray-300 dark:hover:bg-gray-300 transition"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="failure"
                            onClick={() => handleDelete(templateToDelete?._id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Main>
        </AuthGuard>
    );
}
