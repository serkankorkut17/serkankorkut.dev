"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthContext";

// AuthGuard component that protects routes and redirects unauthenticated users to the login page
import { ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const loading = auth?.loading;
    
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <p>Loading...</p>;
    return <>{children}</>;
}