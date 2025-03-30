import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import Nade from "@/models/Nade";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function NadesPage({ params }) {
    const { mapName } = await params;
    await connectToDatabase();
    const map = await Map.findOne({ name: mapName });
    const mapNades = await Nade.find({ map: mapName });

    if (!map) {
        notFound();
    }

    if (mapNades.length === 0) {
        return (
            <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black">
                <div className="text-start pb-12">
                    <p className="text-orange-500 text-lg font-extrabold">
                        .: {map.title}
                    </p>
                    <h2 className="text-6xl font-extrabold mt-2">
                        No Nades Found for {map.title}
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            <div className="text-start pb-12">
                <p className="text-orange-500 text-lg font-extrabold">
                    .: {map.title}
                </p>
                <h2 className="text-6xl font-extrabold mt-2">
                    Nades for {map.title}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mapNades.map((nade) => (
                    <Link key={nade.id} href={`/cs2/${mapName}/${nade.id}`}>
                        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={nade.images.land}
                                    alt={nade.description}
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
