"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import ProjectsData from "@/data/Projects.json";

// Import images for the projects
// FastAPI GraphQL Project
import ImgFastapiRest from "@/images/projects/fastapi-graphql/fastapi-docs.webp";
import ImgFastapiGraphql from "@/images/projects/fastapi-graphql/fastapi-graphql.webp";
import ImgFastapiMutations from "@/images/projects/fastapi-graphql/graphql-mutations.webp";
// Node.js Backend Project
import ImgNodejsHome from "@/images/projects/nodejs-backend/nodejs-home.webp";
import ImgNodejsHome2 from "@/images/projects/nodejs-backend/nodejs-home-2.webp";
import ImgNodejsHome3 from "@/images/projects/nodejs-backend/nodejs-home-3.webp";
import ImgNodejsHome4 from "@/images/projects/nodejs-backend/nodejs-home-4.webp";
import ImgNodejsHomeLight from "@/images/projects/nodejs-backend/nodejs-light.webp";
import ImgNodejsPost from "@/images/projects/nodejs-backend/nodejs-post.webp";
import ImgNodejsProfile from "@/images/projects/nodejs-backend/nodejs-profile.webp";
import ImgNodejsSaved from "@/images/projects/nodejs-backend/nodejs-saved.webp";
import ImgNodejsUsers from "@/images/projects/nodejs-backend/nodejs-users.webp";
import ImgNodejsSignup from "@/images/projects/nodejs-backend/nodejs-signup.webp";
import ImgNodejsSignup2 from "@/images/projects/nodejs-backend/nodejs-signup-2.webp";
import ImgNodejsSignup3 from "@/images/projects/nodejs-backend/nodejs-signup-3.webp";
import ImgNodejsLogin from "@/images/projects/nodejs-backend/nodejs-login.webp";
import ImgNodejsLogin2 from "@/images/projects/nodejs-backend/nodejs-login-2.webp";
// Leave Master - Backend Project
import ImgLeaveMasterB1 from "@/images/projects/leave-master-backend/leave-master-swagger-1.webp";
import ImgLeaveMasterB2 from "@/images/projects/leave-master-backend/leave-master-swagger-2.webp";
import ImgLeaveMasterB3 from "@/images/projects/leave-master-backend/leave-master-swagger-3.webp";
import ImgLeaveMasterB4 from "@/images/projects/leave-master-backend/leave-master-swagger-4.webp";
import ImgLeaveMasterBCode from "@/images/projects/leave-master-backend/leave-master-code.webp";
// Leave Master - Frontend Project
import ImgLeaveMasterCalendarDark from "@/images/projects/leave-master-frontend/leave-master-calendar-dark.webp";
import ImgLeaveMasterCalendarlight from "@/images/projects/leave-master-frontend/leave-master-calendar-light.webp";
import ImgLeaveMasterEmployee from "@/images/projects/leave-master-frontend/leave-master-employee.webp";
import ImgLeaveMasterRequest from "@/images/projects/leave-master-frontend/leave-master-request.webp";
import ImgLeaveMasterAdmin from "@/images/projects/leave-master-frontend/leave-master-admin.webp";
import ImgLeaveMasterEmployeeSignup from "@/images/projects/leave-master-frontend/leave-master-employee-signup.webp";
import ImgLeaveMasterLogin from "@/images/projects/leave-master-frontend/leave-master-login.webp";
// Invoice Payment Project
import ImgInvoicePayment from "@/images/projects/invoice-payment/invoice-payment-1.webp";
import ImgInvoicePayment2 from "@/images/projects/invoice-payment/invoice-payment-2.webp";
import ImgInvoicePayment3 from "@/images/projects/invoice-payment/invoice-payment-3.webp";
import ImgInvoicePayment4 from "@/images/projects/invoice-payment/invoice-payment-4.webp";
// Texture Mapping Project
import ImgTextureMappingAffine from "@/images/projects/texture-mapping/texture-affine.webp";
import ImgTextureMappingPerspectiveCorrect from "@/images/projects/texture-mapping/texture-perspective-correct.webp";
// Socket Programming Project
import ImgSocketProgrammingUsage from "@/images/projects/socket-programming/socket-usage.webp";
import ImgSocketProgrammingUsage2 from "@/images/projects/socket-programming/socket-usage-2.webp";
import ImgSocketProgrammingHumidity from "@/images/projects/socket-programming/socket-humidity.webp";
import ImgSocketProgrammingTemperature from "@/images/projects/socket-programming/socket-temperature.webp";
// MSSQL Database Project
import ImgDatabaseDiagram from "@/images/projects/mssql-database/database-diagram.webp";
import ImgDatabaseProcedure from "@/images/projects/mssql-database/database-procedure.webp";
import ImgDatabaseTrigger from "@/images/projects/mssql-database/database-trigger.webp";
import ImgDatabaseView from "@/images/projects/mssql-database/database-view.webp";
//Robotics Project
import ImgRobotics1 from "@/images/projects/robotics/robotics-draw-1.webp";
import ImgRobotics2 from "@/images/projects/robotics/robotics-draw-2.webp";
import ImgRobotics3 from "@/images/projects/robotics/robotics-draw-3.webp";
import ImgRoboticsCode from "@/images/projects/robotics/robotics-code.webp";
// Student Registration Project
import ImgStudentRegistrationVJava from "@/images/projects/student-registration/student-ver-java.webp";
import ImgStudentRegistrationVPython from "@/images/projects/student-registration/student-ver-python.webp";
import ImgStudentRegistrationJson1 from "@/images/projects/student-registration/student-json.webp";
import ImgStudentRegistrationJson2 from "@/images/projects/student-registration/student-json-2.webp";
import ImgStudentRegistrationJson3 from "@/images/projects/student-registration/student-json-3.webp";
import GalleryModal from "./GalleryModal";

