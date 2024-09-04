import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Sections/ContactSection";
import MapSection from "@/components/Sections/MapSection";
import ContactForm from "@/components/Sections/FormSection";

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      <PageHeader title="Contact Us" />
      <ContactSection />
      <MapSection />
      <ContactForm />
    </main>
  );
};

export default ContactPage;
