"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LanguageSwitcher({
	isMobile = false,
	showText = true,
}: {
	isMobile?: boolean;
	showText?: boolean;
}) {
	const router = useRouter();
	const [currentLanguage, setCurrentLanguage] = useState<string>("en");

	useEffect(() => {
		// client-side olduğunda cookie'yi oku
		if (typeof document !== "undefined") {
			const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
			if (match) setCurrentLanguage(match[1]);
		}
	}, []);

	const switchLocale = (locale: string) => {
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${
			60 * 60 * 24 * 365
		}`;
		setCurrentLanguage(locale);
		router.refresh();
	};

	const toggleLanguage = () => {
		const newLanguage = currentLanguage === "en" ? "tr" : "en";
		switchLocale(newLanguage);
	};

	if (isMobile) {
		return (
			<button
				onClick={toggleLanguage}
				className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-300 border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md group"
			>
				<div className="flex items-center space-x-3">
					<div className="relative">
						<div className="w-7 h-7 rounded-full bg-gray-50 shadow-sm flex items-center justify-center border border-gray-200 group-hover:border-orange-200 transition-all duration-300">
							<span className="text-sm">
								{currentLanguage === "tr" ? "🇹🇷" : "🇺🇸"}
							</span>
						</div>
					</div>
					{showText && (
						<div className="flex flex-col items-start">
							<span className="font-medium text-sm text-gray-800">
								{currentLanguage === "tr" ? "Türkçe" : "English"}
							</span>
							<span className="text-xs text-gray-500">
								Dil değiştir
							</span>
						</div>
					)}
				</div>
				
				{/* Switch indicator */}
				<div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-orange-500 transition-colors duration-300">
					<span>{currentLanguage === "tr" ? "EN" : "TR"}</span>
					<div className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-orange-400 transition-colors duration-300"></div>
				</div>
			</button>
		);
	}

	return (
		<button
			onClick={toggleLanguage}
			className="relative group flex items-center space-x-2 p-2 rounded-full hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105"
		>
			<div className="relative">
				<div className="w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center border-2 border-zinc-600 group-hover:border-orange-500 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/20">
					<span className="text-sm">
						{currentLanguage === "tr" ? "🇹🇷" : "🇺🇸"}
					</span>
				</div>
				{/* Active indicator dot */}
				<div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full opacity-100 transition-all duration-300 group-hover:scale-110 shadow-sm"></div>
			</div>
			{showText && (
				<span className="hidden sm:inline text-sm font-medium text-white group-hover:text-orange-400 transition-colors duration-300">
					{currentLanguage === "tr" ? "TR" : "EN"}
				</span>
			)}
			
			{/* Hover tooltip */}
			<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-zinc-600">
				{currentLanguage === "tr" ? "Switch to English" : "Türkçe'ye geç"}
				<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-zinc-800 border-l border-t border-zinc-600 rotate-45"></div>
			</div>
		</button>
	);
}
