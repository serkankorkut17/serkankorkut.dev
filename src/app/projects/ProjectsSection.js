"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, Modal } from "flowbite-react";

import ProjectsData from "@/data/projects.json";

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

const ProjectsSection = () => {
  const { title, subtitle, projects } = ProjectsData;

  // Create a mapping of project IDs to images
  const projectImages = {
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

  // State for modal visibility and the currently selected image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open the modal with the selected image
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <section className="flex flex-col py-8 px-8 md:px-40 bg-white text-black">
      <div className="text-start pb-12">
        <p className="text-orange-500 text-lg font-extrabold">{title}</p>
        <h2 className="text-6xl font-extrabold mt-2 mb-8">{subtitle}</h2>
      </div>
      {projects.map((project, index) => {
        const { id, title, description, githubUrl } = project;
        const images = projectImages[id] || []; // Get images for the current project

        // Conditional rendering based on index
        const isEven = index % 2 === 0;

        return (
          <div
            key={id}
            className={`flex flex-col ${
              isEven ? "lg:flex-row" : "lg:flex-row-reverse"
            } w-full gap-8 mb-32 lg:mb-16`}
          >
            {/* Carousel for each project */}
            <div className="w-full lg:w-1/2">
              <Carousel className="carousel">
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Project ${id} Image ${index + 1}`}
                    onClick={() => handleImageClick(image)} // Open modal on click
                    className="cursor-pointer" // Add cursor pointer for better UX
                  />
                ))}
              </Carousel>
            </div>
            {/* Project Details */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <Link
                className="w-fit decoration-orange-500 hover:underline"
                href={githubUrl}
              >
                <h2 className="text-3xl text-orange-500 font-extrabold mb-4">
                  {title}
                </h2>
              </Link>
              <p className="text-lg">{description}</p>
            </div>
          </div>
        );
      })}
      {/* Modal for displaying the selected image */}
      <Modal dismissible show={isModalOpen} onClose={closeModal} size="7xl" popup className="bg-black bg-opacity-80">
        <Modal.Header />
        <Modal.Body>
          {selectedImage && (
            <div className="flex justify-center">
              <Image src={selectedImage} alt="Selected Project Image" />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ProjectsSection;
