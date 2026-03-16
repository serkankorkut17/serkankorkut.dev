import type { Metadata } from "next";
import "@/app/globals.css";

import NavigationBar from "@/components/Navigation/Main/NavigationBar";
import Footer from "@/components/Navigation/Main/Footer";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";
import ScrollToTopButton from "@/components/Mouse/Scroll";

// Export the metadata
export const metadata: Metadata = {
	title: "Serkan Korkut",
	description: "Welcome to my personal website",
};

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="hide-cursor">
			<RocketCursor />
			<RocketFire />
			<ScrollToTopButton />
			<NavigationBar />
			{children}
			<Footer />
		</div>
	);
}
