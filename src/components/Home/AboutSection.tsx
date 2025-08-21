import { FaNodeJs, FaPython, FaReact, FaDatabase } from "react-icons/fa";
import {
	SiFastapi,
	SiDotnet,
	SiGraphql,
	SiPostman,
	SiWordpress,
	// SiVulkan,
	// SiCplusplus,
} from "react-icons/si";
import { Orbitron } from "next/font/google";
import HomeData from "@/data/HomePage.json";
import { useLocale } from "next-intl";
import { SupportedLocale } from "@/types";

const orbitron = Orbitron({
	weight: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

export default function AboutSection() {
	const currentLocale: SupportedLocale = useLocale() as SupportedLocale;
	const locale = currentLocale || "en";

	const { title, description, skills, cta } = HomeData.AboutSection[locale];

	return (
		<section className="relative bg-white py-16 px-8 md:py-24 md:px-32">
			<div className="text-center mb-16">
				<h2
					className={`${orbitron.className} text-black text-4xl md:text-5xl font-extrabold mb-4`}
				>
					{title}
				</h2>
				<p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
					{description}
				</p>
			</div>

			{/* Skills Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{/* Node.js Section */}
				{skills.node.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<FaNodeJs className="text-5xl text-green-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.node.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.node.description}
						</p>
					</div>
				)}

				{/* Python Section */}
				{skills.python.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<FaPython className="text-5xl text-yellow-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.python.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.python.description}
						</p>
					</div>
				)}

				{/* C# Section */}
				{skills.dotnet.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<SiDotnet className="text-5xl text-purple-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.dotnet.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.dotnet.description}
						</p>
					</div>
				)}

				{/* React Section */}
				{skills.react.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<FaReact className="text-5xl text-blue-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.react.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.react.description}
						</p>
					</div>
				)}

				{/* FastAPI Section */}
				{skills.fastapi.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<SiFastapi className="text-5xl text-teal-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.fastapi.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.fastapi.description}
						</p>
					</div>
				)}

				{/* Database Section */}
				{skills.database.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
						<FaDatabase className="text-5xl text-red-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.database.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.database.description}
						</p>
					</div>
				)}

				{/* GraphQL Section */}
				{skills.graphql.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
						<SiGraphql className="text-5xl text-pink-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.graphql.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.graphql.description}
						</p>
					</div>
				)}

				{/* REST API Section */}
				{skills.restapi.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
						<SiPostman className="text-5xl text-orange-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.restapi.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.restapi.description}
						</p>
					</div>
				)}

				{/* WordPress Section */}
				{skills.wordpress.show && (
					<div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
						<SiWordpress className="text-5xl text-blue-500 mb-4 mx-auto" />
						<h3 className="text-xl font-bold text-black mb-2">
							{skills.wordpress.title}
						</h3>
						<p className="text-gray-600 text-md">
							{skills.wordpress.description}
						</p>
					</div>
				)}

				{/* Additional Section */}
				{/* <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
          <SiCplusplus className="text-5xl text-blue-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">Vulkan Renderer</h3>
          <p className="text-gray-600 text-md">
            Currently developing a custom renderer using Vulkan API to explore
            advanced rendering techniques and other smaller tasks related to
            graphics programming.
          </p>
        </div> */}
			</div>

			{/* CTA Section */}
			<div className="mt-16 text-center">
				<h3
					className={`${orbitron.className} text-black text-2xl md:text-3xl font-bold mb-6`}
				>
					{cta.text}
				</h3>
				<a
					href="/contact"
					className="inline-block bg-orange-500 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg md:text-xl font-semibold transition duration-300"
				>
					{cta.buttonText}
				</a>
			</div>
		</section>
	);
}
