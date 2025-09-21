"use client";

import { Drawer } from "flowbite-react";
// import AuthContext from "@/contexts/AuthContext";
import { DarkThemeToggle } from "flowbite-react";
import SidebarContent from "./SidebarContent";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    return (
        <>
            {/* Static Sidebar for sm - md and larger screens */}
            <aside className="hidden sm:block sm:w-16 md:block md:w-40 fixed top-[70px] pt-2 left-0 z-40 h-[calc(100vh-70px)] bg-white border-r-2 border-gray-200 dark:bg-black dark:border-zinc-800">
                <div className="flex flex-col justify-center items-center h-full relative pt-4">
                    <SidebarContent toggleSidebar={toggleSidebar} />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <DarkThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Sidebar for mobile screens */}
            <Drawer
                open={isOpen}
                onClose={toggleSidebar}
                className="md:hidden p-0 top-[70px] z-50 w-64 h-[calc(100vh-70px)] bg-white dark:bg-black border-r-2 border-gray-200 dark:border-zinc-800"
            >
                <SidebarContent toggleSidebar={toggleSidebar} />
            </Drawer>
        </>
    );
};

export default Sidebar;