import { Inter } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/Navigation/NavigationBar";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";
import ScrollToTopButton from "@/components/Scroll";
import Footer from "@/components/Navigation/Footer";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Serkan Korkut",
  description: "Welcome to my personal website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          cursor: "none",
        }}
      >
        <RocketCursor />
        <RocketFire />
        <ScrollToTopButton />
        <NavigationBar font={montserrat} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
