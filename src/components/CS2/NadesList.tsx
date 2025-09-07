"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiSearch, HiFilter, HiX } from "react-icons/hi";
import { TextInput, Select } from "flowbite-react";
import NadeCard from "@/components/CS2/NadeCard";
import { Nade, ApiGetNadesResponse } from "@/types/cs2";

interface NadesListProps {
	mapName: string;
}

const NadesList: React.FC<NadesListProps> = ({ mapName }) => {
	const [nades, setNades] = useState<Nade[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [sideFilter, setSideFilter] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [totalNades, setTotalNades] = useState(0);
	const observerRef = useRef<HTMLDivElement>(null);

	const PAGE_SIZE = 12;

	const fetchNades = useCallback(async (page = 1, resetList = true) => {
		try {
			if (resetList) {
				setLoading(true);
			} else {
				setLoadingMore(true);
			}
			setError(null);

			const params = new URLSearchParams();

			// Always filter by map
			params.append("map", mapName);

			// Add pagination
			params.append("pageNumber", page.toString());
			params.append("pageSize", PAGE_SIZE.toString());

			if (searchTerm.trim()) {
				params.append("search", searchTerm.trim());
			}

			if (typeFilter !== "all") {
				params.append("type", typeFilter);
			}

			if (sideFilter !== "all") {
				params.append("side", sideFilter);
			}

			const response = await fetch(`/api/nades?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch nades");
			}

			const data: ApiGetNadesResponse = await response.json();
			
			if (resetList) {
				setNades(data.data);
			} else {
				setNades(prev => [...prev, ...data.data]);
			}

			setTotalNades(data.total);
			setCurrentPage(page);
			setHasNextPage(page < data.totalPages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}, [mapName, searchTerm, typeFilter, sideFilter, PAGE_SIZE]);

	const loadMore = useCallback(() => {
		if (!loadingMore && hasNextPage) {
			fetchNades(currentPage + 1, false);
		}
	}, [loadingMore, hasNextPage, currentPage, fetchNades]);

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
		fetchNades(1, true);
	}, [searchTerm, typeFilter, sideFilter, mapName, fetchNades]);

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const target = entries[0];
				if (target.isIntersecting && hasNextPage && !loading && !loadingMore) {
					loadMore();
				}
			},
			{
				threshold: 0.1,
				rootMargin: "100px",
			}
		);

		const currentObserverRef = observerRef.current;
		if (currentObserverRef) {
			observer.observe(currentObserverRef);
		}

		return () => {
			if (currentObserverRef) {
				observer.unobserve(currentObserverRef);
			}
		};
	}, [hasNextPage, loading, loadingMore, loadMore]);

	const filteredNades = nades;

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-red-500 text-lg">Error: {error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters and Controls */}
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Search */}
				<div className="relative flex-1">
					<TextInput
						icon={HiSearch}
						placeholder="Search for nades, lineups, strategies..."
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
					{/* Type Filter */}
					<div className="flex items-center gap-3">
						<Select
							icon={HiFilter}
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							sizing="lg"
							className="w-full sm:w-auto min-w-[150px]"
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
							<option value="all">All Types</option>
							<option value="smoke">Smoke</option>
							<option value="flash">Flash</option>
							<option value="molotov">Molotov</option>
							<option value="grenade">Grenade</option>
						</Select>
					</div>

					{/* Side Filter */}
					<div className="flex items-center gap-3">
						<Select
							value={sideFilter}
							onChange={(e) => setSideFilter(e.target.value)}
							sizing="lg"
							className="w-full sm:w-auto min-w-[120px]"
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
							<option value="all">All Sides</option>
							<option value="T">Terrorist</option>
							<option value="CT">Counter-Terrorist</option>
						</Select>
					</div>
				</div>
			</div>

			{/* Results Count */}
			<div className="mb-6">
				<p className="text-gray-600">
					{loading
						? "Loading..."
						: `Showing ${filteredNades.length} of ${totalNades} nades`}
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
				/* Nades Grid */
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredNades.length === 0 ? (
							<div className="col-span-full text-center py-12">
								<p className="text-gray-500 text-lg">
									No nades found matching your criteria
								</p>
							</div>
						) : (
							filteredNades.map((nade) => (
								<NadeCard key={nade._id} nade={nade} mapName={mapName} />
							))
						)}
					</div>

					{/* Loading More Indicator */}
					{loadingMore && (
						<div className="flex justify-center py-8">
							<div className="flex items-center space-x-3">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
								<span className="text-gray-600">Loading more nades...</span>
							</div>
						</div>
					)}

					{/* Intersection Observer Target */}
					{hasNextPage && !loadingMore && filteredNades.length > 0 && (
						<div ref={observerRef} className="h-4" />
					)}

					{/* End of Results */}
					{!hasNextPage && filteredNades.length > 0 && (
						<div className="text-center py-8 border-t border-gray-200">
							<p className="text-gray-500">
								You&apos;ve reached the end of the list
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NadesList;