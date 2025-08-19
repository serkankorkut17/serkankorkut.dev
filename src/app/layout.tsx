import type { Metadata } from "next";
import "./globals.css";

import NavigationBar from "@/components/Navigation/NavigationBar";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";
import ScrollToTopButton from "@/components/Mouse/Scroll";
import Footer from "@/components/Navigation/Footer";

// Import the Montserrat font
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
	weight: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

// Export the metadata
export const metadata: Metadata = {
	title: "Serkan Korkut",
	description: "Welcome to my personal website",
};


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <title>{metadata.title}</title>
				<meta name="description" content={metadata.description} /> */}
				<link rel="icon" href="/favicon.png" />
			</head>
			<body
				className={montserrat.className}
				style={{
					cursor: "none",
				}}
			>
				<RocketCursor />
				<RocketFire />
				<ScrollToTopButton />
				<NavigationBar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
