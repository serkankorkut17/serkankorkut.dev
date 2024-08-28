// pages/index.js
import Image from "next/image";
import background from "../images/background.png"; // Replace with your background image
import videoThumbnail from "../images/drndigital_white.png"; // Replace with your video thumbnail

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src={background}
        layout="fill"
        objectFit="cover"
        className="absolute -z-50 opacity-100"
        alt="Background"
      />

      <div className="text-center p-4">
        <div className="flex flex-row items-center justify-between mx-60">
          <div className="text-9xl mb-4 animate-bounce">↓</div>
          <div className="relative mt-8 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
            <Image
              src={videoThumbnail}
              layout="fill"
              objectFit="contain"
              alt="Video Thumbnail"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-9xl font-bold animate-slideInFromRight">
            Digital Marketing {/*<span className="text-2xl">(R)</span> */}
          </h1>
          <div className="flex flex-row items-center justify-center">
            <h2 className="basis-2/3 text-9xl text-orange-500 tracking-widest mt-4 animate-slideInFromLeft">
              AGENCY
            </h2>
            <p className="basis-1/3 text-lg">
              From traditional PR and thought leadership campaigns to
              storytelling and creative social media management, we’ve got you
              covered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
