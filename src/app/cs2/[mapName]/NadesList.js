"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Cloud, Zap, Bomb, Shield, Sword } from "lucide-react";

const NadesList = ({ nades, mapName }) => {
    const [selectedType, setSelectedType] = useState("all");
    const [selectedSide, setSelectedSide] = useState("all");

    console.log(mapName);

    // Filter nades based on selected type and side
    const filteredNades = nades.filter((nade) => {
        const typeMatch = selectedType === "all" || nade.type === selectedType;
        const sideMatch = selectedSide === "all" || nade.side === selectedSide;
        return typeMatch && sideMatch;
    });

    // Icon mapping for each nade type
    const nadeIcons = {
        molotov: <Flame size={18} className="text-red-500" />,
        smoke: <Cloud size={18} className="text-gray-500" />,
        flash: <Zap size={18} className="text-yellow-500" />,
        grenade: <Bomb size={18} className="text-green-500" />,
    };

    // Icon mapping for sides
    const sideIcons = {
        CT: <Shield size={18} className="text-blue-500" />,
        T: <Sword size={18} className="text-yellow-500" />,
    };

    return (
        <div className="space-y-4">
            {/* Filter section */}
            <div className="space-y-3">
                {/* Type filter buttons */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Type:</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setSelectedType("all")}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                selectedType === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            All Types
                        </button>
                        {Object.keys(nadeIcons).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                                    selectedType === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                <span
                                    className={
                                        selectedType === type ? "text-white" : ""
                                    }
                                >
                                    {React.cloneElement(nadeIcons[type], {
                                        className:
                                            selectedType === type
                                                ? "text-white"
                                                : nadeIcons[type].props.className,
                                    })}
                                </span>
                                <span className="capitalize">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Side filter buttons */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Side:</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setSelectedSide("all")}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                selectedSide === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            All Sides
                        </button>
                        {Object.keys(sideIcons).map((side) => (
                            <button
                                key={side}
                                onClick={() => setSelectedSide(side)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                                    selectedSide === side
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                <span
                                    className={
                                        selectedSide === side ? "text-white" : ""
                                    }
                                >
                                    {React.cloneElement(sideIcons[side], {
                                        className:
                                            selectedSide === side
                                                ? "text-white"
                                                : sideIcons[side].props.className,
                                    })}
                                </span>
                                <span>{side}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nades grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredNades.map((nade) => (
                    <Link key={nade._id} href={`/cs2/${mapName}/${nade._id}`} className="h-full">
                        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                            <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                                <Image
                                    src={nade.images.land}
                                    alt={nade.description}
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center transition-transform duration-300 hover:scale-110 w-auto h-auto"
                                />
                                <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                                    {nadeIcons[nade.type]}
                                </div>
                                <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                                    {sideIcons[nade.side]}
                                </div>
                            </div>
                            <div className="p-4 flex justify-between items-center flex-grow">
                                <p className="text-gray-800 font-semibold">
                                    {nade.name}
                                </p>
                                <div className="flex flex-col lg:flex-row gap-2">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium capitalize">
                                        {nadeIcons[nade.type]}
                                        <span>{nade.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                                        {sideIcons[nade.side]}
                                        <span>{nade.side}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Display message when no items match the filter */}
            {filteredNades.length === 0 && (
                <div className="text-center py-8 text-gray-500 mb-8">
                    No nades found matching your filters.
                </div>
            )}
        </div>
    );
};

export default NadesList;