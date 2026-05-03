import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CurrentlyStrip from "@/components/sections/CurrentlyStrip";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <About />
      <FeaturedWork />
      <CurrentlyStrip />
    </main>
  );
}
