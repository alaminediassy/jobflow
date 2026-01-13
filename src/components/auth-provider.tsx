"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType { user: User | null; loading: boolean; }
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || typeof auth.onAuthStateChanged !== "function") {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (!auth || typeof auth.onAuthStateChanged !== "function") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                <h1 className="text-xl font-black uppercase tracking-widest text-orange-500 mb-2">Configuration Error</h1>
                <p className="text-zinc-500 text-sm max-w-md">
                    Firebase is not initialized. Please check your environment variables (NEXT_PUBLIC_FIREBASE_*) in Vercel settings.
                </p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h1 className="text-2xl font-bold text-blue-600 animate-pulse">JobFlow</h1>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
