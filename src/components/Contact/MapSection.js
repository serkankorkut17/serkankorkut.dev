
import ContactData from "@/data/contact.json";

export default function MapSection() {
  const link = ContactData.mapSection.link;

  return (
    <section className="flex justify-center py-8 px-8 md:px-40 bg-white">
      <div className="w-full h-[500px]">
        <iframe
          src={link}
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        ></iframe>
      </div>
    </section>
  );
}
