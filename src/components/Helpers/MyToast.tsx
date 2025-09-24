"use client";

import React, { useEffect } from "react";
import { Toast, ToastToggle } from "flowbite-react";
import {
    HiCheckCircle,
    HiExclamationCircle,
    HiXCircle,
    HiInformationCircle,
} from "react-icons/hi";

interface MyToastProps {
    type?: "success" | "error" | "warning" | "info";
    message: string;
    onClose: () => void;
    autoDismissTime?: number; // in milliseconds
}

// MyToast component that displays a toast notification with different types (success, error, warning, info)
const MyToast = ({
    type = "info",
    message,
    onClose,
    autoDismissTime = 3000, // default to 3 seconds
}: MyToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, autoDismissTime);
        return () => clearTimeout(timer);
    }, [autoDismissTime, onClose]);

    const toastStyles = {
        success: {
            icon: <HiCheckCircle className="w-5 h-5 text-green-500" />,
            bg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        error: {
            icon: <HiXCircle className="w-5 h-5 text-red-500" />,
            bg: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        },
        warning: {
            icon: <HiExclamationCircle className="w-5 h-5 text-yellow-500" />,
            bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        },
        info: {
            icon: <HiInformationCircle className="w-5 h-5 text-blue-500" />,
            bg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
    };

    const { icon, bg } = toastStyles[type] || toastStyles.info;

    return (
        <div className="fixed top-4 right-4 z-50">
            <Toast
                className={`flex items-center p-4 rounded-lg shadow-lg ${bg}`}
            >
                {icon}
                <div className="ml-3 mr-3 text-sm font-medium">{message}</div>
                <ToastToggle
                    onClick={onClose}
                    className="ml-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                />
            </Toast>
        </div>
    );
};

export default MyToast;