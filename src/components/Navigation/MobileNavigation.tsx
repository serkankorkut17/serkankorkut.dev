import { useState } from "react";
import { Sidebar, Button } from "flowbite-react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import NavData from "@/data/nav.json";
import Logo from "@/images/logo/logo-grayscale-inverted.svg";
import Image from "next/image";
import MobileNavItem from "./MobileNavItem";

export default function MobileNavigation() {
	const [isOpen, setIsOpen] = useState(false);

	const contactLink = {
		name: "CONTACT",
		url: "/contact",
	};

	const navLinks = NavData.navLinks;

	const handleClose = () => setIsOpen(false);

	return (
		<>
			{/* Mobile menu button */}
			<div className="z-50 h-full md:hidden flex items-center justify-between">
				<Button
					onClick={() => setIsOpen(true)}
					size="sm"
					className="flex items-center p-2 w-10 h-10 justify-center text-orange-500 bg-transparent border-0 hover:bg-transparent focus:ring-0 focus:bg-transparent"
				>
					<span className="sr-only">Open main menu</span>
					<HiBars3 className="w-10 h-10" />
				</Button>
			</div>

			{/* Mobile Sidebar - Always rendered but conditionally visible */}
			<>
				{/* Backdrop */}
				<div
					className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ease-in-out ${
						isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
					}`}
					onClick={handleClose}
					aria-hidden="true"
				/>
				
				{/* Sidebar */}
				<div 
					className={`fixed top-0 left-0 z-[9999] h-screen w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
						<Sidebar className="h-full">
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

							{/* Navigation Links */}
							<div className="flex-1 overflow-y-auto px-6">
								{navLinks.map((link) => (
									<div key={link.name}>
										<MobileNavItem
											link={link}
											toggleSidebar={handleClose}
										/>
										<hr className="border-gray-100 my-2" />
									</div>
								))}
								<div key="Contact">
									<MobileNavItem
										link={contactLink}
										toggleSidebar={handleClose}
									/>
								</div>
							</div>
						</Sidebar>
					</div>
				</>
		</>
	);
}
