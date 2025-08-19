"use client";

import { useState, useEffect } from "react";
import withAdminAuth from "@/components/Admin/withAdminAuth";
import Link from "next/link";
import Image from "next/image";

function MapSelectionPage() {
	const [maps, setMaps] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMaps = async () => {
			try {
				const response = await fetch("/api/maps");
				const data = await response.json();
				setMaps(data || []);
			} catch (error) {
				console.error("Error fetching maps:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMaps();
	}, []);

	if (loading) {
		return (
			<section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading maps...</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
			<div className="text-start pb-12">
				<p className="text-orange-500 text-lg font-extrabold">
					.: CS2 MAPS
				</p>
				<h2 className="text-6xl font-extrabold mt-2">Edit CS2 Maps</h2>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{maps.map((map) => (
					<Link key={map.name} href={`/admin/edit-map/${map.name}`}>
						<div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
							<div className="relative w-full h-48 overflow-hidden shrink-0">
								<Image
									src={map.image}
									alt={map.title}
									fill
									sizes="100%"
									className="object-cover object-center transition-transform duration-300 hover:scale-110 w-auto h-auto"
								/>
								{/* Active/Inactive */}
								<div
									className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${
										map.active
											? "bg-green-500"
											: "bg-red-500"
									} text-white z-10`}
								>
									{map.active ? "Active" : "Inactive"}
								</div>
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

export default withAdminAuth(MapSelectionPage);
