"use client";

import { Spinner } from "flowbite-react";

// LoadingOverlay component that displays a full-screen overlay with a spinner and loading text
export default function LoadingOverlay({ text = "Loading..." }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-300 dark:bg-black bg-opacity-75">
            <Spinner size="xl" />
            <span className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
                {text}
            </span>
        </div>
    );
}