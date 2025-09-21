import "../globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import NavLayout from "@/components/Navigation/Extras/NavLayout";
// import ScrollToTopButton from "@/components/Mouse/Scroll";
// import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";

// Import the Montserrat font
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

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
        <html lang="en">
            {/* Icons for different platforms */}
            <head>
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
                <meta name="apple-mobile-web-app-title" content="MailMorph" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body
                className={`${montserrat.className} bg-white dark:bg-black text-gray-900 dark:text-white`}
            >
                <AuthProvider>
                    {/* <ScrollToTopButton /> */}
                    <NavLayout />
                    {children}
                    {/* <ChatbotWidget /> */}
                </AuthProvider>
            </body>
        </html>
    );
}