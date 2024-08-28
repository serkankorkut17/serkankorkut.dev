import { useState } from "react";
import { Transition } from "@headlessui/react";
import NavData from "@/data/nav.json";
import Link from "next/link";
import DRNDigitalLogo from "@/images/drndigital-logo.png";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = NavData.navLinks;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
        <div className="fixed inset-y-0 left-0 z-30 w-64 p-6 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
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
            <img
              src={DRNDigitalLogo.src}
              className="h-48"
              alt="DRN Digital Logo"
            />
            <p className="block text-gray-800 text-xl font-semibold text-center">
              Serkan Korkut
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col">
            {navLinks.map((link, index) => (
              <div key={link.name}>
                <Link href={link.url}>
                  <span className="block text-gray-700 text-lg hover:text-orange-500 transition duration-200 ease-in-out cursor-pointer">
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
