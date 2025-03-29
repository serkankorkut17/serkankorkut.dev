"use client";

import React, { useState } from "react";

const PasswordPromptDialog = ({ onSubmit }) => {
    const [password, setPassword] = useState("");
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const request = await fetch(`/api`, {
            body: JSON.stringify({ password }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });

        if (request.status !== 200) {
            setPasswordIncorrect(true);
            setLoading(false);
        } else {
            window.location.reload();
        }
    };

    return (
        <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
            <div className="password-prompt-dialog">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                    {passwordIncorrect && (
                        <p style={{ color: "red" }}>Incorrect password</p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default PasswordPromptDialog;
