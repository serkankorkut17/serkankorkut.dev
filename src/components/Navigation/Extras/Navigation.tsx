"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Navbar,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";
import LogoLight from "@/images/logo/logo-light.png";
import LogoDark from "@/images/logo/logo-dark.png";
// import AuthContext from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/Theme";

interface NavigationProps {
    toggleSidebar: () => void;
}

// Navigation component that includes the Navbar and user dropdown
const Navigation = ({ toggleSidebar }: NavigationProps) => {
    // const { user, logout } = useContext(AuthContext);
    const user = { firstName: "John", lastName: "Doe", username: "johndoe", email: "john.doe@example.com" };
    const logout = () => { console.log("Logged out"); };

    // Theme context
    const { toggleDarkMode } = useTheme();

    return (
        <Navbar
            fluid={true}
            rounded={false}
            className="fixed top-0 z-50 w-full h-[70px] bg-white border-b-2 border-gray-200 dark:bg-black dark:border-zinc-800"
        >
            {/* Left section: Sidebar toggle button + Logo */}
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden dark:text-gray-400"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                        />
                    </svg>
                </button>
                <Link href="/" className="flex ms-2 md:me-24 items-center">
                    {/* Light mode logo */}
                    <Image
                        src={LogoLight}
                        alt="MailMorph Logo"
                        width={50}
                        height={50}
                        className="block dark:hidden"
                    />
                    {/* Dark mode logo */}
                    <Image
                        src={LogoDark}
                        alt="MailMorph Logo"
                        width={50}
                        height={50}
                        className="hidden dark:block"
                    />
                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white pl-2">
                        MailMorph
                    </span>
                </Link>
            </div>

            {/* Right section: User dropdown */}
            <div className="flex items-center">
                <Dropdown
                    arrowIcon={false}
                    inline={true}
                    label={
                        <Image
                            src="/default-avatar.png"
                            alt="user photo"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                        />
                    }
                >
                    <DropdownHeader>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {user
                                ? user.firstName + " " + user.lastName
                                : "Guest"}
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user ? user.email : "Not logged in"}
                        </p>
                    </DropdownHeader>
                    <DropdownItem
                        as={Link}
                        href={`/profile/${user ? user.username : ""}`}
                    >
                        My Profile
                    </DropdownItem>
                    <DropdownItem as="button" onClick={toggleDarkMode}>
                        Dark Mode
                    </DropdownItem>
                    <DropdownItem as={Link} href={`/settings`}>
                        Settings
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem as={Link} href={`/`} onClick={logout}>
                        Sign out
                    </DropdownItem>
                </Dropdown>
            </div>
        </Navbar>
    );
};

export default Navigation;