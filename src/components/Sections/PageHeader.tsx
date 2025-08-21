
import { useTranslations } from "next-intl";
interface PageHeaderProps {
	title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
	const t = useTranslations("PageHeader");

	return (
		<section className="flex items-center justify-center h-64 md:h-80 lg:h-96 w-full bg-linear-to-b from-black to-gray-950">
			<div className="relative z-10 text-center pb-24">
				<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold">
					{title.toUpperCase()}
				</h1>
				<p className="text-orange-500 font-bold mt-2">
					<span className="text-white">{t("title").toUpperCase()}</span> / {title.toUpperCase()}
				</p>
			</div>
		</section>
	);
}
