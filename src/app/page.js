import Image from "next/image";
import background from "@/images/background.png"; // Replace with your background image
import { Orbitron } from "next/font/google";
import HeroSection from "@/components/Sections/HeroSection";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section className="flex min-h-screen flex-col items-center justify-between py-4 px-8 md:py-12 md:px-24">
      {/* add backfround image */}
      {/* <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 -z-50"></div> */}
      <Image
        src={background}
        // layout="fill"
        // objectFit="cover"
        priority={true}
        className="absolute -z-40 h-full w-full object-cover"
        alt="Background"
      />

      </section>
    </main>
  );
}
