import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import { notFound } from "next/navigation";
import NadesList from "../../../components/CS2/NadesList";
import PageHeading from "@/components/Sections/PageHeading";

export default async function NadesPage({ params }: { params: Promise<{ mapName: string }> }) {
    const { mapName } = await params;
    await connectToDatabase();

    const map = JSON.parse(
        JSON.stringify(await Map.findOne({ name: mapName }))
    );

    if (!map) {
        notFound();
    }

    return (
        <section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
            {/* Header */}
            <PageHeading
                title={map.title}
                subtitle="Grenade Lineups & Strategies"
                description="Master professional grenade lineups for this map"
            />
            
            <NadesList mapName={mapName} />
        </section>
    );
}
