"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMapPage() {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [active, setActive] = useState(true);
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/maps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, title, active, image, description }),
        });
        if (res.ok) {
            router.push("/cs2");
        } else {
            console.error("Harita eklenirken hata oluştu");
        }
    };

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Yeni Harita Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">
                        İsim (Benzersiz):
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Başlık:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Aktif:</label>
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="h-5 w-5"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Görsel URL:</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Açıklama:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Harita Ekle
                </button>
            </form>
        </section>
    );
}
