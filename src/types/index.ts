export type SupportedLocale = "en" | "tr";
export const LOCALES: SupportedLocale[] = ["en", "tr"];
export const DEFAULT_LOCALE: SupportedLocale = "en";

export type Project = {
	id: number;
	title: string;
	description: string;
  githubUrl: string;
  images: string[];
};