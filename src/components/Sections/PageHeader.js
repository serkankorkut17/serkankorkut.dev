import Image from "next/image";
// import background from "@/images/background/page-header-bg.webp";

export default function PageHeader({ title, font }) {
  return (
    <section className={`flex items-center justify-center h-64 md:h-80 lg:h-96 w-full bg-gradient-to-b from-black to-gray-950`}>
      {/* Background Image */}
      {/* <div className="absolute inset-0 w-full h-full -z-40 bg-black">
        <Image
          src={background}
          priority={true}
          className="object-cover w-full h-[352px] md:h-[416px] lg:h-[480px]"
          alt="Background"
        />
      </div> */}
      <div className="relative z-10 text-center pb-24">
        <h1
          className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold"
        >
          {title.toUpperCase()}
        </h1>
        <p className="text-orange-500 font-bold mt-2"><span className="text-white">HOME</span> / {title.toUpperCase()}</p>
      </div>
    </section>
  );
}
