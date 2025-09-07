"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import CS2GalleryModal from "@/components/CS2/GalleryModal";

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

interface GrenadeInstructionProps {
    nade: Nade;
}

interface ImageWithLoadingProps {
    src: string;
    alt: string;
    title: string;
    priority?: boolean;
    onClick?: () => void;
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({ 
    src, 
    alt, 
    title, 
    priority = false,
    onClick
}) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <div className={onClick ? "cursor-pointer group" : ""} onClick={onClick}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {title}
            </h3>
            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative w-full pb-[75%] overflow-hidden">
                    {imageLoading && (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-orange-500" />
                        </div>
                    )}
                    {src && !imageError ? (
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`object-cover object-center transition-all duration-300 ${
                                onClick ? 'group-hover:scale-105' : ''
                            } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            priority={priority}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500">
                            No image available
                        </div>
                    )}
                    
                    {/* Hover overlay for clickable images */}
                    {onClick && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 rounded-full p-3">
                                    <svg
                                        className="w-6 h-6 text-gray-800"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GrenadeInstruction: React.FC<GrenadeInstructionProps> = ({ nade }) => {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get all images in order
    const getAllImages = (): string[] => {
        const images = [];
        if (nade.images?.location) images.push(nade.images.location);
        if (nade.images?.placement) images.push(nade.images.placement);
        if (nade.images?.lineup) images.push(...nade.images.lineup);
        if (nade.images?.land) images.push(nade.images.land);
        return images.filter(Boolean);
    };

    const handleImageClick = (imageUrl: string) => {
        const allImages = getAllImages();
        const index = allImages.indexOf(imageUrl);
        if (index !== -1) {
            setCurrentImageIndex(index);
            setGalleryOpen(true);
        }
    };

    return (
        <>
            <div className="grid md:grid-cols-3 gap-8 w-full">
                {/* Images Section - 2 column grid, spans 2 columns, appears first on desktop */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4 order-2 md:order-1">
                    <ImageWithLoading
                        src={nade.images?.location}
                        alt="Starting Position"
                        title="Position"
                        priority={true}
                        onClick={() => handleImageClick(nade.images?.location)}
                    />

                    <ImageWithLoading
                        src={nade.images?.placement}
                        alt="Placement"
                        title="Placement"
                        onClick={() => handleImageClick(nade.images?.placement)}
                    />

                    {nade.images?.lineup?.map((lineupUrl, index) => (
                        <ImageWithLoading
                            key={index}
                            src={lineupUrl}
                            alt={`Aim Lineup ${index + 1}`}
                            title={`Lineup ${index + 1}`}
                            onClick={() => handleImageClick(lineupUrl)}
                        />
                    ))}

                    <ImageWithLoading
                        src={nade.images?.land}
                        alt="Landing Position"
                        title="Landing"
                        onClick={() => handleImageClick(nade.images?.land)}
                    />
                </div>

                {/* Instructions Section - spans 1 column, appears second on mobile, third on desktop */}
                <div className="space-y-6 order-1 md:order-2">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4 break-words">
                            Throw Instructions
                        </h2>
                        {nade.throw?.map((instruction, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 mb-4 flex-wrap"
                            >
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 break-words min-w-0 flex-1">
                                    {instruction}
                                </p>
                            </div>
                        ))}

                        <div className="text-sm text-gray-500 italic break-words">
                            Practice the lineup multiple times for consistency
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-xl p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 break-words">
                            Grenade Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="min-w-0">
                                <span className="text-gray-500">Type</span>
                                <p className="font-medium text-gray-800 capitalize overflow-hidden text-ellipsis break-words">
                                    {nade.type}
                                </p>
                            </div>
                            <div className="min-w-0">
                                <span className="text-gray-500">Position</span>
                                <p className="font-medium text-gray-800 overflow-hidden text-ellipsis break-words">
                                    {nade.position}
                                </p>
                            </div>
                            <div className="min-w-0">
                                <span className="text-gray-500">Landing</span>
                                <p className="font-medium text-gray-800 overflow-hidden text-ellipsis break-words">
                                    {nade.landing}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <CS2GalleryModal
                isOpen={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                images={getAllImages()}
                currentIndex={currentImageIndex}
                setCurrentIndex={setCurrentImageIndex}
                nadeTitle={nade.name}
            />
        </>
    );
};

export default GrenadeInstruction;
