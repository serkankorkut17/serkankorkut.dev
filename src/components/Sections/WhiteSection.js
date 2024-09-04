import React from 'react'
import Image from "next/image";
import background from "@/images/background/services-one-bg-1.webp";

const WhiteSection = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-between pb-4 px-8 md:pb-12 md:px-24">
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
  )
}

export default WhiteSection