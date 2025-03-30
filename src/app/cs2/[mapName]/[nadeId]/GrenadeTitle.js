"use client";

import React, { useState } from "react";

const SideBadge = ({ side }) => {
    if (!side) return null;

    const sideConfig = {
        t: {
            text: "Terrorists",
            bgColor: "bg-red-600",
            textColor: "text-white",
        },
        ct: {
            text: "Counter-Terrorists",
            bgColor: "bg-blue-600",
            textColor: "text-white",
        },
    };

    const config = sideConfig[side.toLowerCase()] || {
        text: "Unknown Side",
        bgColor: "bg-gray-500",
        textColor: "text-white",
    };

    return (
        <span
            className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-xs uppercase tracking-wide inline-block ml-3 text-ellipsis break-words`}
        >
            {config.text}
        </span>
    );
};

const GrenadeTitle = ({ nade = {}, map = {} }) => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const openVideoModal = () => {
        setIsVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setIsVideoModalOpen(false);
    };

    // Handle escape key for closing the modal
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            closeVideoModal();
        }
    };

    // Safely extract values with defaults
    const nadeName = nade.name || "Unnamed";
    const nadeDescription = nade.description || "No description available";
    const mapTitle = map.title || "Unknown Map";
    const nadeVideo = nade.video || null;
    const nadeSide = nade.side || null;

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-center mb-2 flex-wrap">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-2 break-words min-w-0 flex-[1_1_100%] md:flex-none">
                        {nadeName}
                    </h1>
                    <SideBadge side={nadeSide} />
                </div>
                <p className="text-xl text-gray-600 mb-4 break-words">{nadeDescription}</p>
                <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-extrabold text-lg uppercase tracking-wide">
                        {mapTitle}
                    </span>
                    {nadeVideo && (
                        <button
                            onClick={openVideoModal}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Watch Tutorial
                        </button>
                    )}
                </div>
            </div>

            {isVideoModalOpen && nadeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closeVideoModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="button"
                    aria-label="Close video modal"
                >
                    <div
                        className="relative w-full max-w-7xl aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeVideoModal}
                            className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition"
                            aria-label="Close video"
                        >
                            ✕
                        </button>
                        <iframe
                            src={nadeVideo}
                            title="Grenade Tutorial"
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
};

// Default props to provide fallback values
GrenadeTitle.defaultProps = {
    nade: {},
    map: {},
};

export default GrenadeTitle;
