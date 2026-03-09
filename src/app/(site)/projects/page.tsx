import PageHeader from "@/components/Sections/PageHeader";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import ProjectsData from "@/data/Projects.json";
import { useLocale } from "next-intl";
import { SupportedLocale } from "@/types";

type LocalizedString = Record<SupportedLocale, string>;

type LocalizedProjectData = {
	title: LocalizedString;
	subtitle: LocalizedString;
	description: LocalizedString;
	projects: Array<{
		id: number;
		title: LocalizedString;
		description: LocalizedString;
		githubUrl: string;
		images: string[];
	}>;
};

const typedData = ProjectsData as unknown as LocalizedProjectData;

const ProjectsPage = () => {
	const locale: SupportedLocale = (useLocale() as SupportedLocale) || "en";

	const title = typedData.title[locale];
	const subtitle = typedData.subtitle[locale];
	const description = typedData.description[locale];
	const projects = typedData.projects.map((project) => ({
		...project,
		title: project.title[locale],
		description: project.description[locale],
	}));

	return (
		<main className="min-h-screen">
			<PageHeader title={subtitle} />
			<ProjectsSection title={title} subtitle={subtitle} description={description} projects={projects} />
		</main>
	);
};

export default ProjectsPage;
