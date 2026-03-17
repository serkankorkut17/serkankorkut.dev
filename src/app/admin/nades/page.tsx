"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Select, TextInput } from "flowbite-react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { HiFilter, HiSearch } from "react-icons/hi";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import MyToast from "@/components/Helpers/MyToast";
import AuthContext from "@/contexts/AuthContext";
import type { ApiGetMapsResponse, ApiGetNadesResponse, Map, Nade } from "@/types/cs2";

export default function AdminNadesPage(): React.ReactElement {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const authLoading = auth?.loading;
	const router = useRouter();

	const [maps, setMaps] = useState<Map[]>([]);
	const [nades, setNades] = useState<Nade[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [mapFilter, setMapFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [sideFilter, setSideFilter] = useState("all");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [nadeToDelete, setNadeToDelete] = useState<Nade | null>(null);
	const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

	useEffect(() => {
		let mounted = true;
		const loadMaps = async () => {
			try {
				const res = await fetch("/api/maps?pageSize=200");
				const data = (await res.json().catch(() => ({}))) as ApiGetMapsResponse;
				if (!mounted) return;
				setMaps(Array.isArray(data.data) ? data.data : []);
			} catch {
				if (mounted) setMaps([]);
			}
		};
		void loadMaps();
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		const loadNades = async () => {
			try {
				setLoading(true);
				const params = new URLSearchParams();
				if (searchTerm.trim()) params.append("search", searchTerm.trim());
				if (mapFilter !== "all") params.append("map", mapFilter);
				if (typeFilter !== "all") params.append("type", typeFilter);
				if (sideFilter !== "all") params.append("side", sideFilter);
				const res = await fetch(`/api/nades?${params.toString()}`);
				const data = (await res.json().catch(() => ({}))) as ApiGetNadesResponse | { error?: string };
				if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load nades");
				if (!mounted) return;
				setNades(Array.isArray((data as ApiGetNadesResponse).data) ? (data as ApiGetNadesResponse).data : []);
			} catch (error) {
				if (!mounted) return;
				setToast({ type: "error", message: error instanceof Error ? error.message : "Failed to load nades" });
			} finally {
				if (mounted) setLoading(false);
			}
		};
		void loadNades();
		return () => {
			mounted = false;
		};
	}, [searchTerm, mapFilter, typeFilter, sideFilter]);

	const mapTitleByName = useMemo(() => {
		const mapData = new Map(maps.map((item) => [item.name, item.title]));
		return mapData;
	}, [maps]);

	const handleDelete = async () => {
		if (!nadeToDelete) return;

		setDeleting(true);
		try {
			const response = await fetch(`/api/nades/${encodeURIComponent(nadeToDelete._id)}`, {
				method: "DELETE",
			});
			const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

			if (!response.ok) {
				throw new Error(data.error || "Failed to delete nade");
			}

			setNades((prev) => prev.filter((item) => item._id !== nadeToDelete._id));
			setToast({ type: "success", message: data.message || "Nade deleted successfully" });
		} catch (error) {
			setToast({
				type: "error",
				message: error instanceof Error ? error.message : "Delete failed",
			});
		} finally {
			setDeleting(false);
			setShowDeleteModal(false);
			setNadeToDelete(null);
		}
	};

	if (authLoading || !user) {
		return <LoadingOverlay text="Loading admin nades..." />;
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
					label="Admin"
					title="Manage Nades"
					subtitle="Create and edit nades with video and frame captures."
				/>
				{toast ? <MyToast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

				<div className="flex flex-col lg:flex-row gap-3 mb-6">
					<div className="w-full lg:flex-1">
						<TextInput icon={HiSearch} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search nades" />
					</div>
					<div className="w-full lg:w-48">
						<Select icon={HiFilter} value={mapFilter} onChange={(e) => setMapFilter(e.target.value)}>
							<option value="all">All Maps</option>
							{maps.map((map) => (
								<option key={map._id} value={map.name}>{map.title}</option>
							))}
						</Select>
					</div>
					<div className="w-full lg:w-40">
						<Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
							<option value="all">All Types</option>
							<option value="flash">Flash</option>
							<option value="grenade">Grenade</option>
							<option value="molotov">Molotov</option>
							<option value="smoke">Smoke</option>
						</Select>
					</div>
					<div className="w-full lg:w-32">
						<Select value={sideFilter} onChange={(e) => setSideFilter(e.target.value)}>
							<option value="all">All Sides</option>
							<option value="T">T</option>
							<option value="CT">CT</option>
						</Select>
					</div>
					<div className="w-full lg:w-auto">
						<Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/admin/nades/new")}>
							<FaPlus className="mr-2" /> New Nade
						</Button>
					</div>
				</div>

				{loading ? (
					<LoadingOverlay text="Loading nades..." />
				) : nades.length === 0 ? (
					<div className="text-center text-gray-500 dark:text-gray-400 py-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">No nades found.</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{nades.map((nade) => (
							<article key={nade._id} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow">
								<div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800">
									<Image src={nade.images.location} alt={nade.name} fill className="object-cover" />
								</div>
								<div className="p-4 space-y-2">
									<div className="flex items-center justify-between">
										<h3 className="font-bold text-gray-900 dark:text-gray-100">{nade.name}</h3>
										<span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">{nade.type.toUpperCase()}</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-300">{mapTitleByName.get(nade.map) || nade.map} · {nade.side}</p>
									<p className="text-sm text-gray-500 line-clamp-2">{nade.description}</p>
									<div className="pt-2 flex items-center gap-2">
										<button
											onClick={() => router.push(`/admin/nades/edit/${nade._id}`)}
											className="inline-flex w-full items-center justify-center px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
											aria-label={`Edit ${nade.name}`}
										>
											<FaEdit className="mr-2" /> Edit
										</button>
										<button
											onClick={() => {
												setNadeToDelete(nade);
												setShowDeleteModal(true);
											}}
											className="inline-flex w-full items-center justify-center px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
											aria-label={`Delete ${nade.name}`}
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
					<ModalHeader>Delete Nade</ModalHeader>
					<ModalBody>
						<p className="text-gray-700 dark:text-gray-300">
							Are you sure you want to delete <strong>{nadeToDelete?.name}</strong>? This action cannot be undone.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button color="light" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
							Cancel
						</Button>
						<Button color="failure" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} disabled={deleting}>
							{deleting ? "Deleting..." : "Delete"}
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		</AuthGuard>
	);
}
