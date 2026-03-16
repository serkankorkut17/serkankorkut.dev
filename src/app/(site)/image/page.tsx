"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import Image from "next/image";
import {
	Badge,
	Button,
	Card,
	FileInput,
	Label,
	RangeSlider,
	Select,
} from "flowbite-react";
import { HiDownload, HiPhotograph } from "react-icons/hi";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/Sections/PageHeader";

type QueueStatus = "idle" | "converting" | "done" | "error";

type QueueItem = {
	id: string;
	file: File;
	fileName: string;
	originalSize: number;
	originalType: string;
	originalUrl: string;
	status: QueueStatus;
	convertedBlob?: Blob;
	convertedSize?: number;
	convertedUrl?: string;
	originalWidth?: number;
	originalHeight?: number;
	outputWidth?: number;
	outputHeight?: number;
	error?: string;
};

const DEFAULT_QUALITY = 75;
const DEFAULT_EFFORT = 4;
const DEFAULT_MAX_DIMENSION = 0;
const HEIC_EXTENSIONS = ["heic", "heif"];
const RESOLUTION_OPTIONS = [0, 3840, 2560, 1920, 1600, 1280, 1024, 768];

const formatBytes = (bytes: number) => {
	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB"];
	const unitIndex = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1
	);
	const value = bytes / 1024 ** unitIndex;

	return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

const getFileExtension = (fileName: string) => {
	const parts = fileName.split(".");
	return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? "" : "";
};

const isHeicFile = (file: File) => {
	return (
		file.type.includes("heic") ||
		file.type.includes("heif") ||
		HEIC_EXTENSIONS.includes(getFileExtension(file.name))
	);
};

const getOutputName = (fileName: string) => {
	const lastDotIndex = fileName.lastIndexOf(".");
	const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

	return `${baseName}.webp`;
};

