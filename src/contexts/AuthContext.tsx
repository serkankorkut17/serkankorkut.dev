"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role?: string; // e.g., "user" | "admin"
    id?: string;
    _id?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (userData: AuthUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    // Fetch user data on mount to check authentication
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = (await response.json()) as { user: AuthUser };
                    setUser(data.user);
                } else if (response.status === 401 || response.status === 403) {
                    setUser(null);
                    router.push("/login");
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Login: Set user data after successful login
    const login = (userData: AuthUser) => {
        setUser(userData);
        router.push("/");
    };

    // Logout: Clear cookie and reset user state
    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;