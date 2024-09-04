import React from "react";
import Logo from "@/images/drndigital_white.png";
import Link from "next/link";
import background from "@/images/background/main-footer-two-bg-1.webp";
import Image from "next/image";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";


import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["500"],
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer class={`${montserrat.className} relative`}>
      <div className="absolute inset-0 w-full h-full -z-40">
        <Image
          src={background}
          priority={true}
          className="object-cover w-full h-full opacity-50"
          alt="Background"
        />
      </div>
      <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
            <Link href="/">
              <img src={Logo.src} className="h-28" alt="DRN Digital Logo" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
                Serkan Korkut
              </span>
            </Link>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 class="mb-6 text-sm font-semibold uppercase text-white">
                Resources
              </h2>
              <ul class="text-gray-400 font-medium">
                <li class="mb-4">
                  <a href="https://flowbite.com/" class="hover:underline">
                    Flowbite
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" class="hover:underline">
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="mb-6 text-sm font-semibold uppercase text-white">
                Follow us
              </h2>
              <ul class="text-gray-400 font-medium">
                <li class="mb-4">
                  <a
                    href="https://github.com/themesberg/flowbite"
                    class="hover:underline "
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/4eeurUVvTy"
                    class="hover:underline"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="mb-6 text-sm font-semibold uppercase text-white">
                Legal
              </h2>
              <ul class="text-gray-400 font-medium">
                <li class="mb-4">
                  <a href="#" class="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" class="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr class="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm sm:text-center text-gray-400">
            © 2024{" "}
            <a href="https://drndigital.com/" class="hover:underline">
              DRN Digital™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link href="https://www.facebook.com/serkankorkut">
                <FaFacebookF className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://www.instagram.com/serkankorkut">
                <FaInstagram className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://discord.gg/4eeurUVvTy">
                <FaDiscord className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="https://twitter.com/serkankorkut">
                <FaTwitter className="text-gray-500 hover:text-white ms-5" />
            </Link>
            <Link href="/">
                <FaGithub className="text-gray-500 hover:text-white ms-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
