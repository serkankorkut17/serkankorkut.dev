import Image from "next/image";
import background from "@/images/background.png"; // Replace with your background image
import DRNDigital from "@/images/drndigital_white.png"; // Replace with your video thumbnail
import { Orbitron } from "next/font/google";
// import useTranslation from "@/hooks/useTranslation";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function HeroSection() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between py-4 px-8 md:py-12 md:px-24">
      {/* add backfround image */}
      {/* <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 -z-50"></div> */}
      <Image
        src={background}
        // layout="fill"
        // objectFit="cover"
        className="absolute -z-40 inset-0 w-full h-full object-cover"
        alt="Background"
      />

      <div className="text-center p-4 relative z-10">
        <div className="flex flex-row items-center justify-between mx-20 sm:mx-28 md:mx-40 xl:mx-60">
          <div className="text-6xl md:text-9xl lg:text-11xl 1.5xl:text-12xl font-bold animate-bounce arrow-outline">
            ↓
          </div>
          <div className="relative w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 1.5xl:w-60 1.5xl:h-60">
            <Image
              src={DRNDigital}
              // layout="fill"
              // objectFit="contain"
              className="w-full h-full object-contain"
              alt="DRN Digital Logo"
            />
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <h1
            className={`${orbitron.className} text-white mt-8 md:mt-2 xl:mt-8 text-7xl sm:text-8xl md:text-9xl font-extrabold leading-loose sm:leading-relaxed md:leading-tight lg:leading-tight animate-slideInFromRight`}
          >
            Digital Marketing {/*<span className="text-2xl">(R)</span> */}
          </h1>
          <div className="flex flex-col xl:flex-row items-center justify-center">
            <h2
              className={`${orbitron.className} basis-2/3 text-7xl sm:text-8xl md:text-9xl text-orange-500 tracking-widest mt-8 md:mt-4 xl:mt-8 animate-slideInFromLeft font-extrabold relative text-outline`}
            >
              AGENCY
            </h2>
            <p
              className={`${orbitron.className} basis-1/3 text-sm md:text-lg mt-8 md:mt-2 xl:mt-8 lg:text-lg text-white p-4 animate-slideInFromRight`}
            >
              From traditional PR and thought leadership campaigns to
              storytelling and creative social media management, we’ve got you
              covered.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
