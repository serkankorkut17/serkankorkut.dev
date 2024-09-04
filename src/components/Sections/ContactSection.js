import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { PiMapPinArea } from "react-icons/pi";
import { PiPhoneCall } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import { Montserrat } from "next/font/google";
import ContactData from "@/data/contact.json";
import Link from "next/link";

const montserrat = Montserrat({
  weight: ["500"],
  subsets: ["latin"],
});

export default function ContactSection() {
  const { title, subtitle, location, phone, email } = ContactData.contactSection;

  return (
    <section
      className={`${montserrat.className} flex flex-col py-16 px-8 md:px-40 bg-white`}
    >
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">
          {title}
        </p>
        <h2 className="text-black text-6xl font-extrabold mt-2">
          {subtitle}
        </h2>
      </div>

      <div className="text-black flex flex-col xl:flex-row justify-between items-center">
        <div className="w-[90%] sm:w-[75%] xl:w-[31%] bg-gray-100 py-4 rounded-lg shadow-md flex flex-row mb-8">
          <PiMapPinArea className="w-1/4 text-orange-500 text-6xl mb-4" />
          <div className="w-3/4 flex flex-col">
            <h3 className="text-xl font-bold">{location.title}</h3>
            <Link href={location.link} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 mt-2">{location.address}</Link>
          </div>
        </div>

        <div className="w-[90%] sm:w-[75%] xl:w-[31%] bg-gray-100 py-4 rounded-lg shadow-md flex flex-row mb-8">
          <PiPhoneCall className="w-1/4 text-orange-500 text-6xl mb-4" />
          <div className="w-3/4 flex flex-col">
          <h3 className="text-xl font-bold">{phone.title}</h3>
          <Link href={phone.link} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 mt-2">{phone.number}</Link>
          </div>
        </div>

        <div className="w-[90%] sm:w-[75%] xl:w-[31%] bg-gray-100 py-4 rounded-lg shadow-md flex flex-row mb-8">
          <TfiEmail className="w-1/4 text-orange-500 text-6xl mb-4" />
          <div className="w-3/4 flex flex-col">
          <h3 className="text-xl font-bold">{email.title}</h3>
          <Link href={email.link} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 mt-2">{email.email}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
