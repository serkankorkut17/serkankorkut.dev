import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import NavData from "@/data/nav.json";
import Link from "next/link";
import Logo from "@/images/SK_black.png";
import Image from "next/image";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference for sidebar

  const navLinks = NavData.navLinks;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  // Detect click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleCloseSidebar(); // Close sidebar if clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={toggleSidebar}
        type="button"
        className="flex items-center p-2 w-10 h-10 justify-center text-sm text-orange-500 rounded-lg md:hidden"
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-10 h-10"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div
          className="fixed inset-0 z-50 w-64 h-screen p-6 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          ref={sidebarRef}
        >
          {/* Close button positioned to the right */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-black transition duration-200 ease-in-out"
            >
              <svg
                className="w-10 h-10"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>

          {/* Logo and Title */}
          <div className="flex flex-col justify-center items-center mb-8">
            <Image src={Logo} className="h-48" alt="Serkan Korkut Logo" />
            <p className="block text-gray-800 text-xl font-bold text-center">
              Serkan Korkut
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col">
            {navLinks.map((link, index) => (
              <div key={link.name}>
                <Link href={link.url} onClick={toggleSidebar}>
                  <span className="block text-gray-700 text-lg font-medium hover:text-orange-500 transition duration-200 ease-in-out cursor-pointer">
                    {link.name}
                  </span>
                </Link>
                {/* Add a divider line except after the last link */}
                {index < navLinks.length - 1 && (
                  <hr className="border-gray-100 my-2" />
                )}
              </div>
            ))}
            <hr className="border-gray-100 my-2" />
          </nav>
        </div>
      </Transition>
    </div>
  );
}
