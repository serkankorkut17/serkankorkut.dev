import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "CS2 Nades - Haritalar",
    description: "Bir harita seçerek nade bilgilerine ulaşın.",
};

export default async function MapSelectionPage() {
    await connectToDatabase();
    const maps = await Map.find({});

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <div className="text-start pb-12">
                <p className="text-orange-500 text-lg font-extrabold">
                    .: CS2 MAPS
                </p>
                <h2 className="text-6xl font-extrabold mt-2">Edit CS2 Maps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                {maps.map((map) => (
                    <Link key={map.name} href={`/admin/edit-map/${map.name}`}>
                        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={map.image}
                                    alt={map.title}
                                    fill
                                    sizes="100%"
                                    className="object-cover object-center transition-transform duration-300 hover:scale-110 w-auto h-auto"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold">
                                    {map.title}
                                </h2>
                                <p className="text-gray-600">
                                    {map.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
