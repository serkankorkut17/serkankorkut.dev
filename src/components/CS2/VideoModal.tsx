"use client";

import React, { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
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

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    title: string;
    description: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
    isOpen,
    onClose,
    videoUrl,
    title,
    description,
}) => {
    // Global escape key listener
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleGlobalKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle escape key for closing the modal (local)
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 animate-in fade-in duration-300"
            onClick={onClose}
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
                        <h3 className="text-xl font-bold text-white truncate">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
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
                                        src: videoUrl,
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
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;