import { useState } from "react";
import Link from "next/link";

const MobileNavItem = ({ link, toggleSidebar }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mb-2">
            {link.subLinks ? (
                <>
                    <button
                        onClick={handleExpand}
                        className="w-full flex items-center justify-between text-left text-gray-700 text-lg font-medium hover:text-orange-500 transition duration-200 ease-in-out cursor-pointer px-4 py-2"
                    >
                        <span>{link.name}</span>
                        {/* Açılır simge; genişletildiğinde döner */}
                        <span
                            className={`transform transition-transform duration-200 ${
                                isExpanded ? "rotate-90" : ""
                            }`}
                        >
                            ▸
                        </span>
                    </button>
                    {isExpanded && (
                        <div className="pl-6 mt-2 space-y-1">
                            <hr className="border-gray-100 my-2" />
                            {link.subLinks.map((subLink, index) => (
                                <Link
                                    key={subLink.name}
                                    href={subLink.url}
                                    onClick={toggleSidebar}
                                >
                                    <span className="block text-gray-700 text-lg font-medium hover:text-orange-500 transition duration-200 ease-in-out cursor-pointer px-4 py-2">
                                        {subLink.name}
                                    </span>
                                    {index < link.subLinks.length - 1 && (
                                        <hr key={index+"hr"} className="border-gray-100 my-2" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <Link href={link.url} onClick={toggleSidebar}>
                    <span className="block text-gray-700 text-lg font-medium hover:text-orange-500 transition duration-200 ease-in-out cursor-pointer px-4 py-2">
                        {link.name}
                    </span>
                </Link>
            )}
        </div>
    );
};

export default MobileNavItem;
