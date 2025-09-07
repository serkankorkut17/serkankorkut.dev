import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

export default ImageWithLoading;