import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import ProjectsSection from "./ProjectsSection";

// This page is about my projects. I will list my projects here.
const ProjectsPage = () => {
  return (
    <main className="min-h-screen">
      <PageHeader title="My Projects" />
      <ProjectsSection />
    </main>
  );
};

export default ProjectsPage;
