"use client";

import React from "react";
import ContactData from "@/data/contact.json";

const HireMeSection = () => {
  const { title, text, button, linkedIn } = ContactData.hireMeSection;

  const navigateToLinkedIn = () => {
    window.open(linkedIn, "_blank");
  };

  return (
    <div className={`relative`}>
      {/* Main Content */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-16 px-8 md:px-40">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {text}
          </p>
          <button
            className="bg-orange-500 text-white px-8 py-3 rounded-lg mt-8 hover:bg-orange-400 transition duration-300 transform hover:scale-105 shadow-lg"
            onClick={navigateToLinkedIn}
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HireMeSection;
