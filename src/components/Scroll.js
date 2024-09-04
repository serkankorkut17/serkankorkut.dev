"use client";

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if running in browser
    if (typeof window !== "undefined") {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      // Add event listener
      window.addEventListener('scroll', toggleVisibility);
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-2 bg-white rounded-full shadow-md transition duration-300 hover:bg-gray-200"
        >
          <FaArrowUp className="text-orange-500" size={24} />
        </button>
      )}
    </div>
  );
}
