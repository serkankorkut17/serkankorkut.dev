"use client";

import React from "react";

const HireMeSection = ({font}) => {
    console.log(font);
    
  const navigateToLinkedIn = () => {
    window.open("https://www.linkedin.com/in/serkankorkut17", "_blank");
  };

  return (
    <div className={`${font.className} relative`}>
      {/* Scrolling Text Section */}
      <div className="w-full bg-black py-4 overflow-hidden relative">
        <div className="scrolling-container">
          <div className="scrolling-text">
            <span className="scroll-item text-white text-xl font-medium">Hire a Developer - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Bring Your Ideas to Life - </span>
            <span className="scroll-item text-white text-xl font-medium">Freelance Projects Available - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Let&apos;s Build Something Amazing Together - </span>
            <span className="scroll-item text-white text-xl font-medium">Innovative Solutions - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Hire Me - </span>
            {/* Duplicate content for seamless scrolling */}
            <span className="scroll-item text-white text-xl font-medium">Hire a Developer - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Bring Your Ideas to Life - </span>
            <span className="scroll-item text-white text-xl font-medium">Freelance Projects Available - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Let&apos;s Build Something Amazing Together - </span>
            <span className="scroll-item text-white text-xl font-medium">Innovative Solutions - </span>
            <span className="scroll-item text-orange-500 text-xl font-medium">Hire Me - </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-16 px-8 md:px-40">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mb-4">Let&apos;s work together</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            I&apos;m available for freelance projects or a job. Let&apos;s work together
            to build something amazing and innovative.
          </p>
          <button
            className="bg-orange-500 text-white px-8 py-3 rounded-full mt-8 hover:bg-orange-400 transition duration-300 transform hover:scale-105 shadow-lg"
            onClick={navigateToLinkedIn}
          >
            Hire Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default HireMeSection;
