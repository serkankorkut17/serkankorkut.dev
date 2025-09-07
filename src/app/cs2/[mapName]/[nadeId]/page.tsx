"use client";

import React, { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import GrenadeTitle from "../../../../components/CS2/GrenadeTitle";
import GrenadeInstruction from "../../../../components/CS2/GrenadeInstruction";

interface NadeDetailPageProps {
    params: Promise<{
        mapName: string;
        nadeId: string;
    }>;
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

interface Map {
    _id: string;
    name: string;
    title: string;
    active: boolean;
    image: string;
    description: string;
}

export default function NadeDetailPage({ params }: NadeDetailPageProps) {
    // Unwrap params using React.use()
    const { mapName, nadeId } = use(params);
    
    const [nade, setNade] = useState<Nade | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                
                
                // Fetch nade data
                const nadeResponse = await fetch(`/api/nades/${nadeId}`);
                if (!nadeResponse.ok) {
                    if (nadeResponse.status === 404) {
                        notFound();
                    }
                    throw new Error("Failed to fetch nade data");
                }
                const nadeData = await nadeResponse.json();
                setNade(nadeData);

                // Fetch map data
                const mapResponse = await fetch(`/api/maps/${mapName}`);
                if (mapResponse.ok) {
                    const mapData = await mapResponse.json();
                    setMap(mapData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nadeId, mapName]);

    if (loading) {
        return (
            <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-pulse">
                    <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 grid grid-cols-2 gap-4 order-2 md:order-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
                                <div className="bg-gray-300 rounded-lg h-32"></div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <div className="animate-pulse">
                            <div className="bg-gray-300 rounded-xl h-64"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!nade) {
        notFound();
    }

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <GrenadeTitle nade={nade} map={map} />
            <GrenadeInstruction nade={nade} />
        </section>
    );
}
