"use client";

import React, { useState, useEffect } from "react";
import { HiXMark, HiPlay } from "react-icons/hi2";
import dynamic from "next/dynamic";

// Dynamically import Plyr to avoid SSR issues
const Plyr = dynamic(() => import("plyr-react"), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
            <div className="text-white">Loading video player...</div>
        </div>
    ),
});

interface Map {
    _id: string;
    name: string;
    title: string;
    active: boolean;
    image: string;
    description: string;
}

interface Nade {
    _id: string;
    name: string;
    type: string;
    side: string;
    description: string;
    images: {
        land: string;
        location: string;
        placement: string;
        lineup: string[];
    };
    map: string;
    throw: string[];
    position: string;
    landing: string;
    video?: string;
}

interface SideBadgeProps {
    side: string | null;
}

interface GrenadeTitleProps {
    nade: Nade;
    map?: Map | null;
}

const SideBadge: React.FC<SideBadgeProps> = ({ side }) => {
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

    const config = sideConfig[side.toLowerCase() as keyof typeof sideConfig] || {
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

const GrenadeTitle: React.FC<GrenadeTitleProps> = ({ nade, map }) => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const openVideoModal = () => {
        setIsVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setIsVideoModalOpen(false);
    };

    // Global escape key listener
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isVideoModalOpen) {
                closeVideoModal();
            }
        };

        if (isVideoModalOpen) {
            document.addEventListener('keydown', handleGlobalKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isVideoModalOpen]);

    // Handle escape key for closing the modal (local)
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            closeVideoModal();
        }
    };

    // Safely extract values with defaults
    const nadeName = nade?.name || "Unnamed";
    const nadeDescription = nade?.description || "No description available";
    const mapTitle = map?.title || "Unknown Map";
    const nadeVideo = nade?.video || null;
    const nadeSide = nade?.side || null;

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
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <HiPlay className="w-5 h-5" />
                            Watch Tutorial
                        </button>
                    )}
                </div>
            </div>

            {isVideoModalOpen && nadeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 animate-in fade-in duration-300"
                    onClick={closeVideoModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="dialog"
                    aria-label="Video tutorial modal"
                >
                    <div
                        className="relative w-full max-w-[95vw] h-full max-h-[95vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="bg-black px-6 py-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-white truncate">{nadeName}</h3>
                            </div>
                            <button
                                onClick={closeVideoModal}
                                className="ml-4 bg-gray-700 hover:bg-red-600 rounded-full p-2 text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110"
                                aria-label="Close video modal"
                            >
                                <HiXMark className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Video player container - takes most of the space */}
                        <div className="bg-black flex-1 relative min-h-0">
                            <div className="w-full h-full flex items-center justify-center">
                                <Plyr
                                    source={{
                                        type: 'video',
                                        sources: [
                                            {
                                                src: nadeVideo,
                                                type: 'video/mp4',
                                            },
                                        ],
                                    }}
                                    options={{
                                        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                                        autoplay: true,
                                        volume: 0.8,
                                        ratio: '16:9',
                                        fullscreen: {
                                            enabled: true,
                                            fallback: true,
                                            iosNative: true,
                                        },
                                        quality: {
                                            default: 720,
                                            options: [720, 480, 360],
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        {/* Video description - compact */}
                        <div className="bg-black px-6 py-3 border-t border-gray-800 flex-shrink-0">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {nadeDescription}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GrenadeTitle;
