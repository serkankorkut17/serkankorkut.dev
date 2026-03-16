import "../globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/Theme";
import NavLayout from "@/components/Navigation/Email/NavLayout";
// import ScrollToTopButton from "@/components/Mouse/Scroll";
// import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";

export const metadata = {
	title: "Mail Morph - Mail Editor",
	description:
		"Mail Editor is a web application that allows you to create and edit email templates easily. It provides a user-friendly interface and various customization options to help you design professional-looking emails.",
};

interface ExtrasLayoutProps {
	children: React.ReactNode;
}

export default function ExtrasLayout({ children }: ExtrasLayoutProps) {
	return (
		<ThemeProvider>
			<AuthProvider>
				{/* <ScrollToTopButton /> */}
				<NavLayout />
				{children}
				{/* <ChatbotWidget /> */}
			</AuthProvider>
		</ThemeProvider>
	);
}
