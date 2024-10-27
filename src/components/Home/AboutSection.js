import { FaNodeJs, FaPython, FaReact, FaDatabase } from "react-icons/fa";
import {
  SiFastapi,
  SiDotnet,
  SiGraphql,
  SiPostman,
  SiWordpress,
  SiVulkan,
  SiCplusplus,
} from "react-icons/si";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function AboutSection() {
  return (
    <section className="relative bg-white py-16 px-8 md:py-24 md:px-32">
      <div className="text-center mb-16">
        <h2
          className={`${orbitron.className} text-black text-4xl md:text-5xl font-extrabold mb-4`}
        >
          About Me
        </h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          I&apos;m Serkan Korkut, a software engineer passionate about back-end
          development. I have a solid foundation in various technologies and
          frameworks, and I&apos;m always looking for new opportunities to grow
          and collaborate on exciting projects.
        </p>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Node.js Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <FaNodeJs className="text-5xl text-green-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">
            Node.js & Express
          </h3>
          <p className="text-gray-600 text-md">
            Experienced in building RESTful APIs and backend services using
            Node.js and Express.js.
          </p>
        </div>

        {/* Python Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <FaPython className="text-5xl text-yellow-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">
            Python
          </h3>
          <p className="text-gray-600 text-md">
          Proficient in developing high-performance backend applications with Python.
          </p>
        </div>

        {/* C# Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <SiDotnet className="text-5xl text-purple-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">C# & .NET Core</h3>
          <p className="text-gray-600 text-md">
            Familiar with building enterprise applications using C# and .NET
            Core, including ASP.NET Core.
          </p>
        </div>

        {/* React Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <FaReact className="text-5xl text-blue-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">React & Next.js</h3>
          <p className="text-gray-600 text-md">
            Experienced with React and Next.js for building interactive and
            dynamic web applications.
          </p>
        </div>

        {/* FastAPI Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <SiFastapi className="text-5xl text-teal-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">FastAPI</h3>
          <p className="text-gray-600 text-md">
            Built fast and efficient backend services using FastAPI, integrated
            with GraphQL for flexible and precise data handling.
          </p>
        </div>

        {/* Database Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <FaDatabase className="text-5xl text-red-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">SQL & MongoDB</h3>
          <p className="text-gray-600 text-md">
            Strong knowledge of relational databases (PostgreSQL, MySQL) and
            NoSQL databases (MongoDB).
          </p>
        </div>

        {/* GraphQL Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
          <SiGraphql className="text-5xl text-pink-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">GraphQL</h3>
          <p className="text-gray-600 text-md">
            Skilled in developing robust APIs with GraphQL, enabling efficient
            data retrieval and flexible query capabilities.
          </p>
        </div>

        {/* REST API Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
          <SiPostman className="text-5xl text-orange-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">REST API</h3>
          <p className="text-gray-600 text-md">
            Experienced in designing and implementing scalable REST APIs for
            seamless integration and high-performance web services.
          </p>
        </div>

        {/* WordPress Section */}
        <div className="bg-gray-100 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 mt-6">
          <SiWordpress className="text-5xl text-blue-500 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">
            WordPress Development
          </h3>
          <p className="text-gray-600 text-md">
            Developed WordPress websites and optimized SEO to boost visibility
            and search rankings, delivering scalable solutions.
          </p>
        </div>

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
          Interested in collaborating or hiring me?
        </h3>
        <a
          href="/contact"
          className="inline-block bg-orange-500 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg md:text-xl font-semibold transition duration-300"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
