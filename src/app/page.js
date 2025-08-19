import HeroSection from "@/components/Home/HeroSection";
import AboutSection from "@/components/Home/AboutSection";

// This is the home page of the website. It contains the hero section and the about section.
export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
    </main>
  );
}
