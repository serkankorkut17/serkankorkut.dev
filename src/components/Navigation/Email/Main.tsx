import React from "react";

interface MainProps {
    children: React.ReactNode;
    className?: string;
}
const Main = ({ children, className = "" }: MainProps) => {
    return (
        <main className={`sm:ml-16 md:ml-40 ${className}`}>
            <div className="border-dashed rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 mt-[70px]">
                {children}
            </div>
        </main>
    );
};

export default Main;