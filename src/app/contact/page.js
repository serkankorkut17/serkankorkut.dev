import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Contact/ContactSection";
import MapSection from "@/components/Contact/MapSection";
import ContactForm from "@/components/Contact/FormSection";
import ScrollingContainer from "@/components/Contact/ScrollingContainer";
import HireMeSection from "@/components/Contact/HireMeSection";

// This page is about contacting me. You can find my contact information here.
const ContactPage = () => {
  return (
    <main className={`min-h-screen`}>
      <PageHeader title="Contact Me" />
      <ContactSection />
      <MapSection />
      <ContactForm />
      <ScrollingContainer />
      <HireMeSection />
    </main>
  );
};

export default ContactPage;
