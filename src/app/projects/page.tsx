import PageHeader from "@/components/Sections/PageHeader";
import ProjectsSection from "../../components/Projects/ProjectsSection";

const ProjectsPage = () => {
  return (
    <main className="min-h-screen">
      <PageHeader title="My Projects" />
      <ProjectsSection />
    </main>
  );
};

export default ProjectsPage;
