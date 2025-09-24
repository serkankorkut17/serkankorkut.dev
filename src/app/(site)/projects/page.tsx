import PageHeader from "@/components/Sections/PageHeader";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import ProjectsData from "@/data/Projects.json";

const ProjectsPage = () => {
	const { title, subtitle, description, projects } = ProjectsData;
	return (
		<main className="min-h-screen">
			<PageHeader title="My Projects" />
			<ProjectsSection title={title} subtitle={subtitle} description={description} projects={projects} />
		</main>
	);
};

export default ProjectsPage;
