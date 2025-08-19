import React from "react";
import Logo from "@/images/logo/logo-transparent.png";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaDiscord,
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import footerData from "@/data/footer.json";

const Footer = () => {
  const { aboutMe, resources, followMe, accounts } = footerData;
  return (
    <footer className="relative bg-black text-gray-300">
      <div className="mx-auto w-full max-w-(--breakpoint-xl) p-6 lg:py-10 relative">
        {/* Top Section */}
        <div className="md:flex md:justify-between">
          {/* Logo & Title */}
          <div className="mb-10 md:mr-20 lg:mr-40 md:mb-0 flex flex-col items-start">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Image
                  src={Logo}
                  width="160"
                  className="h-auto w-40"
                  alt="Serkan Korkut Logo"
                  priority
                />
              </div>
            </Link>
            <p className="text-3xl font-extrabold text-gray-100">
              Serkan Korkut
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-12 sm:grid-cols-3 text-right">
            {/* About Me */}
            <div className="flex flex-col">
              <h2 className="mb-4 text-xl font-bold text-white uppercase">
                {aboutMe.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                {aboutMe.description}
              </p>
            </div>

            {/* Resources */}
            <div className="flex flex-col">
              <h2 className="mb-4 text-xl font-bold text-white uppercase">
                {resources.title}
              </h2>
              <ul className="text-sm text-gray-400 space-y-2">
                {resources.items.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="hover:text-orange-500 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="flex flex-col">
              <h2 className="mb-4 text-xl font-bold text-white uppercase">
                {followMe.title}
              </h2>
              <ul className="text-sm text-gray-400 space-y-2">
                {followMe.items.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="hover:text-orange-500 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          {/* Copyright */}
          <span className="text-sm text-gray-400 sm:text-center">
            © 2024{" "}
            <Link
              href="/"
              className="hover:text-orange-500 transition"
            >
              Serkan Korkut™
            </Link>
            . All Rights Reserved.
          </span>

          {/* Social Media Icons */}
          <div className="flex space-x-6 mt-4 sm:mt-0 justify-center">
            {accounts.linkedIn.show && (
              <Link href={accounts.linkedIn.url}>
                <FaLinkedin className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
            {accounts.github.show && (
              <Link href={accounts.github.url}>
                <FaGithub className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
            {accounts.facebook.show && (
              <Link href={accounts.facebook.url}>
                <FaFacebookF className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
            {accounts.instagram.show && (
              <Link href={accounts.instagram.url}>
                <FaInstagram className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
            {accounts.discord.show && (
              <Link href={accounts.discord.url}>
                <FaDiscord className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
            {accounts.twitter.show && (
              <Link href={accounts.twitter.url}>
                <FaTwitter className="text-gray-400 hover:text-white transition-transform transform hover:scale-125" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
