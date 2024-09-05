import React from "react";
import Logo from "@/images/SK_white.png";
import Link from "next/link";
import background from "@/images/background/main-footer-two-bg-1.webp";
import Image from "next/image";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = ({ font }) => {
  return (
    <footer className={`${font.className} relative`}>
      <div className="absolute inset-0 w-full h-full -z-40 bg-black">
        <Image
          src={background}
          priority={true}
          className="object-cover w-full h-full opacity-25"
          alt="Background"
        />
      </div>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image
                src={Logo}
                width={150}
                height={50}
                alt="DRN Digital Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                Serkan Korkut
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Resources
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link href="https://nextjs.org/" className="hover:underline">
                    Next.js
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://tailwindcss.com/"
                    className="hover:underline"
                  >
                    Tailwind CSS
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://flowbite.com/"
                    className="hover:underline"
                  >
                    Flowbite
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.plesk.com/"
                    className="hover:underline"
                  >
                    Plesk
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Follow me
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://github.com/serkankorkut17"
                    className="hover:underline "
                  >
                    Github
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.linkedin.com/in/serkankorkut17"
                    className="hover:underline"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.instagram.com/serkan.krktt/"
                    className="hover:underline"
                  >
                    Instagram
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://discord.gg/4eeurUVvTy"
                    className="hover:underline"
                  >
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Legal
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center text-gray-500">
            © 2024{" "}
            <a href="https://serkankorkut.dev/" className="hover:underline">
              Serkan Korkut™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link href="https://www.facebook.com/serkan.krktt/">
              <FaFacebookF className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://www.instagram.com/serkan.krktt/">
              <FaInstagram className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/serkankorkut17">
              <FaLinkedin className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://discord.gg/4eeurUVvTy">
              <FaDiscord className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://twitter.com/">
              <FaTwitter className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://github.com/serkankorkut17">
              <FaGithub className="text-gray-500 hover:text-white ms-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
