"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Select } from "flowbite-react";
import Main from "@/components/Navigation/Email/Main";
import PageHeader from "@/components/Helpers/PageHeader";
import { FaTimes, FaEnvelopeOpenText } from "react-icons/fa";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import AuthGuard from "@/components/Helpers/AuthGuard";
import MyToast from "@/components/Helpers/MyToast";

interface Template {
    _id?: string;
    name?: string;
    html?: string;
}

interface MailList {
    _id?: string;
    listName?: string;
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function SendMailPage(): React.ReactElement {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [mailLists, setMailLists] = useState<MailList[]>([]);
    const [subject, setSubject] = useState<string>("");
    const [templateId, setTemplateId] = useState<string>("");
    const [templateHtml, setTemplateHtml] = useState<string>("");
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [variableNames, setVariableNames] = useState<string[]>([]);
    const [mailListId, setMailListId] = useState<string>("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [toast, setToast] = useState<Toast>(null);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const [tRes, mRes] = await Promise.all([
                    fetch("/api/templates"),
                    fetch("/api/mail-lists"),
                ]);
                const tData = (await tRes.json()) as Template[];
                const mData = (await mRes.json()) as MailList[];
                if (!mounted) return;
                setTemplates(Array.isArray(tData) ? tData : []);
                setMailLists(Array.isArray(mData) ? mData : []);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        if (!templateId) {
            setTemplateHtml("");
            setVariableNames([]);
            setVariables({});
            return;
        }
        setLoading(true);

        const fetchTemplate = async () => {
            try {
                const res = await fetch(`/api/templates?id=${encodeURIComponent(templateId)}`);
                if (!res.ok) throw new Error("Failed to fetch template");
                const template = (await res.json()) as Template;
                if (!mounted) return;
                const html = template?.html ?? "";
                setTemplateHtml(html);
                const matches = Array.from(html.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g));
                const names = [...new Set(matches.map((m) => m[1]))];
                setVariableNames(names);
                const vars: Record<string, string> = {};
                names.forEach((n) => (vars[n] = ""));
                setVariables(vars);
            } catch (err) {
                console.error(err);
                if (mounted) {
                    setTemplateHtml("");
                    setVariableNames([]);
                    setVariables({});
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchTemplate();

        return () => {
            mounted = false;
        };
    }, [templateId]);

    const handleVariableChange = (name: string, value: string) => {
        setVariables((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setAttachments((prev) => [...prev, ...files]);
        if (e.target) e.target.value = "";
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const getProcessedHtml = (): string => {
        if (!templateHtml) return "";

        return templateHtml.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, variableName) => {
            const value = variables[variableName];
            if (value && value.trim()) {
                return value;
            } else {
                return `<span class="bg-yellow-100 text-orange-700 px-1 rounded font-medium">${match}</span>`;
            }
        });
    };

    const handleSend = async () => {
        if (!subject.trim() || !templateId || !mailListId) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("templateId", templateId);
            formData.append("mailListId", mailListId);
            formData.append("variables", JSON.stringify(variables));
            attachments.forEach((file) => {
                formData.append("attachments", file, file.name);
            });

            const res = await fetch("/api/send-mail", {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.error) {
                throw new Error(data.error || data.message || "Failed to send mail");
            }
            const mailSentId = data.mailSentId;
            setToast({ type: "success", message: "Mail sent successfully!" });
            setTimeout(() => {
                router.push(`/mails-sent/${mailSentId}`);
            }, 3000);
        } catch (err) {
            const e = err as Error;
            setToast({ type: "error", message: `Failed to send mail: ${e.message}` });
        }
    };

    if (loading) {
        return <LoadingOverlay text="Loading templates..." />;
    }

    return (
        <AuthGuard>
            {toast && <MyToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            <Main className="py-8 px-4 sm:px-8 mx-auto">
                <PageHeader icon={FaEnvelopeOpenText} label="Send Mail" title="Send Mail" subtitle="Send a new email to your recipients." />

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Label htmlFor="subject" className="text-lg font-semibold">
                            Subject
                        </Label>
                        <TextInput id="subject" type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="template" className="text-lg font-semibold">
                            Template
                        </Label>
                        <Select id="template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} required className="mt-2">
                            <option value="">Select Template</option>
                            {templates.map((template) => (
                                <option key={template._id} value={template._id}>
                                    {template.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {templateHtml && (
                        <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 mt-2">
                            <Label className="font-semibold mb-2 block">Preview</Label>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: getProcessedHtml() }} />
                        </div>
                    )}

                    {variableNames.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            <Label className="text-lg font-semibold">Template Variables</Label>
                            {variableNames.map((name) => (
                                <div key={name}>
                                    <Label htmlFor={`var-${name}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {name}
                                    </Label>
                                    <TextInput id={`var-${name}`} placeholder={`Enter value for ${name}`} value={variables[name] || ""} onChange={(e) => handleVariableChange(name, e.target.value)} className="mt-1" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="mailList" className="text-lg font-semibold">
                            Mail List
                        </Label>
                        <Select id="mailList" value={mailListId} onChange={(e) => setMailListId(e.target.value)} required className="mt-2">
                            <option value="">Select Mail List</option>
                            {mailLists.map((ml) => (
                                <option key={ml._id} value={ml._id}>
                                    {ml.listName}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label className="text-lg font-semibold mb-2">Attachments</Label>
                        <div className="flex items-center gap-4 mt-2">
                            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow transition">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                Select Files
                                <input id="file-upload" type="file" multiple onChange={handleAddAttachment} className="hidden" />
                            </label>
                            {attachments.length > 0 && <span className="text-sm text-gray-600">{attachments.length} file{attachments.length > 1 ? "s" : ""} selected</span>}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            {attachments.map((file, idx) => (
                                <div key={`${file.name}-${idx}`} className="relative w-28 h-28 border-2 border-orange-300 rounded-lg flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow">
                                    <span className="text-orange-500 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                                        </svg>
                                    </span>
                                    <span className="text-xs text-center break-all px-1 max-w-[90px]">{file.name}</span>
                                    <button type="button" onClick={() => handleRemoveAttachment(idx)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white transition-all duration-150" title="Remove" style={{ zIndex: 2 }}>
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8 mb-16">
                        <Button color="primary" size="lg" onClick={handleSend} className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all">Send</Button>
                        <Button onClick={() => router.push("/mails")} color="gray" size="lg" className="py-3 px-6 rounded-lg hover:bg-gray-300 transition-all">Cancel</Button>
                    </div>
                </div>
            </Main>
        </AuthGuard>
    );
}
