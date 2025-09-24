import { notFound } from "next/navigation";
import NadesList from "@/components/CS2/NadesList";
import PageHeading from "@/components/Sections/PageHeading";

interface NadesPageProps {
	params: Promise<{
		mapName: string;
	}>;
}

export default async function NadesPage({ params }: NadesPageProps) {
	const { mapName } = await params;

	try {
		const baseUrl = process.env.NEXT_URL
			? `${process.env.NEXT_URL}`
			: "http://localhost:3000";

		const response = await fetch(`${baseUrl}/api/maps/${mapName}`, {
			cache: "force-cache",
		});

		if (!response.ok) {
			notFound();
		}

		const map = await response.json();

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
	} catch (error) {
		console.error("Error fetching map:", error);
		notFound();
	}
}
