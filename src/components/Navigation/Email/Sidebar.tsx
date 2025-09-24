"use client";

import { Drawer } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa";
import SidebarContent from "./SidebarContent";
import { useTheme } from "@/contexts/Theme";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {

    // Theme context
    const theme = useTheme();
    const isDarkMode = theme?.darkMode;
    const toggleDarkMode = theme?.toggleDarkMode;

    return (
        <>
            {/* Static Sidebar for sm - md and larger screens */}
            <aside className="hidden sm:block sm:w-16 md:block md:w-40 fixed top-[70px] pt-2 left-0 z-40 h-[calc(100vh-70px)] bg-white border-r-2 border-gray-200 dark:bg-black dark:border-zinc-800">
                <div className="flex flex-col justify-center items-center h-full relative pt-4">
                    <SidebarContent toggleSidebar={toggleSidebar} />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button
                            onClick={toggleDarkMode}
                            className="bg-gray-200 dark:bg-zinc-700 p-3 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 flex items-center justify-center"
                            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDarkMode ? (
                                <FaSun className="w-4 h-4 text-orange-500" />
                            ) : (
                                <FaMoon className="w-4 h-4 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Sidebar for mobile screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
            <Drawer
                open={isOpen}
                onClose={toggleSidebar}
                backdrop={false}
                className="md:hidden p-0 top-[70px] z-50 w-64 h-[calc(100vh-70px)] bg-white dark:bg-black border-r-2 border-gray-200 dark:border-zinc-800"
            >
                <SidebarContent toggleSidebar={toggleSidebar} />
            </Drawer>
        </>
    );
};

export default Sidebar;