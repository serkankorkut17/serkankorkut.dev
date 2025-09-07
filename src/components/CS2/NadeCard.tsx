import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Flame, Cloud, Zap, Bomb, Shield, Sword } from "lucide-react";
import { Nade } from "@/types/cs2";

interface NadeCardProps {
	nade: Nade;
	mapName: string;
}

const NadeCard: React.FC<NadeCardProps> = ({ nade, mapName }) => {
	const [imageLoading, setImageLoading] = useState(false);

	const handleImageLoadStart = () => {
		setImageLoading(true);
	};

	const handleImageLoadComplete = () => {
		setImageLoading(false);
	};

	// Icon mapping for each nade type
	const nadeIcons = {
		molotov: <Flame size={18} className="text-red-500" />,
		smoke: <Cloud size={18} className="text-gray-500" />,
		flash: <Zap size={18} className="text-yellow-500" />,
		grenade: <Bomb size={18} className="text-green-500" />,
	};

	// Icon mapping for sides
	const sideIcons = {
		CT: <Shield size={18} className="text-blue-500" />,
		T: <Sword size={18} className="text-orange-500" />,
	};

	// Color mapping for types
	const typeColors = {
		molotov: "bg-red-100 text-red-800",
		smoke: "bg-gray-100 text-gray-800",
		flash: "bg-yellow-100 text-yellow-800",
		grenade: "bg-green-100 text-green-800",
	};

	// Color mapping for sides
	const sideColors = {
		CT: "bg-blue-100 text-blue-800",
		T: "bg-orange-100 text-orange-800",
	};

	return (
		<Link
			href={`/cs2/${mapName}/${nade._id}`}
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
						src={nade.images.land}
						alt={nade.description || nade.name}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover object-center transition-transform duration-300 hover:scale-110"
						onLoadStart={handleImageLoadStart}
						onLoad={handleImageLoadComplete}
						onError={handleImageLoadComplete}
					/>

					{/* Type Badge */}
					<div className="absolute top-2 right-2 z-20">
						<div className="w-8 h-8 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
							{nadeIcons[nade.type as keyof typeof nadeIcons]}
						</div>
					</div>

					{/* Side Badge */}
					<div className="absolute top-2 left-2 z-20">
						<div className="w-8 h-8 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
							{sideIcons[nade.side as keyof typeof sideIcons]}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-4 flex justify-between items-center grow h-20">
					<p className="text-gray-800 font-semibold">
						{nade.name}
					</p>
					<div className="flex flex-col lg:flex-row gap-2">
						<div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium capitalize ${typeColors[nade.type as keyof typeof typeColors] || "bg-gray-100 text-gray-800"}`}>
							{nadeIcons[nade.type as keyof typeof nadeIcons]}
							<span>{nade.type}</span>
						</div>
						<div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${sideColors[nade.side as keyof typeof sideColors] || "bg-gray-100 text-gray-800"}`}>
							{sideIcons[nade.side as keyof typeof sideIcons]}
							<span>{nade.side}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default NadeCard;
