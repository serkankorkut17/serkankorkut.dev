import Image from "next/image";
import background from "@/images/background/banner-one-shape-1.webp";
import PP from "@/images/pp.jpeg";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function HeroSection() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between py-2 px-8 md:py-8 md:px-24">
      <Image
        src={background}
        priority={true}
        className="absolute -z-40 inset-0 w-full h-full object-cover opacity-50"
        alt="Background"
      />

      <div className="text-center relative z-10">
        <div className="flex justify-center mx-20 sm:mx-28 md:mx-40 xl:mx-60">
          <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 1.5xl:w-72 1.5xl:h-72">
            <Image
              src={PP}
              className="w-full h-full object-contain rounded-full"
              alt="Profile Picture"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h1
            className={`${orbitron.className} text-orange-500 text-outline mt-8 md:mt-2 xl:mt-8 text-6xl sm:text-7xl md:text-8xl font-extrabold leading-loose sm:leading-relaxed md:leading-tight lg:leading-tight animate-slideInFromRight`}
          >
            Hello, I'm Serkan Korkut.
          </h1>
          <h2
            className={`${orbitron.className} text-white mt-4 md:mt-2 xl:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold leading-loose sm:leading-relaxed md:leading-tight lg:leading-tight animate-slideInFromLeft`}
          >
            I'm a Computer Engineering Student at Marmara University
          </h2>
        </div>
      </div>
    </section>
  );
}
