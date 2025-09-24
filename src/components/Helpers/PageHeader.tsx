import React from "react";
import { Button } from "flowbite-react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    label?: string;
    actionLink?: string;
    actionLabel?: string;
    actionIcon?: React.ComponentType<{ className?: string }>;
}

// PageHeader component that displays a header with an icon, title, subtitle, and an optional action button
export default function PageHeader({
    icon: Icon,
    title,
    subtitle,
    label,
    actionLink,
    actionLabel = "Back",
    actionIcon: ActionIcon = FaArrowLeft,
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-12 gap-4">
            {/* Left section: Icon and title */}
            <div className="flex-1 text-start">
                <div className="flex items-center gap-2 mb-2">
                    {Icon && <Icon className="w-5 h-5 text-orange-500" />}
                    {label && (
                        <p className="text-orange-500 text-lg font-extrabold uppercase">
                            {label}
                        </p>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {subtitle}
                    </p>
                )}
            </div>
            {/* Action button (optional) */}
            {actionLink && (
                <div className="mt-4 sm:mt-0 flex-shrink-0">
                    <Button
                        color="primary"
                        onClick={() => router.push(actionLink)}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <ActionIcon className="w-4 h-4 mr-2" />
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}