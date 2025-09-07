import React from "react";

interface PageHeadingProps {
	title: string;
	subtitle: string;
	description?: string;
}

const PageHeading = ({ title, subtitle, description }: PageHeadingProps) => {
	return (
		<div className="text-start pb-8">
			<p className="text-orange-500 text-lg font-extrabold">.: {title.toUpperCase()}</p>
			<h2 className="text-4xl md:text-6xl font-extrabold mt-2">{subtitle}</h2>
			{description && (
				<p className="text-gray-600 mt-4 text-lg">{description}</p>
			)}
		</div>
	);
};

export default PageHeading;
