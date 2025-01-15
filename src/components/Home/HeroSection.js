import Image from "next/image";
// import background from "@/images/background/banner-one-shape-1.webp";
import PP from "@/images/pp.jpeg";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function HeroSection() {
  return (
    <section className="flex bg-black h-[calc(100vh-96px)] flex-col overflow-hidden items-center justify-center py-2 px-8 md:py-8 md:px-24 text-center">
        <div className="flex justify-center mx-20 sm:mx-28 md:mx-40 xl:mx-60">
          <div className="relativ w-48 h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 1.5xl:w-64 1.5xl:h-64">
            <Image
              src={PP}
              className="w-full h-full object-contain rounded-full transform transition-transform duration-300 hover:scale-110 hover:shadow-lg"
              alt="Profile Picture"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h1
            className={`${orbitron.className} text-orange-500 text-outline mt-8 md:mt-2 xl:mt-8 text-6xl md:text-7xl xl:text-8xl font-extrabold leading-tight animate-slideInFromRight`}
          >
            Hello, I&apos;m Serkan Korkut.
          </h1>
          <h2
            className={`${orbitron.className} text-white pb-4 mt-4 md:mt-2 xl:mt-4 text-2xl md:text-3xl xl:text-4xl font-bold leading-tight animate-slideInFromLeft`}
          >
            I&apos;m a Computer Engineering Student at Marmara University
          </h2>
        </div>
    </section>
  );
}
