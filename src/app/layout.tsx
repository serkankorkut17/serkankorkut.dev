import type { Metadata } from "next";
import "./globals.css";

import ScrollToTopButton from "@/components/Mouse/Scroll";

// Import fonts
import { Montserrat, Orbitron, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
	weight: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

const orbitron = Orbitron({
	subsets: ["latin"],
	variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
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
		<html lang="en" className={cn(orbitron.variable, jetbrains.variable)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="icon"
					type="image/png"
					href="/favicon-96x96.png"
					sizes="96x96"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body
				className={`${montserrat.className} bg-term-bg text-term-fg`}
			>
				<Navigation />
				<ScrollToTopButton />
				{children}
				<Footer />
			</body>
		</html>
	);
}
