import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Sections/ContactSection";
import WhiteSection from "@/components/Sections/WhiteSection";

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      <PageHeader title="Contact Us" />
      <ContactSection />
      <WhiteSection />
    </main>
  );
};

export default ContactPage;
