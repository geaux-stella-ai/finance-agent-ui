import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
    token: string | null
    setToken: (token: string) => void
    clearToken: () => void
    isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token, isAuthenticated: true }),
            clearToken: () => set({ token: null, isAuthenticated: false }),
            isAuthenticated: false,
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
) 