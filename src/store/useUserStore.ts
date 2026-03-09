import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    name: string | null;
    hasSeenOnboarding: boolean;
    setName: (name: string) => void;
    setHasSeenOnboarding: (status: boolean) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: null,
            hasSeenOnboarding: false,
            setName: (name) => set({ name }),
            setHasSeenOnboarding: (status) => set({ hasSeenOnboarding: status }),
            logout: () => set({ name: null, hasSeenOnboarding: false }),
        }),
        {
            name: 'focoplan-user-storage',
        }
    )
);
