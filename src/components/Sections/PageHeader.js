import Image from "next/image";
import background from "@/images/background/page-header-bg.webp";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function PageHeader({ title }) {
  return (
    <section className="relative flex items-center justify-center h-64 md:h-80 lg:h-96 w-full overflow-hidden">
      <Image
        src={background}
        priority={true}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        alt="Background"
      />
      <div className="text-center pb-24">
        <h1
          className={`${orbitron.className} text-white text-4xl md:text-5xl lg:text-6xl font-extrabold`}
        >
          {title.toUpperCase()}
        </h1>
        <p className="text-orange-500 font-bold mt-2"><span className="text-white">HOME</span> / {title.toUpperCase()}</p>
      </div>
    </section>
  );
}
