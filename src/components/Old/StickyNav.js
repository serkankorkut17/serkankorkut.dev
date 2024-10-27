// NOT USED IN THIS PROJECT
import { useEffect, useState } from "react";
import MobileNavigation from "../Navigation/MobileNavigation";
import Logo from "@/images/logo/logo-transparent.png"
import Image from "next/image";
import Link from "next/link";

const StickyNav = ({ font, navLinks }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 120);
      //setIsSticky(window.scrollY > window.innerHeight); // Makes nav sticky after scrolling 1 full screen height
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        font.className
      } py-2 px-4 w-full top-0 left-0 z-30 transition-transform ease-in-out duration-1000 transform ${
        isSticky
          ? "fixed bg-black shadow-lg translate-y-0"
          : "hidden -translate-y-full"
      }`}
    >
      <div className="max-w-full h-20 mx-auto lg:mx-24 xl:mx-48 flex justify-between md:justify-evenly items-center">
        <div className="flex space-x-3">
          <Link href="/">
            <Image src={Logo} alt="DRN Digital Logo" width={75} height={75} />
          </Link>
          {/* <span className="text-2xl font-semibold">Serkan Korkut</span> */}
        </div>
        <div className="md:basis-3/4 flex flex-col md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <MobileNavigation />
          <div
            className="items-center justify-between hidden w-full md:flex flex-col md:flex-row md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
              {navLinks.map((link) => (
                <li key={link.name} className="md:mt-0">
                  <Link href={link.url}>
                    <span className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="#" className="">
                <button
                  type="button"
                  id="navbar-btn"
                  className="text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                >
                  Contact
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNav;
