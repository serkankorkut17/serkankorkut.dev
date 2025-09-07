import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import {
	HiChevronLeft,
	HiChevronRight,
	HiXMark,
	HiArrowDownTray,
	HiArrowTopRightOnSquare,
	HiMagnifyingGlassPlus,
	HiMagnifyingGlassMinus,
} from "react-icons/hi2";

interface CS2GalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	images: string[];
	currentIndex: number;
	setCurrentIndex: (index: number) => void;
	nadeTitle: string;
}

const CS2GalleryModal = ({
	isOpen,
	onClose,
	images,
	currentIndex,
	setCurrentIndex,
	nadeTitle,
}: CS2GalleryModalProps) => {
	const [zoomLevel, setZoomLevel] = useState(1);
	const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const imageRef = useRef<HTMLDivElement>(null);

	// Reset zoom and pan when image changes
	const resetZoomAndPan = () => {
		setZoomLevel(1);
		setPanPosition({ x: 0, y: 0 });
	};

	// Constrain pan position to keep image within bounds
	const constrainPan = (x: number, y: number, zoom: number) => {
		if (!imageRef.current) return { x, y };
		
		const container = imageRef.current;
		const containerRect = container.getBoundingClientRect();
		const imageWidth = containerRect.width * zoom;
		const imageHeight = containerRect.height * zoom;
		
		// Calculate maximum pan values
		const maxPanX = Math.max(0, (imageWidth - containerRect.width) / 2);
		const maxPanY = Math.max(0, (imageHeight - containerRect.height) / 2);
		
		return {
			x: Math.max(-maxPanX, Math.min(maxPanX, x)),
			y: Math.max(-maxPanY, Math.min(maxPanY, y))
		};
	};

	// Open current image in new tab
	const openImageInNewTab = () => {
		if (images[currentIndex]) {
			window.open(images[currentIndex], "_blank");
		}
	};

	// Download current image
	const downloadImage = async () => {
		if (images[currentIndex]) {
			try {
				// Try to fetch the image first
				const response = await fetch(images[currentIndex]);
				const blob = await response.blob();
				
				// Create a URL for the blob
				const url = window.URL.createObjectURL(blob);
				
				// Create download link
				const link = document.createElement("a");
				link.href = url;
				link.download = `${nadeTitle}-image-${currentIndex + 1}.jpg`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				
				// Clean up the URL
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Download failed:", error);
				// Fallback: open in new tab
				window.open(images[currentIndex], "_blank");
			}
		}
	};

	// Navigate through images in modal
	const nextImage = useCallback(() => {
		const nextIndex =
			currentIndex === images.length - 1 ? 0 : currentIndex + 1;
		setCurrentIndex(nextIndex);
		resetZoomAndPan();
	}, [currentIndex, images.length, setCurrentIndex]);

	const prevImage = useCallback(() => {
		const prevIndex =
			currentIndex === 0 ? images.length - 1 : currentIndex - 1;
		setCurrentIndex(prevIndex);
		resetZoomAndPan();
	}, [currentIndex, images.length, setCurrentIndex]);

	// Zoom functions
	const zoomIn = () => {
		setZoomLevel(prev => {
			const newZoom = Math.min(prev + 0.5, 4);
			// Constrain pan position after zoom
			const constrainedPan = constrainPan(panPosition.x, panPosition.y, newZoom);
			setPanPosition(constrainedPan);
			return newZoom;
		});
	};

	const zoomOut = () => {
		setZoomLevel(prev => {
			const newZoom = Math.max(prev - 0.5, 1);
			if (newZoom === 1) {
				setPanPosition({ x: 0, y: 0 });
			} else {
				// Constrain pan position after zoom
				const constrainedPan = constrainPan(panPosition.x, panPosition.y, newZoom);
				setPanPosition(constrainedPan);
			}
			return newZoom;
		});
	};

	// Pan functions
	const handleMouseDown = (e: React.MouseEvent) => {
		if (zoomLevel > 1) {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - panPosition.x,
				y: e.clientY - panPosition.y,
			});
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isDragging && zoomLevel > 1) {
			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;
			const constrainedPan = constrainPan(newX, newY, zoomLevel);
			setPanPosition(constrainedPan);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		// Final constraint check when mouse is released
		if (zoomLevel > 1) {
			const constrainedPan = constrainPan(panPosition.x, panPosition.y, zoomLevel);
			setPanPosition(constrainedPan);
		}
	};

	// Double click to zoom
	const handleDoubleClick = () => {
		if (zoomLevel === 1) {
			setZoomLevel(2);
		} else {
			setZoomLevel(1);
			setPanPosition({ x: 0, y: 0 });
		}
	};

	// Global keyboard listener
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevImage();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextImage();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleGlobalKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
		};
	}, [isOpen, nextImage, prevImage, onClose]);

	return (
		<>
			{isOpen && (
				<div 
					className="fixed inset-0 z-50 bg-black/90"
					onClick={(e) => {
						// Only close if clicking directly on the backdrop
						if (e.target === e.currentTarget) {
							onClose();
						}
					}}
				>
					<div className="flex items-center justify-center w-full h-full p-2">
						{images.length > 0 && (
							<div 
								className="relative w-full h-full flex items-center justify-center"
								onClick={(e) => e.stopPropagation()}
							>
						{/* Top action buttons */}
						<div className="absolute top-2 right-2 z-50 flex gap-2">
							{/* Zoom buttons */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									zoomOut();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Zoom out"
								disabled={zoomLevel <= 1}
								className="bg-black/70 hover:bg-black/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-2 text-white transition-colors"
							>
								<HiMagnifyingGlassMinus className="w-5 h-5" />
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									zoomIn();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Zoom in"
								disabled={zoomLevel >= 4}
								className="bg-black/70 hover:bg-black/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-2 text-white transition-colors"
							>
								<HiMagnifyingGlassPlus className="w-5 h-5" />
							</button>

							{/* Download button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									downloadImage();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Download image"
								className="bg-black/70 hover:bg-black/90 rounded-full p-2 text-white transition-colors"
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
								className="bg-black/70 hover:bg-black/90 rounded-full p-2 text-white transition-colors"
							>
								<HiArrowTopRightOnSquare className="w-5 h-5" />
							</button>

							{/* Close button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									onClose();
								}}
								onMouseDown={(e) => e.stopPropagation()}
								title="Close"
								className="bg-black/70 hover:bg-black/90 rounded-full p-2 text-white transition-colors"
							>
								<HiXMark className="w-6 h-6" />
							</button>
						</div>

						{/* Main image */}
						<div 
							ref={imageRef}
							className="relative overflow-hidden w-full h-full flex items-center justify-center"
							style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
							onDoubleClick={handleDoubleClick}
						>
							<div
								style={{
									transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
									transformOrigin: 'center center',
									transition: isDragging ? 'none' : 'transform 0.2s ease-out',
								}}
							>
								<Image
									src={images[currentIndex]}
									alt={`${nadeTitle} - Image ${currentIndex + 1}`}
									width={1600}
									height={1200}
									className="max-w-[96vw] max-h-[96vh] object-contain select-none"
									draggable={false}
								/>
							</div>

							{/* Navigation arrows - hide only when dragging */}
							{images.length > 1 && !isDragging && (
								<>
									<button
										onClick={(e) => {
											e.stopPropagation();
											prevImage();
										}}
										onMouseDown={(e) => e.stopPropagation()}
										className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 text-white transition-colors"
									>
										<HiChevronLeft className="w-6 h-6" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											nextImage();
										}}
										onMouseDown={(e) => e.stopPropagation()}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 text-white transition-colors"
									>
										<HiChevronRight className="w-6 h-6" />
									</button>
								</>
							)}
						</div>

						{/* Thumbnail navigation */}
						{images.length > 1 && (
							<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40">
								<div className="flex space-x-2 bg-black/70 rounded-lg p-2">
									{images.map((image, index) => (
										<button
											key={index}
											onClick={(e) => {
												e.stopPropagation();
												setCurrentIndex(index);
												resetZoomAndPan();
											}}
											onMouseDown={(e) => e.stopPropagation()}
											className={`relative w-16 h-12 rounded overflow-hidden transition-all ${
												index === currentIndex
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

						{/* Image counter and zoom level */}
						<div className="absolute top-2 left-2 space-y-2">
							<div className="bg-black/70 rounded-lg px-3 py-1 text-white text-sm">
								{currentIndex + 1} / {images.length}
							</div>
							{zoomLevel > 1 && (
								<div className="bg-black/70 rounded-lg px-3 py-1 text-white text-sm">
									Zoom: {zoomLevel}x
								</div>
							)}
						</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default CS2GalleryModal;
