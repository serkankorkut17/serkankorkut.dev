"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProjectsData from "@/data/Projects.json";
import GalleryModal from "./GalleryModal";

type Project = {
	id: number;
	title: string;
	description: string;
  githubUrl: string;
  images: string[];
};

const ProjectsSection = () => {
  const { title, subtitle, projects } = ProjectsData;


  // State for modal and carousel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Open modal with project images
  const openModal = (projectId: number, projectInfo: Project, currentImage: number = 0) => {
    const images = projectInfo.images || [];
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
          const { id, title, description, githubUrl, images } = project;
          // const images: StaticImageData[] = projectImages[id] || [];
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
                      key={projectIndex + "-"+ imageIndex}
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
                        width={500}
                        height={192}
                        style={{ objectFit: "cover" }}
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
