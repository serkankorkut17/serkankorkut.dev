import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Sections/ContactSection";
import MapSection from "@/components/Sections/MapSection";
import ContactForm from "@/components/Sections/FormSection";
import WhiteSection from "@/components/Sections/WhiteSection";

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      <PageHeader title="Contact Us" />
      <ContactSection />
      <MapSection />
      <ContactForm />
      <WhiteSection />
    </main>
  );
};

export default ContactPage;
