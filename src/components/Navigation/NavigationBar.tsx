"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "flowbite-react";
import MobileNavigation from "./MobileNavigation";
import NavItem from "./NavItem";
import Logo from "@/images/logo/logo-transparent.png";
import NavData from "@/data/Navigation.json";
import { PiPhoneFill } from "react-icons/pi";
import { TbMailFilled } from "react-icons/tb";
import { TiLocation } from "react-icons/ti";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "next-intl";
import { SupportedLocale } from "@/types";

const NavigationBar = () => {
	const currentLocale: SupportedLocale = useLocale() as SupportedLocale;
	const locale = currentLocale || "en";

	const navLinks = NavData.navLinks.map(link => ({
		...link,
		name: link.name[locale],
		subLinks: link.subLinks ? link.subLinks.map(subLink => ({
			...subLink,
			name: subLink.name[locale]
		})) : undefined
	}));
	const socialLinks = NavData.socialLinks;
	const contactInfo = NavData.contactInfo;
	const actionButton = {
		...NavData.actionButton,
		name: NavData.actionButton.name[locale]
	};

	// Sticky navigation state

	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 112);
			// setIsSticky(window.scrollY > window.innerHeight);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<div className={`${isSticky ? "h-[100px]" : "h-0"}`} />

			<Navbar
				fluid={true}
				className={`!bg-black !border-none !px-4 transition-transform duration-300 ease-in-out ${
					isSticky
						? "translate-y-24 fixed w-full -top-24 left-0 z-40 transition ease-in-out duration-500 !bg-black shadow-lg"
						: ""
				}`}
			>
				<div className="text-white w-full lg:mx-24 xl:mx-48">
				<div
					className={`max-w-full mx-auto flex justify-between md:justify-evenly items-center w-full ${
						isSticky ? "h-20" : "h-24"
					}`}
				>
					{/* Logo Section */}
					<div className="flex items-center justify-center space-x-3 h-24 pt-2">
						<Link className="block" href="/">
							<Image
								src={Logo}
								alt="Serkan Korkut Logo"
								width={isSticky ? 75 : 90}
								className="h-auto"
								priority
							/>
						</Link>
					</div>

					{/* Main Content Area */}
					<div className="h-24 md:basis-3/4 flex flex-col md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
						{/* Mobile Navigation */}
						<MobileNavigation navLinks={navLinks} actionButton={actionButton} />

						{/* Top Bar with Contact Info and Social Links */}
						<div className="h-12 hidden md:flex items-center justify-between border-b border-zinc-800">
							<div className="flex items-center space-x-4 text-sm">
								{contactInfo.phone.show && (
									<div className="flex items-center space-x-1">
										<PiPhoneFill className="w-6 h-6 text-white" />
										<a
											className="font-medium hover:text-orange-500 transition-colors duration-300"
											href={contactInfo.phone.link}
										>
											{contactInfo.phone.number}
										</a>
									</div>
								)}
								{contactInfo.email.show && (
									<div className="flex items-center space-x-1">
										<TbMailFilled className="w-6 h-6 text-white" />
										<a
											className="font-medium hover:text-orange-500 transition-colors duration-300"
											href={contactInfo.email.link}
										>
											{contactInfo.email.address}
										</a>
									</div>
								)}
								{contactInfo.address.show && (
									<div className="flex items-center space-x-1">
										<TiLocation className="w-6 h-6 text-white" />

										<a
											className="font-medium hover:text-orange-500 transition-colors duration-300"
											href={contactInfo.address.link}
										>
											{contactInfo.address.text[locale]}
										</a>
									</div>
								)}
							</div>
							<div className="flex space-x-3">
								{socialLinks.facebook.show && (
									<Link href={socialLinks.facebook.url}>
										<FaFacebookF className="w-5 h-5 text-white hover:scale-125 hover:text-orange-500 transition-all duration-300" />
									</Link>
								)}
								{socialLinks.twitter.show && (
									<Link href={socialLinks.twitter.url}>
											<FaTwitter className="w-5 h-5 text-white hover:scale-125 hover:text-orange-500 transition-all duration-300" />
									</Link>
								)}
								{socialLinks.instagram.show && (
									<Link href={socialLinks.instagram.url}>
										<FaInstagram className="w-5 h-5 text-white hover:scale-125 hover:text-orange-500 transition-all duration-300" />
									</Link>
								)}
								{socialLinks.linkedin.show && (
									<Link href={socialLinks.linkedin.url}>
										<FaLinkedinIn className="w-5 h-5 text-white hover:scale-125 hover:text-orange-500 transition-all duration-300" />
									</Link>
								)}
								{socialLinks.github.show && (
									<Link href={socialLinks.github.url}>
										<FaGithub className="w-5 h-5 text-white hover:scale-125 hover:text-orange-500 transition-all duration-300" />
									</Link>
								)}
							</div>
						</div>

						{/* Navigation Menu */}
						<div className="h-12 items-center justify-between hidden w-full md:flex flex-col md:flex-row md:w-auto md:order-1">
							<ul className="flex flex-col font-medium p-4 md:p-0 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
								{navLinks.map((link, index) => (
									<NavItem link={link} key={index} />
								))}
							</ul>
							<div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
								<LanguageSwitcher showText={true} />
								<Link href={actionButton.url}>
									<button
										type="button"
										className="text-white bg-orange-500 hover:bg-orange-700 transition-colors duration-300 focus:ring-4 focus:outline-hidden focus:ring-orange-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
									>
										{actionButton.name}
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
				</div>
			</Navbar>
		</>
	);
};

export default NavigationBar;
