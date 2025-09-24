"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
	Card,
	Label,
	TextInput,
	Select,
	Button,
	FileInput,
	Badge,
	Checkbox,
	RangeSlider,
} from "flowbite-react";
import { HiDownload, HiPhotograph, HiColorSwatch } from "react-icons/hi";
import PageHeader from "@/components/Sections/PageHeader";
import { useTranslations } from "next-intl";

type QRErrorLevel = "L" | "M" | "Q" | "H";

const QRCodeGenerator: React.FC = () => {
	const t = useTranslations("QRPage");
	const [inputValue, setInputValue] = useState<string>(
		"https://serkankorkut.dev/"
	);
	const [logoSrc, setLogoSrc] = useState<string | null>(null);
	const [bgColor, setBgColor] = useState<string>("#ffffff");
	const [fgColor, setFgColor] = useState<string>("#000000");
	const [qrLevel, setQrLevel] = useState<QRErrorLevel>("H");
	const [logoScale, setLogoScale] = useState<number>(20); // Percentage of QR code size
	const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
	const [logoWidth, setLogoWidth] = useState<number>(80);
	const [logoHeight, setLogoHeight] = useState<number>(80);
	const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1); // Store original aspect ratio
	const qrRef = useRef<HTMLDivElement | null>(null);

	const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					setLogoSrc(reader.result);

					// Calculate dimensions based on current scale when logo is uploaded
					const img = new Image();
					img.onload = () => {
						const aspectRatio = img.width / img.height;
						setOriginalAspectRatio(aspectRatio); // Save original aspect ratio

						const baseSize = Math.floor(500 * (logoScale / 100)); // Updated to 500
						if (maintainAspectRatio) {
							// Maintain aspect ratio
							if (aspectRatio > 1) {
								// Landscape
								setLogoWidth(baseSize);
								setLogoHeight(Math.floor(baseSize / aspectRatio));
							} else {
								// Portrait or square
								setLogoHeight(baseSize);
								setLogoWidth(Math.floor(baseSize * aspectRatio));
							}
						} else {
							// Use square dimensions
							setLogoWidth(baseSize);
							setLogoHeight(baseSize);
						}
					};
					img.src = reader.result;
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const downloadSVG = () => {
		const svgElement = qrRef.current?.querySelector("svg");
		if (!svgElement) return;

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(
			svgElement as unknown as Node
		);
		const svgBlob = new Blob([svgString], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "qrcode.svg";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	};

	const downloadPNG = () => {
		const svgElement = qrRef.current?.querySelector("svg");
		if (!svgElement) return;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const scaleFactor = 4; // export at higher resolution
		canvas.width = 512 * scaleFactor;
		canvas.height = 512 * scaleFactor;

		const svgData = new XMLSerializer().serializeToString(
			svgElement as unknown as Node
		);
		const svgBlob = new Blob([svgData], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		img.onload = () => {
			if (ctx) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				URL.revokeObjectURL(url);

				const link = document.createElement("a");
				link.href = canvas.toDataURL("image/png");
				link.download = "qrcode.png";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		};

		// Important for cross-origin: data URLs are same-origin
		img.crossOrigin = "anonymous";
		img.src = url;
	};

	return (
		<main className="min-h-screen">
			<PageHeader title={t("title")} />
			<div className="bg-white dark:bg-gray-900 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
						{/* Left Column - Controls */}
						<div className="lg:col-span-1 lg:h-[calc(100vh-120px)]">
							<Card className="h-full lg:min-h-[600px] overflow-hidden">
								<div className="space-y-6 h-full flex flex-col overflow-y-auto">
									{/* Main Content - Flexible */}
									<div className="flex-1 space-y-6 overflow-y-auto pr-2">
									{/* Content Input */}
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Label
												htmlFor="content"
												className="text-base font-semibold"
											>
												{t("content.label")}
											</Label>
											<Badge color="indigo" size="xs">
												{t("content.required")}
											</Badge>
										</div>
										<TextInput
											id="content"
											type="text"
											placeholder={t("content.placeholder")}
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
											required
										/>

										{/* Examples Dropdown */}
										<div className="mt-2">
											<details className="group">
												<summary className="flex cursor-pointer items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
													<span>{t("content.examples.title")}</span>
													<svg
														className="h-4 w-4 transition-transform group-open:rotate-180"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</summary>
												<div className="mt-2 space-y-1 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
													{[
														{ key: "website", icon: "🌐" },
														{ key: "email", icon: "📧" },
														{ key: "whatsapp", icon: "📱" },
														{ key: "social", icon: "👔" },
														{ key: "text", icon: "📝" },
														{ key: "phone", icon: "📞" },
														{ key: "sms", icon: "💬" },
														{ key: "wifi", icon: "📶" },
														{ key: "location", icon: "📍" },
													].map(({ key, icon }) => (
														<button
															key={key}
															type="button"
															onClick={() =>
																setInputValue(
																	t(`content.examples.${key}`).split(": ")[1] ||
																		""
																)
															}
															className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
														>
															<span>{icon}</span>
															<span className="truncate">
																{t(`content.examples.${key}`)}
															</span>
														</button>
													))}
												</div>
											</details>
										</div>
									</div>

									{/* QR Level Selection */}
									<div>
										<div className="mb-2">
											<Label
												htmlFor="qrlevel"
												className="text-base font-semibold"
											>
												{t("errorLevel.label")}
											</Label>
										</div>
										<Select
											id="qrlevel"
											value={qrLevel}
											onChange={(e) =>
												setQrLevel(e.target.value as QRErrorLevel)
											}
										>
											<option value="L">{t("errorLevel.low")}</option>
											<option value="M">{t("errorLevel.medium")}</option>
											<option value="Q">{t("errorLevel.quartile")}</option>
											<option value="H">{t("errorLevel.high")}</option>
										</Select>
									</div>

									{/* Logo Upload */}
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Label htmlFor="logo" className="text-base font-semibold">
												{t("logo.label")}
											</Label>
											<HiPhotograph className="w-4 h-4 text-gray-500" />
										</div>
										<FileInput
											id="logo"
											accept="image/*"
											onChange={handleLogoUpload}
										/>
										<p className="mt-1 text-xs text-gray-500">
											{t("logo.helper")}
										</p>
									</div>

									{/* Logo Dimensions */}
									{logoSrc && (
										<div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<h4 className="font-semibold text-gray-900 dark:text-white">
												{t("logo.settings")}
											</h4>

											{/* Aspect Ratio Toggle */}
											<div className="flex items-center space-x-2">
												<Checkbox
													id="maintainRatio"
													checked={maintainAspectRatio}
													onChange={(e) => {
														const newMaintainRatio = e.target.checked;
														setMaintainAspectRatio(newMaintainRatio);

														// Recalculate dimensions when aspect ratio setting changes
														const baseSize = Math.floor(
															500 * (logoScale / 100) // Updated to 500
														);
														if (newMaintainRatio && originalAspectRatio !== 1) {
															// Apply aspect ratio
															if (originalAspectRatio > 1) {
																// Landscape
																setLogoWidth(baseSize);
																setLogoHeight(
																	Math.floor(baseSize / originalAspectRatio)
																);
															} else {
																// Portrait
																setLogoHeight(baseSize);
																setLogoWidth(
																	Math.floor(baseSize * originalAspectRatio)
																);
															}
														} else {
															// Make square
															setLogoWidth(baseSize);
															setLogoHeight(baseSize);
														}
													}}
												/>
												<Label htmlFor="maintainRatio" className="text-sm">
													{t("logo.maintainRatio")}
												</Label>
											</div>

											{/* Logo Scale Slider */}
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<Label>{t("logo.size")}</Label>
													<Badge color="info" size="xs">
														{logoScale}%
													</Badge>
												</div>
												<RangeSlider
													id="logoScale"
													min={10}
													max={40}
													value={logoScale}
													onChange={(e) => {
														const newScale = Number(e.target.value);
														setLogoScale(newScale);
														// Calculate pixel values based on percentage
														const baseSize = Math.floor(500 * (newScale / 100));

														if (
															maintainAspectRatio &&
															originalAspectRatio !== 1
														) {
															// Maintain aspect ratio using original ratio
															if (originalAspectRatio > 1) {
																// Landscape
																setLogoWidth(baseSize);
																setLogoHeight(
																	Math.floor(baseSize / originalAspectRatio)
																);
															} else {
																// Portrait
																setLogoHeight(baseSize);
																setLogoWidth(
																	Math.floor(baseSize * originalAspectRatio)
																);
															}
														} else {
															// Square or aspect ratio disabled
															setLogoWidth(baseSize);
															setLogoHeight(baseSize);
														}
													}}
												/>
												<div className="flex justify-between text-xs text-gray-500">
													<span>{t("logo.sizeSmall")}</span>
													<span>{t("logo.sizeLarge")}</span>
												</div>
											</div>

											{/* Manual Size Controls (when aspect ratio is off) */}
											{!maintainAspectRatio && (
												<div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-600">
													<div>
														<Label htmlFor="logoWidth">{t("logo.width")}</Label>
														<TextInput
															id="logoWidth"
															type="number"
															value={logoWidth.toString()}
															onChange={(e) =>
																setLogoWidth(Number(e.target.value))
															}
															min={20}
															max={160}
															className="mt-1"
														/>
													</div>
													<div>
														<Label htmlFor="logoHeight">
															{t("logo.height")}
														</Label>
														<TextInput
															id="logoHeight"
															type="number"
															value={logoHeight.toString()}
															onChange={(e) =>
																setLogoHeight(Number(e.target.value))
															}
															min={20}
															max={160}
															className="mt-1"
														/>
													</div>
												</div>
											)}

											{/* Logo Preview Info */}
											<div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 p-2 rounded">
												<span className="font-medium">
													{t("logo.currentSize")}
												</span>{" "}
												{logoWidth}×{logoHeight}px
												{maintainAspectRatio && (
													<span className="ml-2">
														{t("logo.aspectMaintained")}
													</span>
												)}
											</div>
										</div>
									)}

									{/* Color Selection */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 mb-2">
											<Label className="text-base font-semibold">
												{t("colors.label")}
											</Label>
											<HiColorSwatch className="w-4 h-4 text-gray-500" />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="bgColor">
													{t("colors.background")}
												</Label>
												<div className="flex items-center gap-2 mt-1">
													<input
														id="bgColor"
														type="color"
														value={bgColor}
														onChange={(e) => setBgColor(e.target.value)}
														className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
													/>
													<span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
														{bgColor.toUpperCase()}
													</span>
												</div>
											</div>
											<div>
												<Label htmlFor="fgColor">
													{t("colors.foreground")}
												</Label>
												<div className="flex items-center gap-2 mt-1">
													<input
														id="fgColor"
														type="color"
														value={fgColor}
														onChange={(e) => setFgColor(e.target.value)}
														className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
													/>
													<span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
														{fgColor.toUpperCase()}
													</span>
												</div>
											</div>
										</div>
									</div>
									</div>

									{/* Download Buttons - Fixed at bottom */}
									{inputValue && (
										<div className="flex-shrink-0 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 sticky bottom-0">
											<h4 className="font-semibold text-gray-900 dark:text-white">
												{t("download.title")}
											</h4>
											<div className="grid grid-cols-1 gap-3">
												<Button
													onClick={downloadSVG}
													color="blue"
													className="w-full"
												>
													<HiDownload className="mr-2 h-4 w-4" />
													{t("download.svg")}
												</Button>
												<Button
													onClick={downloadPNG}
													color="default"
													className="w-full bg-orange-500 hover:bg-orange-700 text-white"
												>
													<HiDownload className="mr-2 h-4 w-4" />
													{t("download.png")}
												</Button>
											</div>
										</div>
									)}
								</div>
							</Card>
						</div>

						{/* Right Column - QR Code Display */}
						<div className="lg:col-span-2 lg:h-[calc(100vh-120px)]">
							<Card className="h-full lg:min-h-[600px] flex flex-col">
								<div className="flex-grow flex items-center justify-center">
									{inputValue ? (
										<div className="text-center w-full">
											<div className="mb-4">
												<Badge color="success" size="lg">
													{t("preview.live")}
												</Badge>
											</div>
											<div ref={qrRef} className="flex justify-center">
												<div
													className="p-6 bg-white rounded-xl shadow-inner"
													style={{ backgroundColor: bgColor }}
												>
													<QRCodeSVG
														value={inputValue}
														size={500}
														bgColor={bgColor}
														fgColor={fgColor}
														level={qrLevel}
														className="w-full h-auto max-w-lg mx-auto"
														imageSettings={
															logoSrc
																? {
																		src: logoSrc,
																		height: logoHeight,
																		width: logoWidth,
																		excavate: true,
																  }
																: undefined
														}
													/>
												</div>
											</div>
											<div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<p className="text-sm text-gray-600 dark:text-gray-300 break-all">
													<strong>{t("preview.content")}</strong>{" "}
													{inputValue.length > 50
														? inputValue.substring(0, 50) + "..."
														: inputValue}
												</p>
											</div>
										</div>
									) : (
										<div className="text-center py-12">
											<HiPhotograph className="mx-auto h-16 w-16 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
												{t("preview.noContent")}
											</h3>
											<p className="text-gray-600 dark:text-gray-300">
												{t("preview.noContentDesc")}
											</p>
										</div>
									)}
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default QRCodeGenerator;
