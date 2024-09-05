import React from "react";
import PageHeader from "@/components/Sections/PageHeader";
import CarouselSection from "@/components/Carousel";
import WhiteSection from "@/components/Sections/WhiteSection";

const ProjectsPage = () => {

  return (
    <main className="min-h-screen">
      <PageHeader title="My Projects" />
      <div className="flex justify-center items-center bg-white">
        <CarouselSection />
      </div>
      <WhiteSection />
    </main>
  );
};

export default ProjectsPage;
