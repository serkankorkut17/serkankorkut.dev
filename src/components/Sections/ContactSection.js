import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function ContactSection() {
  return (
    <section className={`${montserrat.className} flex flex-col py-16 px-8 md:px-40 bg-white`}>
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">.: HAVE QUESTIONS?</p>
        <h2 className="text-black text-6xl font-extrabold mt-2">
          Get In Touch!
        </h2>
      </div>

      <div className="text-black flex flex-col md:flex-row justify-between items-center w">
        <div className="w-[31%] bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaMapMarkerAlt className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Location</h3>
          <p className="text-gray-600 mt-2">İstanbul, Turkey</p>
        </div>

        <div className="w-[31%] bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaPhoneAlt className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Phone No.</h3>
          <p className="text-gray-600 mt-2">+49 176 717 406 64</p>
        </div>

        <div className="w-[31%] bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaEnvelope className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Mail Address</h3>
          <p className="text-gray-600 mt-2">serkankorkut17@gmail.com</p>
        </div>
      </div>
    </section>
  );
}
