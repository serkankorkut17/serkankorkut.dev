"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import {
	FaBolt,
	FaChartBar,
	FaMapMarkedAlt,
	FaPlus,
	FaShieldAlt,
	FaBomb,
} from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import MyToast from "@/components/Helpers/MyToast";
import AuthContext from "@/contexts/AuthContext";
import type { ApiGetMapsResponse, ApiGetNadesResponse } from "@/types/cs2";

type DashboardStats = {
	mapsTotal: number;
	mapsActive: number;
	mapsInactive: number;
	nadesTotal: number;
	nadesSmoke: number;
	nadesFlash: number;
	nadesGrenade: number;
	nadesMolotov: number;
};

const INITIAL_STATS: DashboardStats = {
	mapsTotal: 0,
	mapsActive: 0,
	mapsInactive: 0,
	nadesTotal: 0,
	nadesSmoke: 0,
	nadesFlash: 0,
	nadesGrenade: 0,
	nadesMolotov: 0,
};

export default function AdminIndexPage(): React.ReactElement {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const authLoading = auth?.loading;
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
	const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

	useEffect(() => {
		let mounted = true;

		const loadStats = async () => {
			try {
				setLoading(true);

				const [mapsTotalRes, mapsActiveRes, mapsInactiveRes, nadesTotalRes, smokeRes, flashRes, grenadeRes, molotovRes] = await Promise.all([
					fetch("/api/maps?pageSize=1"),
					fetch("/api/maps?pageSize=1&active=true"),
					fetch("/api/maps?pageSize=1&active=false"),
					fetch("/api/nades?pageSize=1"),
					fetch("/api/nades?pageSize=1&type=smoke"),
					fetch("/api/nades?pageSize=1&type=flash"),
					fetch("/api/nades?pageSize=1&type=grenade"),
					fetch("/api/nades?pageSize=1&type=molotov"),
				]);

				if (!mapsTotalRes.ok || !mapsActiveRes.ok || !mapsInactiveRes.ok || !nadesTotalRes.ok || !smokeRes.ok || !flashRes.ok || !grenadeRes.ok || !molotovRes.ok) {
					throw new Error("Failed to load dashboard stats.");
				}

				const [mapsTotal, mapsActive, mapsInactive, nadesTotal, smoke, flash, grenade, molotov] =
					(await Promise.all([
						mapsTotalRes.json(),
						mapsActiveRes.json(),
						mapsInactiveRes.json(),
						nadesTotalRes.json(),
						smokeRes.json(),
						flashRes.json(),
						grenadeRes.json(),
						molotovRes.json(),
					])) as [
						ApiGetMapsResponse,
						ApiGetMapsResponse,
						ApiGetMapsResponse,
						ApiGetNadesResponse,
						ApiGetNadesResponse,
						ApiGetNadesResponse,
						ApiGetNadesResponse,
						ApiGetNadesResponse,
					];

				if (!mounted) return;

				setStats({
					mapsTotal: mapsTotal.total || 0,
					mapsActive: mapsActive.total || 0,
					mapsInactive: mapsInactive.total || 0,
					nadesTotal: nadesTotal.total || 0,
					nadesSmoke: smoke.total || 0,
					nadesFlash: flash.total || 0,
					nadesGrenade: grenade.total || 0,
					nadesMolotov: molotov.total || 0,
				});
			} catch (error) {
				if (!mounted) return;
				setToast({
					type: "error",
					message: error instanceof Error ? error.message : "Failed to load dashboard",
				});
			} finally {
				if (mounted) setLoading(false);
			}
		};

		void loadStats();

		return () => {
			mounted = false;
		};
	}, []);

	if (authLoading || !user) {
		return <LoadingOverlay text="Loading admin dashboard..." />;
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
					icon={FaChartBar}
					label="Admin"
					title="Dashboard"
					subtitle="Overview of maps and nade content health."
				/>

				{toast ? <MyToast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

				{loading ? (
					<LoadingOverlay text="Loading dashboard stats..." />
				) : (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
							<StatCard icon={FaMapMarkedAlt} title="Total Maps" value={stats.mapsTotal} accent="orange" />
							<StatCard icon={FaShieldAlt} title="Active Maps" value={stats.mapsActive} accent="green" />
							<StatCard icon={FaBolt} title="Inactive Maps" value={stats.mapsInactive} accent="red" />
							<StatCard icon={FaBomb} title="Total Nades" value={stats.nadesTotal} accent="blue" />
						</div>

						<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
							<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Nade Type Distribution</h2>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								<TypePill label="Smoke" value={stats.nadesSmoke} />
								<TypePill label="Flash" value={stats.nadesFlash} />
								<TypePill label="Grenade" value={stats.nadesGrenade} />
								<TypePill label="Molotov" value={stats.nadesMolotov} />
							</div>
						</div>

						<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
							<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
								<Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/admin/maps")}>Manage Maps</Button>
								<Button color="light" onClick={() => router.push("/admin/maps/new")}><FaPlus className="mr-2" />New Map</Button>
								<Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/admin/nades")}>Manage Nades</Button>
								<Button color="light" onClick={() => router.push("/admin/nades/new")}><FaPlus className="mr-2" />New Nade</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</AuthGuard>
	);
}

function StatCard({
	icon: Icon,
	title,
	value,
	accent,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	value: number;
	accent: "orange" | "green" | "red" | "blue";
}) {
	const accentClasses: Record<typeof accent, string> = {
		orange: "bg-orange-100 text-orange-700",
		green: "bg-green-100 text-green-700",
		red: "bg-red-100 text-red-700",
		blue: "bg-blue-100 text-blue-700",
	};

	return (
		<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
				<div className={`h-8 w-8 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
					<Icon className="h-4 w-4" />
				</div>
			</div>
			<p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
		</div>
	);
}

function TypePill({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-3 bg-gray-50 dark:bg-gray-800/60">
			<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
			<p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
		</div>
	);
}
