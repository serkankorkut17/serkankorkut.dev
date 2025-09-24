"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "flowbite-react";

// ChatbotWidget component that provides a floating chat button and a modal for user interaction
export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hello! How can I help you?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();
        setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/gemini-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userMessage }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: data.answer || "An error has occurred." },
            ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e: unknown) {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "An error has occurred." },
            ]);
        }
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chatbot Floating Button */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="fixed z-50 bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all"
                aria-label="Chatbot"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
            >
                💬
            </button>

            {/* Chatbot Modal */}
            {open && (
                <div className="fixed z-50 bottom-20 right-2 w-96 max-w-[95vw] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-orange-500">
                            Chatbot
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-2xl font-bold text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-200"
                            aria-label="Kapat"
                            style={{
                                border: "none",
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div
                        className="flex-1 overflow-y-auto px-4 py-2"
                        style={{ maxHeight: 350 }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-2 flex ${
                                    msg.from === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                                        msg.from === "user"
                                            ? "bg-orange-100 text-orange-900"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                        <Textarea
                            className="flex-1 resize-none rounded-lg"
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}