import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Sections/ContactSection";
import MapSection from "@/components/Sections/MapSection";
import ContactForm from "@/components/Sections/FormSection";
import HireMeSection from "@/components/Sections/HireMeSection";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const ContactPage = () => {


  return (
    <main className="min-h-screen">
      <PageHeader title="Contact Me" />
      <ContactSection />
      <MapSection />
      <ContactForm />
      <HireMeSection font={montserrat}/>
      
    </main>
  );
};

export default ContactPage;
