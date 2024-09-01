import Image from "next/image";
import background from "@/images/background/banner-one-shape-1.webp";
import PP from "@/images/pp.jpeg";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function HeroSection() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between py-2 px-8 md:py-8 md:px-24">
      <div className="absolute inset-0 w-full h-full -z-40">
        <Image
          src={background}
          priority={true}
          className="object-cover w-full h-full opacity-50"
          alt="Background"
        />
      </div>
      <div className="text-center relative z-10">
        <div className="flex justify-center mx-20 sm:mx-28 md:mx-40 xl:mx-60">
          <div className="relative w-48 h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 1.5xl:w-64 1.5xl:h-64">
            <Image
              src={PP}
              className="w-full h-full object-contain rounded-full"
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
      </div>
    </section>
  );
}
