"use client";

import { useState, useEffect } from "react";
import { HiSearch, HiFilter, HiX } from "react-icons/hi";
import { TextInput, Select, Button } from "flowbite-react";
import FooterStats from "@/components/CS2/FooterStats";
import PageHeading from "@/components/Sections/PageHeading";
import MapCard from "@/components/CS2/MapCard";
import { Map, ApiGetMapsResponse } from "@/types/cs2";

export default function MapSelectionPage() {
	const [maps, setMaps] = useState<Map[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<
		"all" | "active" | "inactive"
	>("all");

	const fetchMaps = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();

			if (searchTerm.trim()) {
				params.append("search", searchTerm.trim());
			}

			if (activeFilter !== "all") {
				params.append("active", activeFilter === "active" ? "true" : "false");
			}

			const response = await fetch(`/api/maps?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch maps");
			}

			const data: ApiGetMapsResponse = await response.json();
			setMaps(data.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMaps();
	}, [searchTerm, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

	const filteredMaps = maps.filter((map) => {
		const matchesSearch =
			searchTerm === "" ||
			map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			map.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesActive =
			activeFilter === "all" ||
			(activeFilter === "active" && map.active) ||
			(activeFilter === "inactive" && !map.active);

		return matchesSearch && matchesActive;
	});

	if (error) {
		return (
			<section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
				<div className="text-center py-12">
					<p className="text-red-500 text-lg">Error: {error}</p>
					<Button
						onClick={fetchMaps}
						color="failure"
						size="lg"
						className="mt-4"
					>
						Try Again
					</Button>
				</div>
			</section>
		);
	}

	return (
		<section className="flex flex-col py-8 px-8 md:px-16 bg-white text-black min-h-screen">
			{/* Header */}
			<PageHeading
				title="CS2 Maps"
				subtitle="Master Your Grenade Lineups"
				description="Choose a map to explore professional grenade lineups and strategies"
			/>

			{/* Filters and Controls */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				{/* Search */}
				<div className="relative flex-1">
					<TextInput
						icon={HiSearch}
						placeholder="Search for maps, lineups, strategies..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						sizing="lg"
						className="w-full"
						theme={{
							field: {
								input: {
									base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
									sizes: {
										lg: "text-base sm:text-lg px-4 py-4 pl-12 pr-12",
									},
									colors: {
										gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500",
									},
								},
							},
						}}
					/>
					{searchTerm && (
						<button
							onClick={() => setSearchTerm("")}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<HiX className="h-5 w-5" />
						</button>
					)}
				</div>

				{/* Controls Row */}
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Active Filter */}
					<div className="flex items-center gap-3">
						<Select
                        icon={HiFilter}
							value={activeFilter}
							onChange={(e) =>
								setActiveFilter(e.target.value as "all" | "active" | "inactive")
							}
							sizing="lg"
							className="w-full sm:w-auto min-w-[180px]"
							theme={{
								field: {
									select: {
										base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
										sizes: {
											lg: "p-4 text-base sm:text-lg",
										},
										colors: {
											gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500",
										},
									},
								},
							}}
						>
							<option value="all">All Maps</option>
							<option value="active">Active Only</option>
							<option value="inactive">Inactive Only</option>
						</Select>
					</div>
				</div>
			</div>

			{/* Results Count */}
			<div className="mb-6">
				<p className="text-gray-600">
					{loading
						? "Loading..."
						: `Showing ${filteredMaps.length} of ${maps.length} maps`}
				</p>
			</div>

			{/* Loading State */}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<div key={n} className="animate-pulse">
							<div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
							<div className="bg-gray-200 rounded h-6 mb-2"></div>
							<div className="bg-gray-200 rounded h-4"></div>
						</div>
					))}
				</div>
			) : (
				/* Maps Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filteredMaps.length === 0 ? (
						<div className="col-span-full text-center py-12">
							<p className="text-gray-500 text-lg">
								No maps found matching your criteria
							</p>
						</div>
					) : (
						filteredMaps.map((map) => (
							<MapCard key={map.name} map={map} />
						))
					)}
				</div>
			)}

			{/* Footer Stats */}
			<FooterStats
				mapsLength={maps.length}
				activeMapsLength={maps.filter((m) => m.active).length}
			/>
		</section>
	);
}
