import type { Metadata } from "next";
import "@/app/globals.css";

import NavigationBar from "@/components/Navigation/Main/NavigationBar";
import Footer from "@/components/Navigation/Main/Footer";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";
import ScrollToTopButton from "@/components/Mouse/Scroll";
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

export default async function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className={`${montserrat.className} hide-cursor`}>
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
