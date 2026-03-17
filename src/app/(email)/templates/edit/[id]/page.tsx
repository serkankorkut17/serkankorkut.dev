"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import {
    Button,
    TextInput,
    Spinner,
    Alert,
    Textarea,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from "flowbite-react";
import {
    FaDownload,
    FaUpload,
    FaSave,
    FaTimes,
    FaArrowLeft,
} from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";

// Dynamically import the EmailEditor component to avoid SSR issues
const EmailEditor = dynamic(() => import("react-email-editor"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[300px]">
            <Spinner size="lg" />
            <p className="ml-4 text-lg">Loading Editor...</p>
        </div>
    ),
});
export default function EditTemplatePage(): React.ReactElement {
    type EditorData = { design: unknown; html?: string };

    type EmailEditorInstance = {
        editor: {
            loadDesign: (d: unknown) => void;
            exportHtml: (cb: (data: EditorData) => void) => void;
        };
    };

    const emailEditorRef = useRef<EmailEditorInstance | null>(null);
    // callback ref to receive the editor instance from the dynamic component
    const setEmailEditorRef = (node: unknown) => {
        // try to assign when the node has the expected shape
        if (node && typeof node === "object") {
            const obj = node as Record<string, unknown>;
            if (obj.editor) {
                emailEditorRef.current = obj as unknown as EmailEditorInstance;
            }
        }
    };
    const [name, setName] = useState<string>("");
    const [design, setDesign] = useState<Record<string, unknown>>({});
    const [unlayerLoaded, setUnlayerLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    // Set the minimum height of the editor based on viewport height
    const [editorMinHeight, setEditorMinHeight] = useState<number>(0);
    useEffect(() => {
        const updateHeight = () => setEditorMinHeight(window.innerHeight - 70);
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // Helper to wrap the editor exportHtml callback into a Promise
    const exportHtmlAsync = (): Promise<EditorData> => {
        return new Promise<EditorData>((resolve, reject) => {
            const ref = emailEditorRef.current;
            if (!ref?.editor?.exportHtml) return reject(new Error("Editor not ready"));
            try {
                ref.editor.exportHtml((data) => resolve(data));
            } catch (_error) {
                reject(_error);
            }
        });
    };

    // Fetch template data when component mounts
    useEffect(() => {
        let mounted = true;
        const loadTemplate = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/templates?id=${id}`);
                const template = await res.json();
                if (!mounted) return;
                setName(template?.name ?? "");
                const parsed = template?.design ? JSON.parse(template.design) : {};
                setDesign(parsed);
                // load design into editor if it's already ready
                if (unlayerLoaded && emailEditorRef.current?.editor?.loadDesign) {
                    emailEditorRef.current.editor.loadDesign(parsed);
                }
            } catch (err) {
                console.error("Failed to load template:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadTemplate();
        return () => {
            mounted = false;
        };
    }, [id, unlayerLoaded]);

    // AI Integration
    const [showAIModal, setShowAIModal] = useState<boolean>(false);
    const [aiPrompt, setAIPrompt] = useState<string>("");
    const [aiLoading, setAILoading] = useState<boolean>(false);

    const handleAIGenerate = async () => {
        setAILoading(true);
        try {
            const { design: currentDesign } = await exportHtmlAsync();
            const res = await fetch("/api/gemini/design", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt, design: currentDesign }),
            });
            const result = await res.json();
            if (result?.design) {
                emailEditorRef.current?.editor.loadDesign(result.design);
                setShowAIModal(false);
                setAIPrompt("");
            } else {
                alert("AI could not generate a design.");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert("AI error: " + msg);
        } finally {
            setAILoading(false);
        }
    };

    // AI Prompt Beautification
    const [beautifying, setBeautifying] = useState<boolean>(false);
    const handleBeautifyPrompt = async () => {
        if (!aiPrompt.trim()) return;
        setBeautifying(true);
        try {
            const res = await fetch("/api/gemini/beautify-prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            const data = await res.json();
            if (data?.prompt) setAIPrompt(data.prompt);
            else alert("Could not beautify prompt.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert("Beautify error: " + msg);
        } finally {
            setBeautifying(false);
        }
    };

    // Function to update the template
    const updateTemplate = async () => {
        try {
            const { design: exportedDesign, html } = await exportHtmlAsync();
            await fetch("/api/templates", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, update: { name, design: JSON.stringify(exportedDesign), html } }),
            });
            router.push("/templates");
        } catch (_err: unknown) {
            console.error("Failed to update template:", _err);
            alert("Failed to update template.");
        }
    };

    // Function to export design to clipboard
    const exportDesign = async () => {
        try {
            const { design: exportedDesign } = await exportHtmlAsync();
            const json = JSON.stringify(exportedDesign);
            await navigator.clipboard.writeText(json);
            alert("Design copied to clipboard!");
        } catch (_err: unknown) {
            console.error("Could not copy text: ", _err);
            alert("Could not copy design to clipboard.");
        }
    };

    // Function to import design from clipboard
    const importDesign = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = JSON.parse(text);
            emailEditorRef.current?.editor.loadDesign(parsed);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err: unknown) {
            alert("Invalid design data in clipboard!");
        }
    };

    // Handle editor load event
    const handleEditorLoad = () => {
        setUnlayerLoaded(true);
        // if we already have a design, load it
        if (emailEditorRef.current?.editor?.loadDesign && design && Object.keys(design).length) {
            emailEditorRef.current.editor.loadDesign(design);
        }
    };

    // If still loading, show a loading overlay
    if (loading) return <LoadingOverlay text="Loading Template Editor..." />;

    // If no design is loaded, show an error message
    if (!design || Object.keys(design).length === 0) {
        return (
            <Alert color="failure" className="mt-4">
                <span>
                    <span className="font-medium">Error!</span> No design found for this template.
                </span>
            </Alert>
        );
    }

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader icon={FaEdit} label="Edit Template" title="Update Your Template" subtitle="Edit your email template and save your changes." />
                {/* Template Name and AI Button */}
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full mb-4">
                    <TextInput id="template-name" type="text" placeholder="Template Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required={true} className="rounded-lg w-full md:w-auto flex-1" />
                    <div className="flex flex-row w-full md:w-auto md:flex-row gap-4">
                        <Button color="primary" onClick={() => setShowAIModal(true)} className="w-1/2 md:w-auto bg-gradient-to-r from-indigo-500 to-orange-500 text-white py-2 rounded-lg transition flex items-center justify-center hover:from-indigo-600 hover:to-orange-600">Edit Template with AI</Button>
                        <Button color="primary" onClick={() => router.push("/templates")} className="w-1/2 md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 py-2 rounded-lg transition flex items-center justify-center">
                            <FaArrowLeft className="w-5 h-5 mr-2" />
                            Go back
                        </Button>
                    </div>
                </div>

                {/* Email Editor */}
                <div className="mb-6 h-[calc(100vh-70px)] overflow-y-auto">
                    <EmailEditor ref={setEmailEditorRef} onLoad={handleEditorLoad} minHeight={editorMinHeight} options={{ version: "latest", appearance: { theme: "modern_light" }, projectId: 274194 }} />
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                    <div className="flex flex-col md:flex-col gap-4">
                        {/* Update Template Button */}
                        <Button color="primary" className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 rounded-lg transition" onClick={updateTemplate}>
                            <FaSave className="mr-2" />
                            Update Template
                        </Button>

                        {/* Cancel Button */}
                        <Button className="py-2 rounded-lg transition" color="gray" onClick={() => router.push("/templates")}>
                            <FaTimes className="mr-2" />
                            Cancel
                        </Button>
                    </div>

                    {/* Copy Design ve Import Design Buttons */}
                    <div className="flex flex-col md:flex-col gap-4 mb-16">
                        <Button color="primary" onClick={exportDesign} className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                            <FaDownload className="mr-2" />
                            Copy Design to Clipboard
                        </Button>
                        <Button color="gray" className="py-2 rounded-lg hover:bg-gray-600 transition" onClick={importDesign}>
                            <FaUpload className="mr-2" />
                            Import Design from Clipboard
                        </Button>
                    </div>
                </div>
                {/* AI Prompt Modal */}
                <Modal show={showAIModal} onClose={() => setShowAIModal(false)}>
                    <ModalHeader>Edit Template with AI</ModalHeader>
                    <ModalBody>
                        <Label htmlFor="ai-prompt" className="mb-2 block">Describe what you want to see in your email template:</Label>
                        <Textarea id="ai-prompt" rows={4} value={aiPrompt} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAIPrompt(e.target.value)} placeholder="e.g. A newsletter for a tech startup with a hero image and 3 feature sections" disabled={aiLoading || beautifying} />
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex flex-col md:flex-row w-full gap-2 md:items-center">
                            <Button color="gray" onClick={handleBeautifyPrompt} disabled={beautifying || !aiPrompt.trim()} className="w-full dark:hover:bg-gray-500 md:w-auto md:mr-auto">
                                {beautifying ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Beautifying...
                                    </>
                                ) : (
                                    "Beautify Prompt"
                                )}
                            </Button>
                            <div className="flex flex-row gap-2 w-full md:w-auto md:ml-auto">
                                <Button color="primary" onClick={handleAIGenerate} disabled={aiLoading || !aiPrompt.trim()} className="bg-orange-500 hover:bg-orange-600 w-1/2 md:w-auto">
                                    {aiLoading ? (
                                        <>
                                            <Spinner size="sm" className="mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate"
                                    )}
                                </Button>
                                <Button color="gray" onClick={() => setShowAIModal(false)} disabled={aiLoading || beautifying} className="w-1/2 dark:hover:bg-gray-500 md:w-auto">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </Main>
        </AuthGuard>
    );
}
