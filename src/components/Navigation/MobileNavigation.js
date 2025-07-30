import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";
import NavData from "@/data/nav.json";
import Link from "next/link";
import Logo from "@/images/logo/logo-grayscale-inverted.svg";
import Image from "next/image";
import MobileNavItem from "./MobileNavItem";

export default function MobileNavigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const sidebarRef = useRef(null); // Reference for sidebar

	useEffect(() => {
		setMounted(true);
	}, []);

	const contactLink = {
		name: "CONTACT",
		url: "/contact",
	};

	const navLinks = NavData.navLinks;

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleCloseSidebar = () => {
		setIsOpen(false);
	};

	// Detect click outside sidebar
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target)
			) {
				handleCloseSidebar(); // Close sidebar if clicked outside
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.body.classList.add("overflow-hidden");
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.classList.remove("overflow-hidden");
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.classList.remove("overflow-hidden");
		};
	}, [isOpen]);

	return (
		<div className="z-50 h-full md:h-0 flex items-center justify-between">
			<button
				onClick={toggleSidebar}
				type="button"
				className="flex items-center p-2 w-10 h-10 justify-center text-sm text-orange-500 rounded-lg md:hidden"
			>
				<span className="sr-only">Open main menu</span>
				<svg
					className="w-10 h-10"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 17 14"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M1 1h15M1 7h15M1 13h15"
					/>
				</svg>
			</button>

			{/* Portal ile render edilen sidebar ve backdrop */}
			{mounted && createPortal(
				<>
					{/* Backdrop Overlay */}
					<Transition
						show={isOpen}
						enter="transition-all duration-300 ease-in-out"
						enterFrom="opacity-0 backdrop-blur-none"
						enterTo="opacity-100 backdrop-blur-[2px]"
						leave="transition-all duration-300 ease-in-out"
						leaveFrom="opacity-100 backdrop-blur-[2px]"
						leaveTo="opacity-0 backdrop-blur-none"
					>
						<div
							className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9998]"
							onClick={handleCloseSidebar}
						/>
					</Transition>

					{/* Sidebar */}
					<Transition
						show={isOpen}
						enter="transition-transform duration-300 ease-in-out"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition-transform duration-300 ease-in-out"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<div
							className="fixed left-0 top-0 bottom-0 z-[9999] w-64 p-6 bg-white shadow-2xl overflow-y-auto"
							ref={sidebarRef}
						>
							<div className="flex justify-end">
								<button
									onClick={toggleSidebar}
									className="text-gray-600 hover:text-black transition duration-200 ease-in-out"
								>
									<svg
										className="w-10 h-10"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18 17.94 6M18 18 6.06 6"
										/>
									</svg>
								</button>
							</div>

							{/* Logo and Title */}
							<div className="flex flex-col justify-center items-center mb-8">
								<Image
									src={Logo}
									// height="48"
									// width="48"
									priority
									className="h-48 w-48 object-cover object-center"
									alt="Serkan Korkut Logo"
								/>
								<p className="block text-gray-800 text-xl font-bold text-center">
									Serkan Korkut
								</p>
							</div>

							{/* Navigation Links */}
							<nav className="flex-1 overflow-y-auto">
								{navLinks.map((link, index) => (
									<div key={link.name}>
										<MobileNavItem
											link={link}
											toggleSidebar={toggleSidebar}
										/>
										{/* Add a divider line except after the last link */}
										<hr className="border-gray-100 my-2" />
									</div>
								))}
								<div key="Contact">
									<MobileNavItem
										link={contactLink}
										toggleSidebar={toggleSidebar}
									/>
								</div>
							</nav>
						</div>
					</Transition>
				</>,
				document.body
			)}
		</div>
	);
}
