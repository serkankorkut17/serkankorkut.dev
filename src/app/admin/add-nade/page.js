"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAdminAuth from "@/components/Admin/withAdminAuth";

function AddNadePage() {
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

    // Görsel alanları
    const [location, setLocation] = useState("");
    const [placement, setPlacement] = useState("");
    const [lineupInput, setLineupInput] = useState("");
    const [lineupImages, setLineupImages] = useState([]);
    const [land, setLand] = useState("");

    const router = useRouter();

    // Haritaları çekme
    useEffect(() => {
        const fetchMaps = async () => {
            const res = await fetch("/api/maps");
            if (res.ok) {
                const data = await res.json();
                setMaps(data);
                if (data.length > 0) setMap(data[0].name);
            }
        };
        fetchMaps();
    }, []);

    // Enter basınca yeni throw veya lineup ekleme
    const handleKeyPress = (e, setter, state, setInput) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            setter([...state, e.target.value.trim()]);
            e.target.value = "";
            setInput("");
        }
    };

    // Silme fonksiyonları
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

        const res = await fetch("/api/nades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nadeData),
        });

        if (res.ok) {
            router.push("/cs2");
        } else {
            console.error("Nade eklenirken hata oluştu");
        }
    };

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Yeni Nade Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Harita Seçimi */}
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

                {/* Nade Adı */}
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

                {/* Tür Seçimi */}
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

                {/* Side Seçimi */}
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

                {/* Konum ve Landing */}
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

                {/* Görsel Alanları */}
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
                    Nade Ekle
                </button>
            </form>
        </section>
    );
}

export default withAdminAuth(AddNadePage);
