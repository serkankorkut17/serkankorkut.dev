import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CurrentlyStrip from "@/components/sections/CurrentlyStrip";
import Terminal from "@/components/terminal/Terminal";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <Reveal>
        <Terminal />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <FeaturedWork />
      </Reveal>
      <Reveal>
        <CurrentlyStrip />
      </Reveal>
    </main>
  );
}