type Project = {
	id: number;
	title: string;
	description: string;
  githubUrl: string;
};

const ProjectsSection = () => {
  const { title, subtitle, projects } = ProjectsData;

  // Create a mapping of project IDs to images with proper typing
  const projectImages: Record<number, StaticImageData[]> = {
    1: [ImgFastapiRest, ImgFastapiGraphql, ImgFastapiMutations],
    2: [
      ImgNodejsHome,
      ImgNodejsHome2,
      ImgNodejsHome3,
      ImgNodejsHome4,
      ImgNodejsHomeLight,
      ImgNodejsPost,
      ImgNodejsProfile,
      ImgNodejsSaved,
      ImgNodejsUsers,
      ImgNodejsSignup,
      ImgNodejsSignup2,
      ImgNodejsSignup3,
      ImgNodejsLogin,
      ImgNodejsLogin2,
    ],
    3: [
      ImgLeaveMasterB1,
      ImgLeaveMasterB2,
      ImgLeaveMasterB3,
      ImgLeaveMasterB4,
      ImgLeaveMasterBCode,
    ],
    4: [
      ImgLeaveMasterCalendarDark,
      ImgLeaveMasterCalendarlight,
      ImgLeaveMasterEmployee,
      ImgLeaveMasterRequest,
      ImgLeaveMasterAdmin,
      ImgLeaveMasterEmployeeSignup,
      ImgLeaveMasterLogin,
    ],
    5: [
      ImgInvoicePayment,
      ImgInvoicePayment2,
      ImgInvoicePayment3,
      ImgInvoicePayment4,
    ],
    6: [ImgTextureMappingAffine, ImgTextureMappingPerspectiveCorrect],
    7: [
      ImgSocketProgrammingUsage,
      ImgSocketProgrammingUsage2,
      ImgSocketProgrammingHumidity,
      ImgSocketProgrammingTemperature,
    ],
    8: [
      ImgDatabaseDiagram,
      ImgDatabaseProcedure,
      ImgDatabaseTrigger,
      ImgDatabaseView,
    ],
    9: [ImgRobotics1, ImgRobotics2, ImgRobotics3, ImgRoboticsCode],
    10: [
      ImgStudentRegistrationVJava,
      ImgStudentRegistrationVPython,
      ImgStudentRegistrationJson1,
      ImgStudentRegistrationJson2,
      ImgStudentRegistrationJson3,
    ],
  };

  // State for modal and carousel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<StaticImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Open modal with project images
  const openModal = (projectId: number, projectInfo: Project, currentImage: number = 0) => {
    const images = projectImages[projectId] || [];
    setSelectedImages(images);
    setCurrentImageIndex(currentImage);
    setCurrentProject(projectInfo);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setCurrentProject(null);
  };

  return (
    <section className="flex flex-col py-8 px-8 md:px-40 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">{title}</p>
        <h2 className="text-6xl font-extrabold mt-2 mb-8">{subtitle}</h2>
      </div>

      {/* Projects Grid */}
      <div className="space-y-24">
        {projects.map((project, projectIndex) => {
          const { id, title, description, githubUrl } = project;
          const images: StaticImageData[] = projectImages[id] || [];
          const isEven = projectIndex % 2 === 0;

          return (
            <div
              key={id}
              className={`flex flex-col ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } w-full gap-8`}
            >
              {/* Image Gallery Grid */}
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 5).map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                        imageIndex === 0 && images.length > 1 
                          ? "col-span-2" 
                          : ""
                      }`}
                      onClick={() => openModal(id, project, imageIndex)}
                    >
                      <Image
                        src={image}
                        alt={`${title} - Image ${imageIndex + 1}`}
                        className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                      />
                      
                      {/* Image count overlay for first image if more than 4 images */}
                      {imageIndex === 4 && images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            +{images.length - 4} more
                          </span>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-3">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <Link
                  className="w-fit decoration-orange-500 hover:underline"
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className="text-3xl text-orange-500 font-extrabold mb-4">
                    {title}
                  </h2>
                </Link>
                <p className="text-lg text-gray-700 mb-6">{description}</p>
                
                {/* Gallery preview */}
                <button
                  onClick={() => openModal(id, project)}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  <span>View Gallery ({images.length} images)</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for image gallery */}
      <GalleryModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedImages={selectedImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        currentProject={currentProject}
      />
    </section>
  );
};

export default ProjectsSection;
