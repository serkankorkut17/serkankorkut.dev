"use client";

import { useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthContext";


// LoggedInGuard component that redirects logged-in users away from certain pages
export default function LoggedInGuard({ children }: { children: ReactNode }) {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const loading = auth?.loading;

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/email");
        }
    }, [user, loading, router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return <>{children}</>;
}