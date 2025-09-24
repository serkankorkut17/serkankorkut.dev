import PageHeader from "@/components/Sections/PageHeader";
import ContactSection from "@/components/Contact/ContactSection";
import MapSection from "@/components/Contact/MapSection";
import ContactForm from "@/components/Contact/FormSection";
import ScrollingContainer from "@/components/Contact/ScrollingContainer";
import HireMeSection from "@/components/Contact/HireMeSection";
import ContactData from "@/data/Contact.json";
import { useLocale } from "next-intl";
import { SupportedLocale } from "@/types";

const ContactPage = () => {
  const currentLocale: SupportedLocale = useLocale() as SupportedLocale;
  const locale = currentLocale || "en";
  const pageTitle = ContactData.title[locale] || "Contact Me";
  const contactSession = ContactData.ContactSection[locale]
  const { link } = ContactData.mapSection;
  const formSection = ContactData.formSection[locale];
  const scrollingText = ContactData.scrollingContainer.scrollingText[locale];
  const hireMeSection = ContactData.hireMeSection[locale];

  return (
    <main className="min-h-screen">
      <PageHeader title={pageTitle} />
      <ContactSection
        title={contactSession.title}
        subtitle={contactSession.subtitle}
        location={contactSession.location}
        phone={contactSession.phone}
        email={contactSession.email}
      />
      <MapSection link={link} />
      <ContactForm 
        title={formSection.title}
        success={formSection.success}
        error={formSection.error}
        form={formSection.form}
      />
      <ScrollingContainer scrollingText={scrollingText} />
      <HireMeSection 
        title={hireMeSection.title}
        text={hireMeSection.text}
        button={hireMeSection.button}
        linkedIn={hireMeSection.linkedIn}
      />
    </main>
  );
};

export default ContactPage;
