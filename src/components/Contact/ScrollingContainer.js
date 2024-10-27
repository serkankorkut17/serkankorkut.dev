import React from "react";
import ContactData from "@/data/contact.json";

const ScrollingContainer = () => {
  const { scrollingText } = ContactData.scrollingContainer;
  return (
    <div className="w-full bg-black py-4 overflow-hidden relative">
      <div className="scrolling-container">
        <div className="scrolling-text">
          {scrollingText.map((text, index) => (
            <span
              key={index}
              className={`${
                index % 2 == 0 ? "text-white" : "text-orange-500"
              } scroll-item text-xl font-medium`}
            >
              {text}
            </span>
          ))}
          {scrollingText.map((text, index) => (
            <span
              key={index}
              className={`${
                index % 2 == 0 ? "text-white" : "text-orange-500"
              } scroll-item text-xl font-medium`}
            >
              {text}
            </span>
          ))}
          {/* Duplicate content for seamless scrolling */}
        </div>
      </div>
    </div>
  );
};

export default ScrollingContainer;
