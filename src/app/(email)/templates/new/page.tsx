"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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
import { FaUpload, FaPlus, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import Main from "@/components/Navigation/Email/Main";
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
export default function NewTemplatePage(): React.ReactElement {
    type EditorData = { design: unknown; html?: string };
    type EmailEditorInstance = {
        editor: {
            loadDesign: (d: unknown) => void;
            exportHtml: (cb: (data: EditorData) => void) => void;
        };
    };

    const emailEditorRef = useRef<EmailEditorInstance | null>(null);
    const setEmailEditorRef = (node: unknown) => {
        if (node && typeof node === "object") {
            const obj = node as Record<string, unknown>;
            if (obj.editor) emailEditorRef.current = obj as unknown as EmailEditorInstance;
        }
    };

    // State for template name, loading state, and error handling
    const [name, setName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // Router for navigation
    const router = useRouter();
    // State for editor minimum height to adjust based on viewport
    const [editorMinHeight, setEditorMinHeight] = useState<number>(0);

    // Effect to set the editor height based on viewport size
    useEffect(() => {
        const updateHeight = () => {
            // window.innerHeight ➝ viewport height
            setEditorMinHeight(window.innerHeight - 70);
        };

        // When page loads, set initial height and add resize listener
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // AI Integration
    const [showAIModal, setShowAIModal] = useState<boolean>(false);
    const [aiPrompt, setAIPrompt] = useState<string>("");
    const [aiLoading, setAILoading] = useState<boolean>(false);

    const exportHtmlAsync = (): Promise<EditorData> =>
        new Promise<EditorData>((resolve, reject) => {
            const ref = emailEditorRef.current;
            if (!ref?.editor?.exportHtml) return reject(new Error("Editor not ready"));
            try {
                ref.editor.exportHtml((data) => resolve(data));
            } catch (e) {
                reject(e);
            }
        });

    const handleAIGenerate = async () => {
        setAILoading(true);
        try {
            const { design: currentDesign } = await exportHtmlAsync();
            const res = await fetch("/api/gemini-design", {
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
            const res = await fetch("/api/gemini-beautify-prompt", {
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

    // Function to save the template
    const saveTemplate = async () => {
        if (!name.trim()) {
            alert("Please enter a template name");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { design: exportedDesign, html } = await exportHtmlAsync();
            const response = await fetch("/api/templates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, design: JSON.stringify(exportedDesign), html }),
            });

            if (!response.ok) throw new Error("Failed to save template");
            router.push("/templates");
        } catch {
            setError("Failed to save template. Please try again.");
            alert("Failed to save template. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to import unlayer design from clipboard
    const importDesign = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = JSON.parse(text);
            emailEditorRef.current?.editor.loadDesign(parsed);
        } catch {
            alert("Invalid design data in clipboard!");
        }
    };

    // Function to import unlayer design from keyboard input
    const importFromKeyboard = () => {
        // Import design from keyboard
        const design = prompt("Paste your design JSON here:");
        if (design) {
            try {
                const parsedDesign = JSON.parse(design);
                emailEditorRef.current?.editor.loadDesign(parsedDesign);
            } catch {
                alert("Invalid design JSON format!");
            }
        }
    };

    return (
        <AuthGuard>
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader
                    icon={FaPlus}
                    label="Create Template"
                    title="Create Your Template"
                    subtitle="Design a new email template for your campaigns."
                />

                {/* Error Alert */}
                {error && (
                    <Alert
                        color="failure"
                        className="mb-4"
                        onDismiss={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
                {/* Template Name and Buttons */}
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full mb-4">
                        <TextInput id="template-name" type="text" placeholder="Template Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required={true} disabled={isLoading} className="rounded-lg w-full md:w-auto flex-1" />
                    <div className="flex flex-row w-full md:w-auto md:flex-row gap-4">
                        <Button
                            color="primary"
                            onClick={() => setShowAIModal(true)}
                            className="w-1/2 md:w-auto bg-gradient-to-r from-indigo-500 to-orange-500 text-white py-2 rounded-lg transition flex items-center justify-center hover:from-indigo-600 hover:to-orange-600"
                        >
                            Edit Template with AI
                        </Button>
                        <Button
                            color=""
                            onClick={() => router.push("/templates")}
                            className="w-1/2 md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 py-2 rounded-lg transition flex items-center justify-center"
                        >
                            <FaArrowLeft className="w-5 h-5 mr-2" />
                            Go back
                        </Button>
                    </div>
                </div>
                {/* Email Editor */}
                <div className="mb-6">
                    <EmailEditor ref={setEmailEditorRef} minHeight={editorMinHeight} options={{ version: "latest", appearance: { theme: "modern_light" }, projectId: 274194 }} />
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                    {/* Left Buttons */}
                    <div className="flex flex-col md:flex-col gap-4">
                        <Button
                            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition"
                            onClick={saveTemplate}
                            disabled={isLoading}
                        >
                            <FaSave className="mr-2" />
                            {isLoading ? (
                                <>
                                    <Spinner
                                        size="sm"
                                        light={true}
                                        className="mr-2"
                                    />
                                    Saving...
                                </>
                            ) : (
                                "Save Template"
                            )}
                        </Button>
                        <Button
                            className="py-2 px-4 rounded-lg transition"
                            color="gray"
                            onClick={() => router.push("/templates")}
                        >
                            <FaTimes className="mr-2" />
                            Cancel
                        </Button>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex flex-col md:flex-col gap-4 mb-16">
                        <Button
                            color="gray"
                            className="py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                            onClick={importDesign}
                        >
                            <FaUpload className="mr-2" />
                            Import Design from Clipboard
                        </Button>
                        <Button
                            onClick={importFromKeyboard}
                            color="gray"
                            className="py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                        >
                            <FaUpload className="mr-2" />
                            Import Design from Keyboard
                        </Button>
                    </div>
                </div>
                {/* AI Prompt Modal */}
                <Modal show={showAIModal} onClose={() => setShowAIModal(false)}>
                    <ModalHeader>Edit Template with AI</ModalHeader>
                    <ModalBody>
                        <Label htmlFor="ai-prompt" className="mb-2 block">
                            Describe what you want to see in your email
                            template:
                        </Label>
                        <Textarea
                            id="ai-prompt"
                            rows={4}
                            value={aiPrompt}
                            onChange={(e) => setAIPrompt(e.target.value)}
                            placeholder="e.g. A newsletter for a tech startup with a hero image and 3 feature sections"
                            disabled={aiLoading || beautifying}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex flex-col md:flex-row w-full gap-2 md:items-center">
                            <Button
                                color="gray"
                                onClick={handleBeautifyPrompt}
                                disabled={beautifying || !aiPrompt.trim()}
                                className="w-full dark:hover:bg-gray-500 md:w-auto md:mr-auto"
                            >
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
                                <Button
                                    color="primary"
                                    onClick={handleAIGenerate}
                                    disabled={aiLoading || !aiPrompt.trim()}
                                    className="bg-orange-500 hover:bg-orange-600 w-1/2 md:w-auto"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Spinner
                                                size="sm"
                                                className="mr-2"
                                            />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate"
                                    )}
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => setShowAIModal(false)}
                                    disabled={aiLoading || beautifying}
                                    className="w-1/2 dark:hover:bg-gray-500 md:w-auto"
                                >
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
