"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Select,
	TextInput,
} from "flowbite-react";
import { FaEdit, FaMapMarkedAlt, FaPlus, FaTrash } from "react-icons/fa";
import { HiFilter, HiSearch } from "react-icons/hi";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import MyToast from "@/components/Helpers/MyToast";
import AuthContext from "@/contexts/AuthContext";
import type { ApiGetMapsResponse, Map } from "@/types/cs2";

export default function AdminMapsPage(): React.ReactElement {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const authLoading = auth?.loading;
	const router = useRouter();

	const [maps, setMaps] = useState<Map[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [mapToDelete, setMapToDelete] = useState<Map | null>(null);
	const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
			const data = (await response.json()) as ApiGetMapsResponse | { error?: string };
			if (!response.ok) {
				throw new Error((data as { error?: string }).error || "Failed to fetch maps");
			}

			setMaps(Array.isArray((data as ApiGetMapsResponse).data) ? (data as ApiGetMapsResponse).data : []);
		} catch (err) {
			const error = err as Error;
			setToast({ type: "error", message: error.message || "Failed to load maps" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchMaps();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm, activeFilter]);

	const filteredMaps = useMemo(() => {
		return maps.filter((map) => {
			const matchesSearch =
				searchTerm === "" ||
				map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				map.name.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesActive =
				activeFilter === "all" ||
				(activeFilter === "active" && map.active) ||
				(activeFilter === "inactive" && !map.active);

			return matchesSearch && matchesActive;
		});
	}, [maps, searchTerm, activeFilter]);

	const handleDelete = async () => {
		if (!mapToDelete) return;

		setDeleting(true);
		try {
			const response = await fetch(`/api/maps/${encodeURIComponent(mapToDelete.name)}`, {
				method: "DELETE",
			});
			const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

			if (!response.ok) {
				throw new Error(data.error || "Failed to delete map");
			}

			setMaps((prev) => prev.filter((item) => item.name !== mapToDelete.name));
			setToast({ type: "success", message: data.message || "Map deleted successfully" });
		} catch (err) {
			const error = err as Error;
			setToast({ type: "error", message: error.message || "Delete failed" });
		} finally {
			setDeleting(false);
			setShowDeleteModal(false);
			setMapToDelete(null);
		}
	};

	if (authLoading || !user) {
		return <LoadingOverlay text="Loading admin maps..." />;
	}

	if (user.role !== "admin") {
		return (
			<AuthGuard>
				<div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
					<div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
						You do not have permission to access this page.
					</div>
				</div>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard>
			<div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
				<PageHeader
					icon={FaMapMarkedAlt}
					label="Admin"
					title="Manage CS2 Maps"
					subtitle="Add, update and remove maps for the public CS2 pages."
				/>

				{toast && (
					<MyToast
						type={toast.type}
						message={toast.message}
						onClose={() => setToast(null)}
					/>
				)}

				<div className="flex flex-col lg:flex-row gap-4 mb-6">
					<div className="w-full lg:flex-1">
						<TextInput
							icon={HiSearch}
							placeholder="Search by name, title or description"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="w-full lg:w-56">
						<Select
							icon={HiFilter}
							value={activeFilter}
							onChange={(e) => setActiveFilter(e.target.value as "all" | "active" | "inactive")}
						>
							<option value="all">All Maps</option>
							<option value="active">Active Only</option>
							<option value="inactive">Inactive Only</option>
						</Select>
					</div>
					<div className="w-full lg:w-auto">
						<Button
							onClick={() => router.push("/admin/maps/new")}
							className="w-full bg-orange-500 hover:bg-orange-600 text-white"
						>
							<FaPlus className="mr-2" />
							New Map
						</Button>
					</div>
				</div>

				{loading ? (
					<LoadingOverlay text="Loading maps..." />
				) : filteredMaps.length === 0 ? (
					<div className="text-center text-gray-500 dark:text-gray-400 py-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
						No maps found.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
						{filteredMaps.map((map) => (
							<article
								key={map._id}
								className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300"
							>
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src={map.image}
										alt={map.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
										className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
									<div className="absolute top-3 right-3">
										<span
											className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
												map.active
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{map.active ? "Active" : "Inactive"}
										</span>
									</div>
								</div>

								<div className="p-5 space-y-3">
									<div>
										<p className="text-xs tracking-wide uppercase text-gray-500 dark:text-gray-400">{map.name}</p>
										<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{map.title}</h3>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-10">
										{map.description}
									</p>

									<div className="flex items-center gap-2 pt-2">
										<button
											onClick={() => router.push(`/admin/maps/edit/${encodeURIComponent(map.name)}`)}
											className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
											aria-label={`Edit ${map.title}`}
										>
											<FaEdit className="mr-2" /> Edit
										</button>
										<button
											onClick={() => {
												setMapToDelete(map);
												setShowDeleteModal(true);
											}}
											className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
											aria-label={`Delete ${map.title}`}
										>
											<FaTrash className="mr-2" /> Delete
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}

				<Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
					<ModalHeader>Delete Map</ModalHeader>
					<ModalBody>
						<p className="text-gray-700 dark:text-gray-300">
							Are you sure you want to delete <strong>{mapToDelete?.title}</strong>? This action cannot be undone.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							color="light"
							onClick={() => setShowDeleteModal(false)}
							disabled={deleting}
						>
							Cancel
						</Button>
						<Button
							color="failure"
							onClick={handleDelete}
							disabled={deleting}
						>
							{deleting ? "Deleting..." : "Delete"}
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		</AuthGuard>
	);
}
