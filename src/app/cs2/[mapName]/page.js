import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import Nade from "@/models/Nade";
import { notFound } from "next/navigation";
import NadesList from "./NadesList";

export default async function NadesPage({ params }) {
    const { mapName } = await params;
    await connectToDatabase();

    const map = JSON.parse(
        JSON.stringify(await Map.findOne({ name: mapName }))
    );
    const mapNades = JSON.parse(
        JSON.stringify(await Nade.find({ map: mapName }))
    );

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
            <div className="text-start pb-8">
                <p className="text-orange-500 text-lg font-extrabold">
                    .: {map.title}
                </p>
                <h2 className="text-6xl font-extrabold mt-2">
                    Nades for {map.title}
                </h2>
            </div>
            <NadesList nades={mapNades} mapName={mapName} />
        </section>
    );
}
