"use client";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import { FaCamera, FaPlus, FaTrash } from "react-icons/fa";
import LoadingOverlay from "@/components/Helpers/LoadingOverlay";
import MyToast from "@/components/Helpers/MyToast";
import AuthGuard from "@/components/Helpers/AuthGuard";
import AuthContext from "@/contexts/AuthContext";
import nadeSuggestions from "@/data/NadeSuggestions.json";
import type { Map, Nade } from "@/types/cs2";

type FrameCapture = {
	file: File | null;
	previewUrl: string;
	label: string;
};

type NadeEditorProps = {
	mode: "create" | "edit";
	nadeId?: string;
};

const TYPE_OPTIONS = ["flash", "grenade", "molotov", "smoke"].map((value) => ({
	value,
	label: value.toUpperCase(),
}));

const SIDE_OPTIONS = [
	{ value: "T", label: "T" },
	{ value: "CT", label: "CT" },
];

const POSITION_LANDING_SUGGESTIONS = nadeSuggestions.positionLanding as string[];
const THROW_SUGGESTIONS = nadeSuggestions.throw as string[];
const DESCRIPTION_SUGGESTIONS = nadeSuggestions.description as string[];

export default function NadeEditor({ mode, nadeId }: NadeEditorProps): React.ReactElement {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const authLoading = auth?.loading;
	const router = useRouter();

	const [maps, setMaps] = useState<Map[]>([]);
	const [mapsLoading, setMapsLoading] = useState(true);
	const [loadingNade, setLoadingNade] = useState(mode === "edit");

	const [name, setName] = useState("");
	const [mapName, setMapName] = useState("");
	const [type, setType] = useState("smoke");
	const [side, setSide] = useState("T");
	const [position, setPosition] = useState("");
	const [landing, setLanding] = useState("");
	const [description, setDescription] = useState("");
	const [throwText, setThrowText] = useState("");

	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string>("");

	const [locationFrame, setLocationFrame] = useState<FrameCapture | null>(null);
	const [placementFrame, setPlacementFrame] = useState<FrameCapture | null>(null);
	const [landFrame, setLandFrame] = useState<FrameCapture | null>(null);
	const [lineupFrames, setLineupFrames] = useState<FrameCapture[]>([]);

	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
	const [showThrowSuggestions, setShowThrowSuggestions] = useState(false);
	const [activeThrowLine, setActiveThrowLine] = useState("");
	const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const throwTextareaRef = useRef<HTMLTextAreaElement | null>(null);
	const hideThrowSuggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hideDescriptionSuggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const cleanupUrl = useCallback((url?: string) => {
		if (url && url.startsWith("blob:")) {
			URL.revokeObjectURL(url);
		}
	}, []);

	const resetFrame = useCallback(
		(frame: FrameCapture | null) => {
			if (!frame) return;
			cleanupUrl(frame.previewUrl);
		},
		[cleanupUrl]
	);

	useEffect(() => {
		return () => {
			if (hideThrowSuggestionsTimeoutRef.current) {
				clearTimeout(hideThrowSuggestionsTimeoutRef.current);
			}
			if (hideDescriptionSuggestionsTimeoutRef.current) {
				clearTimeout(hideDescriptionSuggestionsTimeoutRef.current);
			}
			cleanupUrl(videoUrl);
			resetFrame(locationFrame);
			resetFrame(placementFrame);
			resetFrame(landFrame);
			lineupFrames.forEach((frame) => cleanupUrl(frame.previewUrl));
		};
	}, [videoUrl, locationFrame, placementFrame, landFrame, lineupFrames, cleanupUrl, resetFrame]);

	useEffect(() => {
		let mounted = true;
		const loadMaps = async () => {
			try {
				const response = await fetch("/api/maps?pageSize=200");
				const payload = (await response.json().catch(() => ({}))) as {
					data?: Map[];
				};
				if (!mounted) return;
				const mapItems = Array.isArray(payload.data) ? payload.data : [];
				setMaps(mapItems);
				if (!mapName && mapItems.length > 0) {
					setMapName(mapItems[0].name);
				}
			} catch {
				if (mounted) {
					setToast({ type: "error", message: "Failed to load maps." });
				}
			} finally {
				if (mounted) {
					setMapsLoading(false);
				}
			}
		};
		void loadMaps();
		return () => {
			mounted = false;
		};
	}, [mapName]);

	useEffect(() => {
		if (mode !== "edit" || !nadeId) return;
		let mounted = true;

		const loadNade = async () => {
			try {
				setLoadingNade(true);
				const response = await fetch(`/api/nades/${encodeURIComponent(nadeId)}`);
				const payload = (await response.json().catch(() => ({}))) as Nade | { error?: string };
				if (!response.ok) {
					throw new Error((payload as { error?: string }).error || "Failed to load nade");
				}
				if (!mounted) return;

				const nade = payload as Nade;
				setName(nade.name);
				setMapName(nade.map);
				setType(nade.type);
				setSide(nade.side);
				setPosition(nade.position);
				setLanding(nade.landing);
				setDescription(nade.description);
				setThrowText((nade.throw || []).join("\n"));
				setVideoUrl(nade.video || "");
				setLocationFrame(
					nade.images?.location
						? { file: null, previewUrl: nade.images.location, label: "location.png" }
						: null
				);
				setPlacementFrame(
					nade.images?.placement
						? { file: null, previewUrl: nade.images.placement, label: "placement.png" }
						: null
				);
				setLandFrame(
					nade.images?.land
						? { file: null, previewUrl: nade.images.land, label: "land.png" }
						: null
				);
				setLineupFrames(
					(nade.images?.lineup || []).map((url, index) => ({
						file: null,
						previewUrl: url,
						label: `lineup-${index + 1}.png`,
					}))
				);
			} catch (error) {
				if (mounted) {
					setToast({
						type: "error",
						message:
							error instanceof Error ? error.message : "Failed to load nade details.",
					});
				}
			} finally {
				if (mounted) {
					setLoadingNade(false);
				}
			}
		};

		void loadNade();
		return () => {
			mounted = false;
		};
	}, [mode, nadeId]);

	const captureFrame = async (target: "location" | "placement" | "land" | "lineup") => {
		if (!videoRef.current || !canvasRef.current) {
			setToast({ type: "error", message: "Please upload and load a video first." });
			return;
		}

		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video.videoWidth || !video.videoHeight) {
			setToast({ type: "error", message: "Video is not ready for capture yet." });
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			setToast({ type: "error", message: "Cannot initialize canvas context." });
			return;
		}
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		const blob = await new Promise<Blob | null>((resolve) => {
			canvas.toBlob((value) => resolve(value), "image/png");
		});

		if (!blob) {
			setToast({ type: "error", message: "Failed to capture frame." });
			return;
		}

		const preview = URL.createObjectURL(blob);
		if (target === "lineup") {
			const nextIndex = lineupFrames.length + 1;
			const file = new File([blob], `lineup-${nextIndex}.png`, { type: "image/png" });
			setLineupFrames((prev) => [
				...prev,
				{ file, previewUrl: preview, label: `lineup-${nextIndex}.png` },
			]);
			return;
		}

		const filename = `${target}.png`;
		const frame: FrameCapture = {
			file: new File([blob], filename, { type: "image/png" }),
			previewUrl: preview,
			label: filename,
		};

		if (target === "location") {
			resetFrame(locationFrame);
			setLocationFrame(frame);
		}
		if (target === "placement") {
			resetFrame(placementFrame);
			setPlacementFrame(frame);
		}
		if (target === "land") {
			resetFrame(landFrame);
			setLandFrame(frame);
		}
	};

	const removeLineupFrame = (index: number) => {
		setLineupFrames((prev) => {
			const frame = prev[index];
			if (frame) cleanupUrl(frame.previewUrl);
			return prev
				.filter((_, idx) => idx !== index)
				.map((item, idx) => ({ ...item, label: `lineup-${idx + 1}.png` }));
		});
	};

	const validateForCreate = useMemo(() => {
		if (mode !== "create") return true;
		return (
			Boolean(videoFile) &&
			Boolean(locationFrame?.file) &&
			Boolean(placementFrame?.file) &&
			Boolean(landFrame?.file) &&
			lineupFrames.some((frame) => Boolean(frame.file))
		);
	}, [mode, videoFile, locationFrame, placementFrame, landFrame, lineupFrames]);

	const handleVideoChange = (file: File | null) => {
		cleanupUrl(videoUrl);
		setVideoFile(file);
		setVideoUrl(file ? URL.createObjectURL(file) : "");
	};

	const getCurrentLineBounds = useCallback((value: string, cursor: number) => {
		const safeCursor = Math.max(0, Math.min(cursor, value.length));
		const lineStart = value.lastIndexOf("\n", safeCursor - 1) + 1;
		const nextNewline = value.indexOf("\n", safeCursor);
		const lineEnd = nextNewline === -1 ? value.length : nextNewline;
		return { lineStart, lineEnd, cursor: safeCursor };
	}, []);

	const syncActiveThrowLine = useCallback(
		(value: string, cursor: number) => {
			const { lineStart, cursor: safeCursor } = getCurrentLineBounds(value, cursor);
			setActiveThrowLine(value.slice(lineStart, safeCursor).trim());
		},
		[getCurrentLineBounds]
	);

	const filteredThrowSuggestions = useMemo(() => {
		const query = activeThrowLine.toLowerCase();
		if (!query) return THROW_SUGGESTIONS;
		return THROW_SUGGESTIONS.filter((item) => item.toLowerCase().includes(query));
	}, [activeThrowLine]);

	const filteredDescriptionSuggestions = useMemo(() => {
		const query = description.trim().toLowerCase();
		if (!query) return DESCRIPTION_SUGGESTIONS;
		return DESCRIPTION_SUGGESTIONS.filter((item) => item.toLowerCase().includes(query));
	}, [description]);

	const applyThrowSuggestion = (suggestion: string) => {
		const textarea = throwTextareaRef.current;
		if (!textarea) return;

		const value = throwText;
		const cursor = textarea.selectionStart ?? value.length;
		const { lineStart, lineEnd } = getCurrentLineBounds(value, cursor);
		const nextValue = `${value.slice(0, lineStart)}${suggestion}${value.slice(lineEnd)}`;
		setThrowText(nextValue);
		setActiveThrowLine(suggestion);
		setShowThrowSuggestions(false);

		requestAnimationFrame(() => {
			if (!throwTextareaRef.current) return;
			const nextCursor = lineStart + suggestion.length;
			throwTextareaRef.current.focus();
			throwTextareaRef.current.setSelectionRange(nextCursor, nextCursor);
		});
	};

	const applyDescriptionSuggestion = (suggestion: string) => {
		setDescription(suggestion);
		setShowDescriptionSuggestions(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mode === "create" && !validateForCreate) {
			setToast({
				type: "error",
				message: "Video, location, placement, land and at least one lineup frame are required.",
			});
			return;
		}

		setSaving(true);
		try {
			const throws = throwText
				.split(/[\n,]/)
				.map((item) => item.trim())
				.filter(Boolean);

			const lineupKeepUrls = lineupFrames
				.filter((frame) => frame.file === null)
				.map((frame) => frame.previewUrl)
				.filter((url) => /^https?:\/\//.test(url));

			const form = new FormData();
			form.append("name", name.trim());
			form.append("map", mapName);
			form.append("type", type);
			form.append("side", side);
			form.append("position", position.trim());
			form.append("landing", landing.trim());
			form.append("description", description.trim());
			form.append("throw", JSON.stringify(throws));
			form.append("lineupKeepUrls", JSON.stringify(lineupKeepUrls));

			if (videoFile) form.append("video", videoFile);
			if (locationFrame?.file) form.append("locationImage", locationFrame.file);
			if (placementFrame?.file) form.append("placementImage", placementFrame.file);
			if (landFrame?.file) form.append("landImage", landFrame.file);
			lineupFrames.forEach((frame) => {
				if (frame.file) form.append("lineupImages", frame.file);
			});

			const endpoint = mode === "create" ? "/api/nades" : `/api/nades/${encodeURIComponent(String(nadeId))}`;
			const method = mode === "create" ? "POST" : "PUT";

			const response = await fetch(endpoint, {
				method,
				body: form,
			});
			const payload = (await response.json().catch(() => ({}))) as { error?: string };

			if (!response.ok) {
				throw new Error(payload.error || "Failed to save nade");
			}

			setToast({
				type: "success",
				message: mode === "create" ? "Nade created successfully." : "Nade updated successfully.",
			});
			router.push("/admin/nades");
		} catch (error) {
			setToast({
				type: "error",
				message: error instanceof Error ? error.message : "Save failed",
			});
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || mapsLoading || loadingNade) {
		return <LoadingOverlay text="Loading nade editor..." />;
	}

	if (!user) {
		return <LoadingOverlay text="Checking authentication..." />;
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
			<div>
				{toast ? (
					<MyToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
				) : null}

				<form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-8 gap-6">
					<div className="xl:col-span-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name" className="mb-1 block">Nade Name</Label>
								<TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} required />
							</div>
							<div>
								<Label htmlFor="map" className="mb-1 block">Map</Label>
								<Select id="map" value={mapName} onChange={(e) => setMapName(e.target.value)} required>
									{maps.map((mapItem) => (
										<option key={mapItem._id} value={mapItem.name}>{mapItem.title}</option>
									))}
								</Select>
							</div>
							<div>
								<Label htmlFor="type" className="mb-1 block">Type</Label>
								<Select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
									{TYPE_OPTIONS.map((item) => (
										<option key={item.value} value={item.value}>{item.label}</option>
									))}
								</Select>
							</div>
							<div>
								<Label htmlFor="side" className="mb-1 block">Side</Label>
								<Select id="side" value={side} onChange={(e) => setSide(e.target.value)} required>
									{SIDE_OPTIONS.map((item) => (
										<option key={item.value} value={item.value}>{item.label}</option>
									))}
								</Select>
							</div>
							<div>
								<Label htmlFor="position" className="mb-1 block">Position</Label>
								<TextInput id="position" list="position-suggestions" value={position} onChange={(e) => setPosition(e.target.value)} required />
							</div>
							<div>
								<Label htmlFor="landing" className="mb-1 block">Landing</Label>
								<TextInput id="landing" list="landing-suggestions" value={landing} onChange={(e) => setLanding(e.target.value)} required />
							</div>
						</div>

						<datalist id="position-suggestions">
							{POSITION_LANDING_SUGGESTIONS.map((item) => (
								<option key={`position-${item}`} value={item} />
							))}
						</datalist>
						<datalist id="landing-suggestions">
							{POSITION_LANDING_SUGGESTIONS.map((item) => (
								<option key={`landing-${item}`} value={item} />
							))}
						</datalist>

						<div>
							<Label htmlFor="throw" className="mb-1 block">Throw (comma or new line)</Label>
							<div className="relative">
								<Textarea
									id="throw"
									ref={throwTextareaRef}
									rows={4}
									value={throwText}
									onChange={(e) => {
										setThrowText(e.target.value);
										syncActiveThrowLine(e.target.value, e.target.selectionStart ?? e.target.value.length);
										setShowThrowSuggestions(true);
									}}
									onFocus={(e) => {
										if (hideThrowSuggestionsTimeoutRef.current) {
											clearTimeout(hideThrowSuggestionsTimeoutRef.current);
										}
										syncActiveThrowLine(e.target.value, e.target.selectionStart ?? e.target.value.length);
										setShowThrowSuggestions(true);
									}}
									onClick={(e) => {
										syncActiveThrowLine(e.currentTarget.value, e.currentTarget.selectionStart ?? e.currentTarget.value.length);
									}}
									onKeyUp={(e) => {
										syncActiveThrowLine(e.currentTarget.value, e.currentTarget.selectionStart ?? e.currentTarget.value.length);
									}}
									onBlur={() => {
										hideThrowSuggestionsTimeoutRef.current = setTimeout(() => {
											setShowThrowSuggestions(false);
										}, 120);
									}}
									placeholder="One throw type per line or comma separated"
									required
								/>
								{showThrowSuggestions && filteredThrowSuggestions.length > 0 ? (
									<div className="absolute z-20 mt-1 w-full max-h-44 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
										{filteredThrowSuggestions.map((item) => (
											<button
												key={`throw-${item}`}
												type="button"
												onMouseDown={(event) => event.preventDefault()}
												onClick={() => applyThrowSuggestion(item)}
												className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800"
											>
												{item}
											</button>
										))}
									</div>
								) : null}
							</div>
						</div>

						<div>
							<Label htmlFor="description" className="mb-1 block">Description</Label>
							<div className="relative">
								<Textarea
									id="description"
									rows={4}
									value={description}
									onChange={(e) => {
										setDescription(e.target.value);
										setShowDescriptionSuggestions(true);
									}}
									onFocus={() => {
										if (hideDescriptionSuggestionsTimeoutRef.current) {
											clearTimeout(hideDescriptionSuggestionsTimeoutRef.current);
										}
										setShowDescriptionSuggestions(true);
									}}
									onBlur={() => {
										hideDescriptionSuggestionsTimeoutRef.current = setTimeout(() => {
											setShowDescriptionSuggestions(false);
										}, 120);
									}}
									required
								/>
								{showDescriptionSuggestions && filteredDescriptionSuggestions.length > 0 ? (
									<div className="absolute z-20 mt-1 w-full max-h-52 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
										{filteredDescriptionSuggestions.map((item) => (
											<button
												key={`description-${item}`}
												type="button"
												onMouseDown={(event) => event.preventDefault()}
												onClick={() => applyDescriptionSuggestion(item)}
												className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800"
											>
												{item}
											</button>
										))}
									</div>
								) : null}
							</div>
						</div>

						<div>
							<Label htmlFor="video" className="mb-1 block">Video Upload</Label>
							<input
								id="video"
								type="file"
								accept="video/*"
								onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
							/>
						</div>

						{videoUrl ? (
							<div className="space-y-4 rounded-2xl border border-orange-200/70 dark:border-orange-800/50 bg-orange-50/40 dark:bg-gray-950/40 p-4 md:p-5">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
									<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Frame Capture Preview</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">Pause on the exact frame, then capture.</p>
								</div>
								<div className="relative w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-black aspect-video">
									<video
										ref={videoRef}
										src={videoUrl}
										controls
										crossOrigin="anonymous"
										className="h-full w-full object-contain bg-black"
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
									<Button type="button" color="light" className="w-full" onClick={() => void captureFrame("location")}>
										<FaCamera className="mr-2" /> location.png
									</Button>
									<Button type="button" color="light" className="w-full" onClick={() => void captureFrame("placement")}>
										<FaCamera className="mr-2" /> placement.png
									</Button>
									<Button type="button" color="light" className="w-full" onClick={() => void captureFrame("land")}>
										<FaCamera className="mr-2" /> land.png
									</Button>
									<Button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => void captureFrame("lineup")}>
										<FaPlus className="mr-2" /> Add lineup
									</Button>
								</div>
							</div>
						) : null}

						<canvas ref={canvasRef} className="hidden" />

						<div className="flex items-center gap-3 pt-2">
							<Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={saving}>
								{saving ? (
									<div className="flex items-center gap-2"><Spinner size="sm" /> Saving...</div>
								) : mode === "create" ? "Create Nade" : "Save Changes"}
							</Button>
							<Button type="button" color="light" onClick={() => router.push("/admin/nades")}>Cancel</Button>
						</div>
					</div>

					<div className="xl:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
						<p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Captured Frames</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FrameCard title="location.png" frame={locationFrame} />
							<FrameCard title="placement.png" frame={placementFrame} />
							<FrameCard title="land.png" frame={landFrame} />
						</div>

						<div className="space-y-3">
							<p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Lineup Frames</p>
							{lineupFrames.length === 0 ? (
								<div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-500">
									No lineup frames captured yet.
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{lineupFrames.map((frame, index) => (
										<div key={`${frame.label}-${index}`} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
											<div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800">
												<Image src={frame.previewUrl} alt={frame.label} fill className="object-cover" />
											</div>
											<div className="px-3 py-2 flex items-center justify-between">
												<span className="text-xs text-gray-600 dark:text-gray-300">{frame.label}</span>
												<button type="button" onClick={() => removeLineupFrame(index)} className="text-red-500 hover:text-red-600">
													<FaTrash />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</form>
			</div>
		</AuthGuard>
	);
}

function FrameCard({ title, frame }: { title: string; frame: FrameCapture | null }) {
	return (
		<div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800">
				{frame?.previewUrl ? (
					<Image src={frame.previewUrl} alt={title} fill className="object-cover" />
				) : (
					<div className="h-full w-full flex items-center justify-center text-xs text-gray-500">Not captured</div>
				)}
			</div>
			<div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{title}</div>
		</div>
	);
}
