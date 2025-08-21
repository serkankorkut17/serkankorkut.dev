import type { Metadata } from "next";
import "../app/globals.css";

import NavigationBar from "@/components/Navigation/NavigationBar";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";
import ScrollToTopButton from "@/components/Mouse/Scroll";
import Footer from "@/components/Navigation/Footer";
// import { ThemeProvider } from "@/contexts/Theme";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale}>
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
				className={montserrat.className}
				style={{
					cursor: "none",
				}}
			>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<RocketCursor />
					<RocketFire />
					<ScrollToTopButton />
					<NavigationBar />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
