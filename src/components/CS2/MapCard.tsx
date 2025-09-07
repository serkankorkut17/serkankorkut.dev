import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Map {
	_id: string;
	name: string;
	title: string;
	description: string;
	image: string;
	active: boolean;
}

interface MapCardProps {
	map: Map;
}

const MapCard: React.FC<MapCardProps> = ({ map }) => {
	const [imageLoading, setImageLoading] = useState(false);

	const handleImageLoadStart = () => {
		setImageLoading(true);
	};

	const handleImageLoadComplete = () => {
		setImageLoading(false);
	};


	return (
		<Link
			key={map.name}
			href={`/cs2/${map.name}`}
			className="group block h-full"
		>
			<div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white h-full flex flex-col">
				{/* Image Container */}
				<div className="relative overflow-hidden shrink-0 w-full h-48">
					{imageLoading && (
						<div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
							<AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-orange-500" />
						</div>
					)}
					<Image
						src={map.image}
						alt={map.title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover object-center transition-transform duration-300 hover:scale-110"
						onLoadStart={handleImageLoadStart}
						onLoad={handleImageLoadComplete}
						onError={handleImageLoadComplete}
					/>

					{/* Status Badge */}
					<div className="absolute top-2 right-2 z-20">
						<span
							className={`
												px-3 py-1 rounded-full text-sm font-semibold text-white z-10
												${map.active ? "bg-green-500" : "bg-red-500"}
											`}
						>
							{map.active ? "Active" : "Inactive"}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="p-4">
					<h3 className="font-bold text-gray-800 mb-2 text-xl">{map.title}</h3>
					<p className="text-gray-600 leading-relaxed">{map.description}</p>
				</div>
			</div>
		</Link>
	);
};

export default MapCard;
