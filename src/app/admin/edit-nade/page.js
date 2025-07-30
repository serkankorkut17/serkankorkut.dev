"use client";

import { useState, useEffect } from "react";
import withAdminAuth from "@/components/Admin/withAdminAuth";
import Link from "next/link";
import Image from "next/image";

function EditNadesPage() {
    const [nades, setNades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNades = async () => {
            try {
                const response = await fetch('/api/nades');
                const data = await response.json();
                setNades(data || []);
            } catch (error) {
                console.error('Error fetching nades:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNades();
    }, []);

    if (loading) {
        return (
            <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading nades...</p>
                    </div>
                </div>
            </section>
        );
    }


    if (nades.length === 0) {
        return (
            <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black">
                <div className="text-start pb-12">
                    <p className="text-orange-500 text-lg font-extrabold">
                        .: EDIT NADES
                    </p>
                    <h2 className="text-6xl font-extrabold mt-2">
                        No Nades Found
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <div className="text-start pb-12">
                <p className="text-orange-500 text-lg font-extrabold">
                    .: EDIT NADES
                </p>
                <h2 className="text-6xl font-extrabold mt-2">
                    Select a Nade to Edit
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {nades.map((nade) => (
                    <Link key={nade.id} href={`/admin/edit-nade/${nade.id}`}>
                        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={nade.images.land}
                                    alt={nade.name}
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center transition-transform duration-300 hover:scale-110 w-auto h-auto"
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-gray-800 font-semibold">{nade.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default withAdminAuth(EditNadesPage);
