import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work — backend services, full-stack apps, and academic projects by Serkan Korkut.",
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Projects />
    </main>
  );
}
