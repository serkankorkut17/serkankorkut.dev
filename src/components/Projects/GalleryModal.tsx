import Image from "next/image";
import { useEffect, useCallback } from "react";
import {
	HiChevronLeft,
	HiChevronRight,
	HiXMark,
	HiArrowDownTray,
	HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Project } from "@/types";

interface GalleryModalProps {
	isModalOpen: boolean;
	closeModal: () => void;
	selectedImages: string[];
	currentImageIndex: number;
	setCurrentImageIndex: (index: number) => void;
	currentProject: Project | null;
}

const GalleryModal = ({
	isModalOpen,
	closeModal,
	selectedImages,
	currentImageIndex,
	setCurrentImageIndex,
	currentProject,
}: GalleryModalProps) => {
	// Open current image in new tab
	const openImageInNewTab = () => {
		if (selectedImages[currentImageIndex]) {
			window.open(selectedImages[currentImageIndex], "_blank");
		}
	};

	// Download current image
	const downloadImage = () => {
		if (selectedImages[currentImageIndex] && currentProject) {
			const link = document.createElement("a");
			link.href = selectedImages[currentImageIndex];
			link.download = `${currentProject.title}-image-${currentImageIndex + 1}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	// Navigate through images in modal
	const nextImage = useCallback(() => {
		const nextIndex =
			currentImageIndex === selectedImages.length - 1
				? 0
				: currentImageIndex + 1;
		setCurrentImageIndex(nextIndex);
	}, [currentImageIndex, selectedImages.length, setCurrentImageIndex]);

	const prevImage = useCallback(() => {
		const prevIndex =
			currentImageIndex === 0
				? selectedImages.length - 1
				: currentImageIndex - 1;
		setCurrentImageIndex(prevIndex);
	}, [currentImageIndex, selectedImages.length, setCurrentImageIndex]);

	// Global keyboard listener
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (!isModalOpen) return;
			
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevImage();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextImage();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				closeModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener('keydown', handleGlobalKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
		};
	}, [isModalOpen, nextImage, prevImage, closeModal]);

	return (
		<>
			{isModalOpen && (
				<div 
					className="fixed inset-0 z-50 bg-black/90"
					onClick={(e) => {
						// Only close if clicking directly on the backdrop
						if (e.target === e.currentTarget) {
							closeModal();
						}
					}}
				>
					<div className="flex items-center justify-center w-full h-full p-4">
						{selectedImages.length > 0 && (
							<div 
								className="relative max-w-full max-h-full"
								onClick={(e) => e.stopPropagation()}
							>
						{/* Top action buttons */}
						<div className="absolute top-4 right-4 z-50 flex gap-2">
							{/* Download button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									downloadImage();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Download image"
								className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
							>
								<HiArrowDownTray className="w-5 h-5" />
							</button>

							{/* Open in new tab button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									openImageInNewTab();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Open in new tab"
								className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
							>
								<HiArrowTopRightOnSquare className="w-5 h-5" />
							</button>

							{/* Close button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									closeModal();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Close"
								className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
							>
								<HiXMark className="w-6 h-6" />
							</button>
						</div>

						{/* Main image */}
						<div className="relative">
							<Image
								src={selectedImages[currentImageIndex]}
								alt={`${currentProject?.title || "Project"} - Image ${
									currentImageIndex + 1
								}`}
								width={1600}
								height={900}
								className="w-full max-h-[85vh] object-contain"
							/>

							{/* Navigation arrows */}
							{selectedImages.length > 1 && (
								<>
									<button
										onClick={(e) => {
											e.stopPropagation();
											prevImage();
										}}
										onMouseDown={(e) => e.stopPropagation()}
										className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-colors"
									>
										<HiChevronLeft className="w-6 h-6" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											nextImage();
										}}
										onMouseDown={(e) => e.stopPropagation()}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-colors"
									>
										<HiChevronRight className="w-6 h-6" />
									</button>
								</>
							)}
						</div>

						{/* Thumbnail navigation */}
						{selectedImages.length > 1 && (
							<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
								<div className="flex space-x-2 bg-black/50 rounded-lg p-2">
									{selectedImages.map((image, index) => (
										<button
											key={index}
											onClick={(e) => {
												e.stopPropagation();
												setCurrentImageIndex(index);
											}}
											onMouseDown={(e) => e.stopPropagation()}
											className={`relative w-16 h-12 rounded overflow-hidden transition-all ${
												index === currentImageIndex
													? "ring-2 ring-orange-500 scale-110"
													: "opacity-70 hover:opacity-100"
											}`}
										>
											<Image
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className="w-full h-full object-cover"
												width={320}
												height={240}
											/>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Image counter */}
						<div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-1 text-white text-sm">
							{currentImageIndex + 1} / {selectedImages.length}
						</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default GalleryModal;
