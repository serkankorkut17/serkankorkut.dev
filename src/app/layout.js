import { Inter } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/Navigation/NavigationBar";
import RocketFire from "@/components/Mouse/RocketFire";
import RocketCursor from "@/components/Mouse/RocketCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Serkan Korkut",
  description: "Welcome to my personal website",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className} style={{
        cursor: 'none', }} >
        <RocketCursor />
        <RocketFire />
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
