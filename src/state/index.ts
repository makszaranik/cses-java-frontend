import { create } from "zustand/react";
import { persist } from "zustand/middleware";

export interface AuthUser {
    id: string;
    username: string;
    role: string;
}

interface AuthState {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user })
        }),
        { name: "auth-storage" }
    )
);
