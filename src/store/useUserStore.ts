import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface UserState {
    name: string | null;
    email: string | null;
    userId: string | null;
    hasSeenOnboarding: boolean;
    isSupabaseAuth: boolean;
    setName: (name: string) => void;
    setHasSeenOnboarding: (status: boolean) => void;
    loginLocal: (name: string) => void;
    loginSupabase: (email: string, password: string) => Promise<{ error?: string }>;
    signupSupabase: (email: string, password: string, name: string) => Promise<{ error?: string }>;
    logout: () => void;
    initAuth: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            name: null,
            email: null,
            userId: null,
            hasSeenOnboarding: false,
            isSupabaseAuth: false,

            setName: (name) => set({ name }),
            setHasSeenOnboarding: (status) => set({ hasSeenOnboarding: status }),

            loginLocal: (name) => set({ name, isSupabaseAuth: false }),

            loginSupabase: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) return { error: error.message };
                const user = data.user;
                set({
                    name: user?.user_metadata?.name || email.split('@')[0],
                    email: user?.email || email,
                    userId: user?.id || null,
                    isSupabaseAuth: true,
                });
                return {};
            },

            signupSupabase: async (email, password, name) => {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name } },
                });
                if (error) return { error: error.message };
                const user = data.user;
                set({
                    name,
                    email: user?.email || email,
                    userId: user?.id || null,
                    isSupabaseAuth: true,
                });
                return {};
            },

            logout: () => {
                const { isSupabaseAuth } = get();
                if (isSupabaseAuth) {
                    supabase.auth.signOut();
                }
                set({ name: null, email: null, userId: null, hasSeenOnboarding: false, isSupabaseAuth: false });
            },

            initAuth: () => {
                supabase.auth.onAuthStateChange((_event, session) => {
                    if (session?.user) {
                        set({
                            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || null,
                            email: session.user.email || null,
                            userId: session.user.id,
                            isSupabaseAuth: true,
                        });
                    }
                });
            },
        }),
        {
            name: 'focoplan-user-storage',
        }
    )
);
