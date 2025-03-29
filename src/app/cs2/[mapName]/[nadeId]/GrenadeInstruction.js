"use client";

import React, { useState } from "react";
import Image from "next/image";

const GrenadeInstruction = ({ nade = {} }) => {
    return (
        <div className="grid md:grid-cols-3 gap-4 md:gap-8 w-full">
            {/* Images */}
            <div className="md:col-span-2 space-y-4 md:space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Starting Position
                    </h2>
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full pb-[75%] overflow-hidden">
                            {nade.images.location ? (
                                <Image
                                    src={nade.images.location}
                                    alt="Starting Position"
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center w-auto h-auto"
                                    priority
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Placement
                    </h2>
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full pb-[75%] overflow-hidden">
                            {nade.images.placement ? (
                                <Image
                                    src={nade.images.placement}
                                    alt="Placement"
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center w-auto h-auto"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {nade.images.lineup.map((lineupUrl, index) => (
                    <div key={index}>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Aim Lineup {index + 1}
                        </h2>
                        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="relative w-full pb-[75%] overflow-hidden group">
                                {lineupUrl ? (
                                    <Image
                                        src={lineupUrl}
                                        alt="Aim Lineup"
                                        fill
                                        sizes="100%"
                                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[3] will-change-transform w-auto h-auto"
                                    />
                                ) : (
                                    <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500">
                                        No image available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Landing Position
                    </h2>
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full pb-[75%] overflow-hidden">
                            {nade.images.land ? (
                                <Image
                                    src={nade.images.land}
                                    alt="Landing Position"
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center w-auto h-auto"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl overflow-hidden">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4 break-words">
                        Throw Instructions
                    </h2>
                    {nade.throw.map((instruction, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 mb-4 flex-wrap"
                        >
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
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
    );
};

export default GrenadeInstruction;
