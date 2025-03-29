import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import Nade from "@/models/Nade";
import { notFound } from "next/navigation";
import GrenadeTitle from "./GrenadeTitle";
import GrenadeInstruction from "./GrenadeInstruction";

export default async function NadeDetailPage({ params }) {
    const { mapName, nadeId } = await params;
    await connectToDatabase();
    const nade = JSON.parse(JSON.stringify(await Nade.findById(nadeId)));
    const map = JSON.parse(
        JSON.stringify(await Map.findOne({ name: mapName }))
    );

    if (!nade) {
        notFound();
    }

    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 w-full min-h-screen py-12">
            <div className="mx-auto px-4">
                <GrenadeTitle nade={nade} map={map} />
                <GrenadeInstruction nade={nade} />
            </div>
        </div>
    );
}
