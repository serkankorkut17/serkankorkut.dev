import Image from "next/image";
import { Modal, ModalBody } from "flowbite-react";
import { StaticImageData } from "next/image";
import {
	HiChevronLeft,
	HiChevronRight,
	HiXMark,
	HiArrowDownTray,
	HiArrowTopRightOnSquare,
} from "react-icons/hi2";

type Project = {
	id: number;
	title: string;
	description: string;
	githubUrl: string;
};

interface GalleryModalProps {
	isModalOpen: boolean;
	closeModal: () => void;
	selectedImages: StaticImageData[];
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
			window.open(selectedImages[currentImageIndex].src, "_blank");
		}
	};

	// Download current image
	const downloadImage = () => {
		if (selectedImages[currentImageIndex] && currentProject) {
			const link = document.createElement("a");
			link.href = selectedImages[currentImageIndex].src;
			link.download = `${currentProject.title}-image-${currentImageIndex + 1}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	// Navigate through images in modal
	const nextImage = () => {
		const nextIndex =
			currentImageIndex === selectedImages.length - 1 ? 0 : currentImageIndex + 1;
		setCurrentImageIndex(nextIndex);
	};

	const prevImage = () => {
		const prevIndex =
			currentImageIndex === 0 ? selectedImages.length - 1 : currentImageIndex - 1;
		setCurrentImageIndex(prevIndex);
	};

	return (
		<Modal
			dismissible
			show={isModalOpen}
			onClose={closeModal}
			size="7xl"
			popup
			className="bg-black/90"
		>
			<ModalBody className="p-0 relative">
				{selectedImages.length > 0 && (
					<div className="relative">
						{/* Top action buttons */}
						<div className="absolute top-4 right-4 z-50 flex gap-2">
							{/* Download button */}
							<button
								onClick={downloadImage}
								title="Download image"
								className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
							>
								<HiArrowDownTray className="w-5 h-5" />
							</button>

							{/* Open in new tab button */}
							<button
								onClick={openImageInNewTab}
								title="Open in new tab"
								className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
							>
								<HiArrowTopRightOnSquare className="w-5 h-5" />
							</button>

							{/* Close button */}
							<button
								onClick={closeModal}
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
								className="w-full max-h-[90vh] object-contain"
							/>

							{/* Navigation arrows */}
							{selectedImages.length > 1 && (
								<>
									<button
										onClick={prevImage}
										className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-colors"
									>
										<HiChevronLeft className="w-6 h-6" />
									</button>
									<button
										onClick={nextImage}
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
											onClick={() => setCurrentImageIndex(index)}
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
			</ModalBody>
		</Modal>
	);
};

export default GalleryModal;
