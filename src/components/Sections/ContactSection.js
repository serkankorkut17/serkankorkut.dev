import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="flex flex-col items-center py-16 px-8 md:px-24 bg-white">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-bold">.: HAVE QUESTIONS?</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Get In Touch!</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
        <div className="bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaMapMarkerAlt className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Location</h3>
          <p className="text-gray-700 mt-2">Berlin, Germany</p>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaPhoneAlt className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Phone No.</h3>
          <p className="text-gray-700 mt-2">+49 176 717 406 64</p>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg text-center shadow-md flex flex-col items-center">
          <FaEnvelope className="text-orange-500 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Mail Address</h3>
          <p className="text-gray-700 mt-2">info@drndigital.com</p>
          <p className="text-gray-700">drndgtl@gmail.com</p>
        </div>
      </div>
    </section>
  );
}
