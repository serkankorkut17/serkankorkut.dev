"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Label, Spinner, TextInput, Textarea } from "flowbite-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import AuthGuard from "@/components/Helpers/AuthGuard";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import MyToast from "@/components/Helpers/MyToast";
import AuthContext from "@/contexts/AuthContext";

export default function NewMapPage(): React.ReactElement {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const authLoading = auth?.loading;
	const router = useRouter();

	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [active, setActive] = useState(true);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

	const handleImageChange = (file: File | null) => {
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}
		setImageFile(file);
		setImagePreview(file ? URL.createObjectURL(file) : null);
	};

	useEffect(() => {
		return () => {
			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!imageFile) {
			setToast({ type: "error", message: "Please select an image file." });
			return;
		}

		setSaving(true);
		try {
			const form = new FormData();
			form.append("name", name.trim().toLowerCase());
			form.append("title", title.trim());
			form.append("description", description.trim());
			form.append("active", String(active));
			form.append("image", imageFile);

			const response = await fetch("/api/maps", {
				method: "POST",
				body: form,
			});
			const data = (await response.json().catch(() => ({}))) as { error?: string };

			if (!response.ok) {
				throw new Error(data.error || "Failed to create map");
			}

			setToast({ type: "success", message: "Map created successfully." });
			router.push("/admin/maps");
		} catch (err) {
			const error = err as Error;
			setToast({ type: "error", message: error.message || "Create failed" });
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || !user) {
		return <LoadingOverlay text="Loading map editor..." />;
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
					title="Create New Map"
					subtitle="Add a new CS2 map with image and metadata."
					actionLink="/admin/maps"
					actionLabel="Back to Maps"
				/>

				{toast && (
					<MyToast
						type={toast.type}
						message={toast.message}
						onClose={() => setToast(null)}
					/>
				)}

				<form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-5 gap-6">
					<div className="xl:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
						<div>
							<Label htmlFor="name" className="mb-1 block">
								Map Name (URL key)
							</Label>
							<TextInput
								id="name"
								name="name"
								placeholder="mirage"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							<p className="text-xs text-gray-500 mt-1">Use lowercase letters and dashes. Example: ancient</p>
						</div>

						<div>
							<Label htmlFor="title" className="mb-1 block">
								Map Title
							</Label>
							<TextInput
								id="title"
								name="title"
								placeholder="Mirage"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div>
							<Label htmlFor="description" className="mb-1 block">
								Description
							</Label>
							<Textarea
								id="description"
								name="description"
								rows={5}
								placeholder="Brief map description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						<div>
							<Label htmlFor="image" className="mb-1 block">
								Map Image
							</Label>
							<input
								id="image"
								name="image"
								type="file"
								accept="image/*"
								onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
								required
							/>
						</div>

						<div className="flex items-center gap-2">
							<input
								id="active"
								type="checkbox"
								checked={active}
								onChange={(e) => setActive(e.target.checked)}
								className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
							/>
							<Label htmlFor="active">Active map</Label>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<Button
								type="submit"
								className="bg-orange-500 hover:bg-orange-600 text-white"
								disabled={saving}
							>
								{saving ? (
									<div className="flex items-center gap-2">
										<Spinner size="sm" />
										Saving...
									</div>
								) : (
									"Create Map"
								)}
							</Button>
							<Button color="light" onClick={() => router.push("/admin/maps")} type="button">
								Cancel
							</Button>
						</div>
					</div>

					<div className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
						<p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Live Preview</p>
						<div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
							<div className="relative h-56 w-full bg-gray-100 dark:bg-gray-800">
								{imagePreview ? (
									<Image
										src={imagePreview}
										alt={title || "Map preview"}
										fill
										className="object-cover"
									/>
								) : (
									<div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
										Select an image to preview
									</div>
								)}
							</div>
							<div className="p-4">
								<p className="text-xs uppercase tracking-wide text-gray-500">{name || "map-name"}</p>
								<h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title || "Map Title"}</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
									{description || "Description preview will appear here."}
								</p>
							</div>
						</div>
					</div>
				</form>
			</div>
		</AuthGuard>
	);
}
