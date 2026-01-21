"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    signInWithGoogle: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Handle redirect result
        (async () => {
            try {
                const { getRedirectResult } = await import('firebase/auth');
                await getRedirectResult(auth);
            } catch (error: any) {
                console.error("Redirect auth error", error);
                alert(`Login Failed: ${error.message}`);
            }
        })();

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
        router.push("/");
    };

    const signInWithGoogle = async () => {
        try {
            const { GoogleAuthProvider, signInWithRedirect } = await import('firebase/auth');
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
        } catch (error: any) {
            console.error("Error initiating google sign in", error);
            alert(`Login Failed: ${error.message}`);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
