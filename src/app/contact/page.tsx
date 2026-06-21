import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Serkan Korkut — backend engineer @ MapaGlobal.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Contact />
    </main>
  );
}
