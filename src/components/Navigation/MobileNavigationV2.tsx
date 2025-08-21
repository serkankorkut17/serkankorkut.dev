import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import NavData from "@/data/nav.json";
import Logo from "@/images/logo/logo-grayscale-inverted.svg";
import Image from "next/image";
import MobileNavItem from "./MobileNavItem";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNavigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const contactLink = {
		name: "CONTACT",
		url: "/contact",
	};

	const navLinks = NavData.navLinks;

	const handleOpen = () => {
		setIsOpen(true);
		setTimeout(() => setIsVisible(true), 10); // Small delay for animation
	};

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => setIsOpen(false), 300); // Wait for animation to complete
	};

	// Sidebar açıldığında body scroll'unu devre dışı bırak
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	return (
		<>
			{/* Mobile menu button */}
			<div className="z-50 h-full md:hidden flex items-center justify-between">
				<Button
					onClick={handleOpen}
					size="sm"
					className="flex items-center p-2 w-10 h-10 justify-center text-orange-500 bg-transparent border-0 hover:bg-transparent focus:ring-0 focus:bg-transparent"
				>
					<span className="sr-only">Open main menu</span>
					<HiBars3 className="w-10 h-10" />
				</Button>
			</div>

			{/* Mobile Sidebar */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${
							isVisible ? 'opacity-100' : 'opacity-0'
						}`}
						onClick={handleClose}
						aria-hidden="true"
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							width: '100vw',
							height: '100vh'
						}}
					/>
					
					{/* Sidebar */}
					<div 
						className={`fixed top-0 left-0 z-[9999] h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
							isVisible ? 'translate-x-0' : '-translate-x-full'
						}`}
						style={{ 
							touchAction: 'none',  // Disable touch scrolling on sidebar container
							overscrollBehavior: 'contain'  // Prevent scroll chaining
						}}
					>
					{/* Custom Sidebar Content with Flex Layout */}
					<div className="h-full flex flex-col">
						{/* Header with close button */}
						<div className="flex justify-end p-4">
							<Button
								onClick={handleClose}
								size="sm"
								className="text-gray-600 hover:text-gray-800 bg-transparent border-0 p-1 hover:bg-gray-100 focus:ring-0 rounded-lg"
							>
								<HiXMark className="w-10 h-10" />
							</Button>
						</div>
						
						{/* Logo and Title */}
						<div className="flex flex-col justify-center items-center mb-8 px-6">
							<Image
								src={Logo}
								priority
								className="h-48 w-48 object-cover object-center"
								alt="Serkan Korkut Logo"
							/>
							<p className="block text-gray-800 text-xl font-bold text-center">
								Serkan Korkut
							</p>
						</div>

						{/* Navigation Links - This will take remaining space */}
						<div 
							className="flex-1 overflow-y-auto px-6 pb-4"
							style={{ 
								touchAction: 'pan-y',  // Allow only vertical scrolling
								overscrollBehavior: 'contain'
							}}
						>
							{navLinks.map((link) => (
								<div key={link.name}>
									<MobileNavItem
										link={link}
										toggleSidebar={handleClose}
									/>
									<hr className="border-gray-200 my-2" />
								</div>
							))}
							<div key="Contact">
								<MobileNavItem
									link={contactLink}
									toggleSidebar={handleClose}
								/>
							</div>
						</div>

						{/* Footer with Language Switcher - This will stick to bottom */}
						<div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
							<LanguageSwitcher isMobile={true} showText={true} />
						</div>
					</div>
				</div>
				</>
			)}
		</>
	);
}
