"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation/Extras/Navigation";
import Sidebar from "@/components/Navigation/Extras/Sidebar";

// NavLayout component that includes the Navigation and Sidebar components
const NavLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <>
            <Navigation toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default NavLayout;