"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNavigation from "./MobileNavigation";
import NavItem from "./NavItem";
import Logo from "@/images/logo/logo-transparent.png";
import NavData from "@/data/nav.json";

const NavigationBar = () => {
	// const { t } = useTranslation();

	const socialLinks = NavData.socialLinks;
	const navLinks = NavData.navLinks;
	const contactInfo = NavData.contactInfo;

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

	// useEffect(() => {
	//     if (isSticky) {
	//         // window.scrollBy({
	//         //   top: -112,  // Scroll 112px down
	//         //   left: 0,
	//         //   behavior: 'smooth'  // Enable smooth scrolling
	//         // });
	//     } else {
	//         // window.scrollBy({
	//         //   top: 112,  // Scroll 112px up
	//         //   left: 0,
	//         //   behavior: 'smooth'  // Enable smooth scrolling
	//         // });
	//     }
	// }, [isSticky]); // This effect runs whenever isSticky changes

	return (
		<>
			<div className={`${isSticky ? "h-24" : "h-0"}`} />

			<nav
				className={`text-white bg-black px-4 ${
					isSticky
						? "translate-y-24 fixed w-full -top-24 left-0 z-40 transition ease-in-out duration-500 bg-black shadow-lg"
						: ""
				} transition-transform duration-300 ease-in-out`}
			>
				<div
					className={`max-w-full mx-auto lg:mx-24 xl:mx-48 flex justify-between md:justify-evenly items-center ${
						isSticky ? "h-24" : "h-24"
					}`}
				>
					<div className="flex items-center justify-center space-x-3 h-24 pt-2">
						<Link className="block" href="/">
							<Image
								src={Logo}
								alt="Serkan Korkut Logo"
								width={isSticky ? 75 : 90}
								// height={isSticky ? 75 : 90}
								className="h-auto"
								priority
							/>
						</Link>
						{/* <span className="text-2xl font-semibold">Serkan Korkut</span> */}
					</div>
					<div className="h-24 md:basis-3/4 flex flex-col md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
						<MobileNavigation />
						<div className="h-12 hidden md:flex items-center justify-between border-b border-zinc-800">
							<div className="flex items-center space-x-4 text-sm">
								{contactInfo.phone.show && (
									<div className="flex items-center space-x-1">
										<svg
											className="w-6 h-6 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
										</svg>
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
										<svg
											className="w-6 h-6 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
											<path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
										</svg>
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
										<svg
											className="w-6 h-6 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
												clipRule="evenodd"
											/>
										</svg>

										<a
											className="font-medium hover:text-orange-500 transition-colors duration-300"
											href={contactInfo.address.link}
										>
											{contactInfo.address.text}
										</a>
									</div>
								)}
							</div>
							<div className="flex space-x-3">
								{socialLinks.facebook.show && (
									<Link href={socialLinks.facebook.url}>
										<svg
											className="w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
								)}
								{socialLinks.twitter.show && (
									<Link href={socialLinks.twitter.url}>
										<svg
											className="w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
								)}
								{socialLinks.instagram.show && (
									<Link href={socialLinks.instagram.url}>
										<svg
											className="w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												fillRule="evenodd"
												d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
								)}
								{socialLinks.linkedin.show && (
									<Link href={socialLinks.linkedin.url}>
										<svg
											className="w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
												clipRule="evenodd"
											/>
											<path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
										</svg>
									</Link>
								)}
								{socialLinks.github.show && (
									<Link href={socialLinks.github.url}>
										<svg
											className="w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
								)}
							</div>
						</div>
						<div
							className="h-12 items-center justify-between hidden w-full md:flex flex-col md:flex-row md:w-auto md:order-1"
							id="navbar-cta"
						>
							<ul className="flex flex-col font-medium p-4 md:p-0 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
								{navLinks.map((link, index) => (
									// <li key={link.name} className="md:mt-0">
									//     <Link href={link.url}>
									//         <span className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">
									//             {link.name}
									//         </span>
									//     </Link>
									// </li>
									<NavItem link={link} key={index} />
								))}
							</ul>
							<div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
								<Link href="/contact" className="">
									<button
										type="button"
										id="navbar-btn"
										className="text-white bg-orange-500 hover:bg-orange-700 transition-colors duration-300 focus:ring-4 focus:outline-hidden focus:ring-orange-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
									>
										CONTACT
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default NavigationBar;