const createQueueItemId = () => {
	if (typeof globalThis.crypto?.randomUUID === "function") {
		return globalThis.crypto.randomUUID();
	}

	return `image-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const triggerDownload = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");

	anchor.href = url;
	anchor.download = fileName;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);

	URL.revokeObjectURL(url);
};



const getCompressionLabel = (originalSize: number, convertedSize?: number) => {
	if (!convertedSize || originalSize === 0) {
		return null;
	}

	const ratio = ((originalSize - convertedSize) / originalSize) * 100;
	const prefix = ratio >= 0 ? "-" : "+";

	return `${prefix}${Math.abs(ratio).toFixed(1)}%`;
};

const ImageConverterPage: React.FC = () => {
	const t = useTranslations("ImagePage");
	const queueRef = useRef<QueueItem[]>([]);
	const [fileInputKey, setFileInputKey] = useState(0);
	const [quality, setQuality] = useState<number>(DEFAULT_QUALITY);
	const [effort, setEffort] = useState<number>(DEFAULT_EFFORT);
	const [maxDimension, setMaxDimension] = useState<number>(DEFAULT_MAX_DIMENSION);
	const [queue, setQueue] = useState<QueueItem[]>([]);
	const [isBatchProcessing, setIsBatchProcessing] = useState(false);

	useEffect(() => {
		queueRef.current = queue;
	}, [queue]);

	useEffect(() => {
		return () => {
			queueRef.current.forEach((item) => {
				URL.revokeObjectURL(item.originalUrl);
				if (item.convertedUrl) {
					URL.revokeObjectURL(item.convertedUrl);
				}
			});
		};
	}, []);

	const updateQueueItem = (id: string, updater: (item: QueueItem) => QueueItem) => {
		setQueue((currentQueue) =>
			currentQueue.map((item) => (item.id === id ? updater(item) : item))
		);
	};

	const normalizeBlob = async (file: File) => {
		if (!isHeicFile(file)) {
			return file;
		}

		const heic2anyModule = await import("heic2any");
		const conversionResult = await heic2anyModule.default({
			blob: file,
			toType: "image/png",
		});

		const blob = Array.isArray(conversionResult)
			? conversionResult[0]
			: conversionResult;

		return new File([blob], file.name.replace(/\.[^.]+$/, ".png"), {
			type: "image/png",
		});
	};

	const convertItem = async (id: string) => {
		const targetItem = queueRef.current.find((item) => item.id === id);
		if (!targetItem) {
			return;
		}

		updateQueueItem(id, (item) => ({
			...item,
			status: "converting",
			error: undefined,
		}));

		try {
			const normalizedFile = await normalizeBlob(targetItem.file);
			const formData = new FormData();
			formData.append("file", normalizedFile);
			formData.append("quality", quality.toString());
			formData.append("effort", effort.toString());
			formData.append("maxDimension", maxDimension.toString());

			const response = await fetch("/api/image/convert", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Conversion failed");
			}

			const result = await response.json();
			const binaryString = atob(result.base64Data);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			const convertedBlob = new Blob([bytes], { type: "image/webp" });
			const convertedUrl = URL.createObjectURL(convertedBlob);

			updateQueueItem(id, (item) => {
				if (item.convertedUrl) {
					URL.revokeObjectURL(item.convertedUrl);
				}

				return {
					...item,
					status: "done",
					convertedBlob,
					convertedSize: result.convertedSize,
					convertedUrl,
					originalWidth: result.metadata.originalWidth,
					originalHeight: result.metadata.originalHeight,
					outputWidth: result.metadata.width,
					outputHeight: result.metadata.height,
					error: undefined,
				};
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("status.unknownError");

			updateQueueItem(id, (item) => ({
				...item,
				status: "error",
				error: errorMessage,
			}));
		}
	};

	const convertAllItems = async () => {
		if (queueRef.current.length === 0 || isBatchProcessing) {
			return;
		}

		setIsBatchProcessing(true);

		try {
			for (const item of queueRef.current) {
				await convertItem(item.id);
			}
		} finally {
			setIsBatchProcessing(false);
		}
	};

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files ?? []);
		if (selectedFiles.length === 0) {
			return;
		}

		const nextItems: QueueItem[] = selectedFiles.map((file) => ({
			id: createQueueItemId(),
			file,
			fileName: file.name,
			originalSize: file.size,
			originalType: file.type || getFileExtension(file.name) || "image",
			originalUrl: URL.createObjectURL(file),
			status: "idle",
		}));

		setQueue((currentQueue) => [...currentQueue, ...nextItems]);
		setFileInputKey((currentKey) => currentKey + 1);
	};

	const handleRemoveItem = (id: string) => {
		setQueue((currentQueue) => {
			const targetItem = currentQueue.find((item) => item.id === id);
			if (targetItem) {
				URL.revokeObjectURL(targetItem.originalUrl);
				if (targetItem.convertedUrl) {
					URL.revokeObjectURL(targetItem.convertedUrl);
				}
			}

			return currentQueue.filter((item) => item.id !== id);
		});
	};

	const handleClearQueue = () => {
		queueRef.current.forEach((item) => {
			URL.revokeObjectURL(item.originalUrl);
			if (item.convertedUrl) {
				URL.revokeObjectURL(item.convertedUrl);
			}
		});

		setQueue([]);
	};

	const downloadSingleItem = (item: QueueItem) => {
		if (!item.convertedBlob) {
			return;
		}

		triggerDownload(item.convertedBlob, getOutputName(item.fileName));
	};

	const downloadAllAsZip = async () => {
		const completedItems = queue.filter(
			(item) => item.status === "done" && item.convertedBlob
		);
		if (completedItems.length === 0) {
			return;
		}

		const zip = new JSZip();
		completedItems.forEach((item) => {
			if (item.convertedBlob) {
				zip.file(getOutputName(item.fileName), item.convertedBlob);
			}
		});

		const zipBlob = await zip.generateAsync({ type: "blob" });
		triggerDownload(zipBlob, "converted-webp-files.zip");
	};

	const convertedCount = queue.filter((item) => item.status === "done").length;
	const totalOriginalSize = queue.reduce((total, item) => total + item.originalSize, 0);
	const totalConvertedSize = queue.reduce(
		(total, item) => total + (item.convertedSize ?? 0),
		0
	);
	const totalCompression =
		totalOriginalSize > 0 && totalConvertedSize > 0
			? ((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100
			: 0;
	const resolutionProfileLabel =
		maxDimension > 0
			? t("settings.resolutionOptionMaxShort", { value: maxDimension.toString() })
			: t("settings.resolutionOriginalShort");

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950">
			<PageHeader title={t("title")} />
			<div className="bg-white py-16 dark:bg-gray-900">
				<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
					<div className="lg:col-span-1 lg:h-[calc(100vh-120px)]">
						<Card className="h-full overflow-hidden lg:min-h-[640px]">
							<div className="flex h-full flex-col gap-6 overflow-y-auto">
								<div className="space-y-6 pr-2">
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Label htmlFor="imageFiles" className="text-base font-semibold">
												{t("upload.label")}
											</Label>
											<Badge color="indigo" size="xs">
												{t("upload.badge")}
											</Badge>
										</div>
										<FileInput
											key={fileInputKey}
											id="imageFiles"
											accept="image/*,.heic,.heif"
											multiple
											onChange={handleFileUpload}
										/>
										<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
											{t("upload.helper")}
										</p>
									</div>

									<div className="space-y-5 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label className="text-base font-semibold">
													{t("settings.quality")}
												</Label>
												<Badge color="info">{quality}%</Badge>
											</div>
											<RangeSlider
												id="quality"
												min={1}
												max={100}
												value={quality}
												onChange={(event) => setQuality(Number(event.target.value))}
											/>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{t("settings.qualityHelper")}
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label htmlFor="effort" className="text-base font-semibold">
													{t("settings.effort")}
												</Label>
												<Badge color="purple">{effort}</Badge>
											</div>
											<Select
												id="effort"
												value={effort}
												onChange={(event) => setEffort(Number(event.target.value))}
											>
												{Array.from({ length: 7 }, (_, index) => (
													<option key={index} value={index}>
														{t("settings.effortOption", { value: index.toString() })}
													</option>
												))}
											</Select>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{t("settings.effortHelper")}
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label htmlFor="maxDimension" className="text-base font-semibold">
													{t("settings.resolution")}
												</Label>
												<Badge color="warning">
													{resolutionProfileLabel}
												</Badge>
											</div>
											<Select
												id="maxDimension"
												value={maxDimension}
												onChange={(event) => setMaxDimension(Number(event.target.value))}
											>
												{RESOLUTION_OPTIONS.map((option) => (
													<option key={option} value={option}>
														{option === 0
															? t("settings.resolutionOptionOriginal")
															: t("settings.resolutionOptionMax", {
																	value: option.toString(),
															  })}
													</option>
												))}
											</Select>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{t("settings.resolutionHelper")}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
											<p className="text-2xl font-extrabold text-gray-900 dark:text-white">
												{queue.length}
											</p>
											<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
												{t("summary.totalFiles")}
											</p>
										</div>
										<div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
											<p className="text-2xl font-extrabold text-gray-900 dark:text-white">
												{convertedCount}
											</p>
											<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
												{t("summary.converted")}
											</p>
										</div>
									</div>
								</div>

								<div className="sticky bottom-0 mt-auto space-y-3 border-t border-gray-200 bg-white pt-4 dark:border-gray-700 dark:bg-gray-800">
									<Button
										onClick={convertAllItems}
										disabled={queue.length === 0 || isBatchProcessing}
										color="blue"
										className="h-11 w-full justify-center text-sm font-semibold"
									>
										{isBatchProcessing ? t("actions.converting") : t("actions.convertAll")}
									</Button>
									<Button
										onClick={downloadAllAsZip}
										disabled={convertedCount === 0}
										className="h-11 w-full justify-center bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600"
									>
										<HiDownload className="mr-2 h-4 w-4" />
										{t("actions.downloadZip")}
									</Button>
									<Button
										onClick={handleClearQueue}
										disabled={queue.length === 0 || isBatchProcessing}
										color="light"
										className="h-11 w-full justify-center text-sm font-semibold"
									>
										{t("actions.clear")}
									</Button>
								</div>
							</div>
						</Card>
					</div>

					<div className="lg:col-span-2 lg:h-[calc(100vh-120px)]">
						<Card className="h-full lg:min-h-[640px]">
							<div className="flex h-full flex-col gap-6 overflow-y-auto">
								<div className="flex flex-wrap items-center gap-3">
									<Badge color="success" size="lg">
										{t("preview.readyBadge", { count: convertedCount.toString() })}
									</Badge>
									{totalConvertedSize > 0 && (
										<Badge color="gray" size="lg">
											{t("summary.saved", {
												value: `${totalCompression.toFixed(1)}%`,
											})}
										</Badge>
									)}
									{totalConvertedSize > 0 && (
										<Badge color="info" size="lg">
											{t("summary.totalOutput", {
												value: formatBytes(totalConvertedSize),
											})}
										</Badge>
									)}
								</div>

								{queue.length === 0 ? (
									<div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800/70">
										<HiPhotograph className="mb-4 h-16 w-16 text-gray-400" />
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
											{t("empty.title")}
										</h3>
										<p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
											{t("empty.description")}
										</p>
									</div>
								) : (
									<div className="grid gap-4">
										{queue.map((item) => {
											const compressionLabel = getCompressionLabel(
												item.originalSize,
												item.convertedSize
											);
											const canPreviewOriginal = !isHeicFile(item.file);
											const outputName = getOutputName(item.fileName);

											return (
												<Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
													<div className="grid gap-5 lg:grid-cols-[220px_1fr]">
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
																			<div className="relative h-40 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
																{canPreviewOriginal ? (
																					<Image
																						src={item.originalUrl}
																						alt={item.fileName}
																						fill
																						unoptimized
																						sizes="(max-width: 1024px) 50vw, 220px"
																						className="object-cover"
																					/>
																) : (
																	<div className="flex h-40 items-center justify-center px-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">
																		{t("status.heicPreview")}
																	</div>
																)}
															</div>
																			<div className="relative h-40 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
																{item.convertedUrl ? (
																					<Image
																						src={item.convertedUrl}
																						alt={outputName}
																						fill
																						unoptimized
																						sizes="(max-width: 1024px) 50vw, 220px"
																						className="object-cover"
																					/>
																) : (
																	<div className="flex h-40 items-center justify-center px-4 text-center text-sm text-gray-500 dark:text-gray-300">
																		{t("status.awaiting")}
																	</div>
																)}
															</div>
														</div>

														<div className="space-y-4">
															<div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
																<div>
																	<h3 className="break-all text-lg font-bold text-gray-900 dark:text-white">
																		{item.fileName}
																	</h3>
																	<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
																		{t("card.outputName", { value: outputName })}
																	</p>
																</div>

																<div className="flex flex-wrap gap-2">
																	<Badge color="gray">{item.originalType || "image"}</Badge>
																	{item.status === "idle" && <Badge color="warning">{t("status.idle")}</Badge>}
																	{item.status === "converting" && <Badge color="info">{t("status.converting")}</Badge>}
																	{item.status === "done" && <Badge color="success">{t("status.done")}</Badge>}
																	{item.status === "error" && <Badge color="failure">{t("status.error")}</Badge>}
																	{compressionLabel && item.status === "done" && (
																		<Badge color={compressionLabel.startsWith("-") ? "success" : "failure"}>
																			{compressionLabel}
																		</Badge>
																	)}
																</div>
															</div>

															<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
																<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
																	<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
																		{t("card.originalSize")}
																	</p>
																	<p className="mt-1 font-semibold text-gray-900 dark:text-white">
																		{formatBytes(item.originalSize)}
																	</p>
																</div>
																<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
																	<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
																		{t("card.convertedSize")}
																	</p>
																	<p className="mt-1 font-semibold text-gray-900 dark:text-white">
																		{item.convertedSize ? formatBytes(item.convertedSize) : "-"}
																	</p>
																</div>
																<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
																	<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
																		{t("card.dimensions")}
																	</p>
																	<p className="mt-1 font-semibold text-gray-900 dark:text-white">
																				{item.outputWidth && item.outputHeight
																					? item.originalWidth &&
																					  item.originalHeight &&
																					  (item.originalWidth !== item.outputWidth ||
																						item.originalHeight !== item.outputHeight)
																						? `${item.originalWidth} x ${item.originalHeight} -> ${item.outputWidth} x ${item.outputHeight}`
																						: `${item.outputWidth} x ${item.outputHeight}`
																					: "-"}
																	</p>
																</div>
																<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
																	<p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
																		{t("card.profile")}
																	</p>
																	<p className="mt-1 font-semibold text-gray-900 dark:text-white">
																		{t("card.profileValue", {
																			quality: quality.toString(),
																			effort: effort.toString(),
																					resolution: resolutionProfileLabel,
																		})}
																	</p>
																</div>
															</div>

															{item.error && (
																<p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
																	{item.error}
																</p>
															)}

															<div className="flex flex-wrap gap-3">
																<Button
																	onClick={() => convertItem(item.id)}
																	disabled={item.status === "converting" || isBatchProcessing}
																	color="blue"
																			className="h-11 min-w-[11rem] justify-center text-sm font-semibold"
																>
																	{item.status === "done" ? t("actions.reconvert") : t("actions.convertOne")}
																</Button>
																<Button
																	onClick={() => downloadSingleItem(item)}
																	disabled={!item.convertedBlob}
																			className="h-11 min-w-[11rem] justify-center bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600"
																>
																	<HiDownload className="mr-2 h-4 w-4" />
																	{t("actions.downloadOne")}
																</Button>
																<Button
																	onClick={() => handleRemoveItem(item.id)}
																	disabled={item.status === "converting"}
																	color="light"
																			className="h-11 min-w-[11rem] justify-center text-sm font-semibold"
																>
																	{t("actions.remove")}
																</Button>
															</div>
														</div>
													</div>
												</Card>
											);
										})}
									</div>
								)}
							</div>
						</Card>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ImageConverterPage;