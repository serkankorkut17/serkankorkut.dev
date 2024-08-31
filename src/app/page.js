import { Orbitron } from "next/font/google";
import HeroSection from "@/components/Sections/HeroSection";
import WhiteSection from "@/components/Sections/WhiteSection";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhiteSection />
    </main>
  );
}
