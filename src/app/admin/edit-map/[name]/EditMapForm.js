"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function EditMapForm({ map }) {
    const [title, setTitle] = useState(map.title);
    const [active, setActive] = useState(map.active);
    const [image, setImage] = useState(map.image);
    const [description, setDescription] = useState(map.description);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/maps/${map.name}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, active, image, description }),
        });
        if (res.ok) {
            router.push("/cs2");
        } else {
            console.error("Harita güncellenirken hata oluştu");
        }
    };

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Haritayı Düzenle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">
                        İsim (Değiştirilemez):
                    </label>
                    <input
                        type="text"
                        value={map.name}
                        disabled
                        className="w-full p-2 border rounded bg-gray-100"
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
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Haritayı Güncelle
                </button>
            </form>
        </section>
    );
}

export default EditMapForm;
