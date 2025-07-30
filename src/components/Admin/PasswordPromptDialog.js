"use client";

import React, { useState } from "react";

const PasswordPromptDialog = ({ onSubmit }) => {
    const [password, setPassword] = useState("");
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordIncorrect(false);

        try {
            const request = await fetch(`/api/admin/auth`, {
                body: JSON.stringify({ password }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });

            const response = await request.json();

            if (request.status !== 200) {
                setPasswordIncorrect(true);
                setLoading(false);
            } else {
                // Başarılı login, sayfayı yenile
                window.location.reload();
            }
        } catch (error) {
            console.error('Login error:', error);
            setPasswordIncorrect(true);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-2xl rounded-lg p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                            <p className="text-gray-600">Enter your password to access the admin area</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                    placeholder="Enter admin password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            {passwordIncorrect && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">Incorrect password. Please try again.</p>
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    'Access Admin Panel'
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                🔒 This area is protected and requires authentication
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PasswordPromptDialog;
