"use client";

import React, { useState } from "react";
import { HiPlay } from "react-icons/hi2";
import { Map, Nade } from "@/types/cs2";
import VideoModal from "./VideoModal";


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

            {/* Video Modal */}
            <VideoModal 
                isOpen={isVideoModalOpen} 
                onClose={closeVideoModal} 
                videoUrl={nadeVideo || ""}
                title={nadeName}
                description={nadeDescription}
            />
        </>
    );
};

export default GrenadeTitle;
