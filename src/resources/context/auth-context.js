"use client";

import React, { createContext, useContext } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the NextAuth session in a familiar context.
 *
 * Keeps the same useAuth() API your components already use,
 * but reads from NextAuth's session instead of Firebase onAuthStateChanged.
 */
export const AuthProvider = ({ children }) => {
    const { data: session, status } = useSession();

    const user = session?.user ?? null;
    const loading = status === "loading";

    const signOut = async () => {
        await nextAuthSignOut({ redirectTo: "/login" });
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
