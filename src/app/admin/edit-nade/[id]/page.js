"use client";

import withAdminAuth from "@/components/Admin/withAdminAuth";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

function EditNadePage() {
    const [maps, setMaps] = useState([]);
    const [map, setMap] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("smoke");
    const [side, setSide] = useState("T");
    const [position, setPosition] = useState("");
    const [landing, setLanding] = useState("");
    const [throwInput, setThrowInput] = useState("");
    const [throwMethods, setThrowMethods] = useState([]);
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");

    const [location, setLocation] = useState("");
    const [placement, setPlacement] = useState("");
    const [lineupInput, setLineupInput] = useState("");
    const [lineupImages, setLineupImages] = useState([]);
    const [land, setLand] = useState("");

    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            // Haritaları çek
            const mapsRes = await fetch("/api/maps");
            if (mapsRes.ok) {
                const mapsData = await mapsRes.json();
                setMaps(mapsData);
            }

            // Nade verisini çek
            const nadeRes = await fetch(`/api/nades/${id}`);
            if (nadeRes.ok) {
                const nadeData = await nadeRes.json();

                setMap(nadeData.map);
                setName(nadeData.name);
                setType(nadeData.type);
                setSide(nadeData.side);
                setPosition(nadeData.position);
                setLanding(nadeData.landing);
                setThrowMethods(nadeData.throw || []);
                setDescription(nadeData.description);
                setVideo(nadeData.video);

                setLocation(nadeData.images?.location || "");
                setPlacement(nadeData.images?.placement || "");
                setLineupImages(nadeData.images?.lineup || []);
                setLand(nadeData.images?.land || "");
            }
        };
        fetchData();
    }, [id]);

    const handleKeyPress = (e, setter, state, setInput) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            setter([...state, e.target.value.trim()]);
            e.target.value = "";
            setInput("");
        }
    };

    const removeThrowMethod = (index) => {
        setThrowMethods(throwMethods.filter((_, i) => i !== index));
    };

    const removeLineupImage = (index) => {
        setLineupImages(lineupImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nadeData = {
            name,
            map,
            type,
            side,
            position,
            landing,
            throw: throwMethods.length > 0 ? throwMethods : [throwInput.trim()],
            description,
            images: {
                location,
                placement,
                lineup:
                    lineupImages.length > 0
                        ? lineupImages
                        : [lineupInput.trim()],
                land,
            },
            video,
        };

        const res = await fetch(`/api/nades/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nadeData),
        });

        if (res.ok) {
            router.push("/cs2");
        } else {
            console.error("Güncelleme hatası");
        }
    };

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Nade Düzenle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Map Selection */}
                <div>
                    <label className="block font-semibold">Harita:</label>
                    <select
                        value={map}
                        onChange={(e) => setMap(e.target.value)}
                        className="w-full p-2 border rounded-sm"
                    >
                        {maps.map((m) => (
                            <option key={m.name} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nade Name */}
                <div>
                    <label className="block font-semibold">İsim:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                {/* Smoke - Molotov - Flash - Grenade */}
                <div>
                    <label className="block font-semibold">Tür:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border rounded-sm"
                    >
                        <option value="smoke">Smoke</option>
                        <option value="molotov">Molotov</option>
                        <option value="flash">Flash</option>
                        <option value="grenade">Grenade</option>
                    </select>
                </div>

                {/* CT or T Side */}
                <div>
                    <label className="block font-semibold">Side:</label>
                    <select
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        className="w-full p-2 border rounded-sm"
                    >
                        <option value="T">T</option>
                        <option value="CT">CT</option>
                    </select>
                </div>

                {/* Location ve Landing */}
                <div>
                    <label className="block font-semibold">Konum:</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Landing:</label>
                    <input
                        type="text"
                        value={landing}
                        onChange={(e) => setLanding(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                {/* Throw Methods */}
                <div>
                    <label className="block font-semibold">
                        Throw Metotları (can be more than one - press ENTER):
                    </label>
                    <input
                        type="text"
                        value={throwInput}
                        onChange={(e) => setThrowInput(e.target.value)}
                        onKeyDown={(e) => {
                            handleKeyPress(
                                e,
                                setThrowMethods,
                                throwMethods,
                                setThrowInput
                            );
                        }}
                        className="w-full p-2 border rounded-sm"
                    />
                    <ul className="mt-2">
                        {throwMethods.map((t, index) => (
                            <li
                                key={index}
                                className="bg-gray-200 px-2 py-1 inline-flex items-center mr-2 rounded-sm"
                            >
                                {t}
                                <button
                                    type="button"
                                    onClick={() => removeThrowMethod(index)}
                                    className="ml-2 text-red-600 font-bold"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <label className="block font-semibold">Açıklama:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block font-semibold">
                        Atış Yapılan Yer (Location):
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                <div>
                    <label className="block font-semibold">
                        Yerleştirme Noktası (Placement):
                    </label>
                    <input
                        type="text"
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                {/* Lineup Images */}
                <div>
                    <label className="block font-semibold">
                        Nişangah Noktası (Lineup)(can be more than one - press
                        ENTER):
                    </label>
                    <input
                        type="text"
                        value={lineupInput}
                        onChange={(e) => setLineupInput(e.target.value)}
                        onKeyDown={(e) => {
                            handleKeyPress(
                                e,
                                setLineupImages,
                                lineupImages,
                                setLineupInput
                            );
                        }}
                        className="w-full p-2 border rounded-sm"
                    />
                    <ul className="mt-2">
                        {lineupImages.map((img, index) => (
                            <li
                                key={index}
                                className="bg-gray-200 px-2 py-1 inline-flex items-center mr-2 rounded-sm"
                            >
                                {img}
                                <button
                                    type="button"
                                    onClick={() => removeLineupImage(index)}
                                    className="ml-2 text-red-600 font-bold"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label className="block font-semibold">
                        Nade&apos;in Düştüğü Yer (Land):
                    </label>
                    <input
                        type="text"
                        value={land}
                        onChange={(e) => setLand(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label className="block font-semibold">Video URL:</label>
                    <input
                        type="text"
                        value={video}
                        onChange={(e) => setVideo(e.target.value)}
                        required
                        className="w-full p-2 border rounded-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-sm"
                >
                    Değişiklikleri Kaydet
                </button>
            </form>
        </section>
    );
}

export default withAdminAuth(EditNadePage);