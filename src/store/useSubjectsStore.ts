import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { subjectsService } from '../services/subjectsService';

export interface Subject {
    id: string;
    name: string;
    color: string;
    icon: string;
    weeklyGoalHours: number;
    createdAt: number;
}

interface SubjectsState {
    subjects: Subject[];
    addSubject: (data: Omit<Subject, 'id' | 'createdAt'>) => void;
    updateSubject: (id: string, updates: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;
    setSubjects: (subjects: Subject[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

export const useSubjectsStore = create<SubjectsState>()(
    persist(
        (set) => ({
            subjects: [],

            addSubject: (data) => {
                const newSubject: Subject = {
                    ...data,
                    id: generateId(),
                    createdAt: Date.now(),
                };
                set((state) => ({ subjects: [...state.subjects, newSubject] }));

                // Sync to Supabase
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        subjectsService.addSubject(auth.user.id, newSubject).catch((err) => {
                            console.error('Failed to add subject to Supabase:', err);
                        });
                    }
                });
            },

            updateSubject: (id, updates) => {
                set((state) => ({
                    subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
                }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        subjectsService.updateSubject(auth.user.id, id, updates).catch((err) => {
                            console.error('Failed to update subject in Supabase:', err);
                        });
                    }
                });
            },

            deleteSubject: (id) => {
                set((state) => ({ subjects: state.subjects.filter(s => s.id !== id) }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        subjectsService.deleteSubject(auth.user.id, id).catch((err) => {
                            console.error('Failed to delete subject from Supabase:', err);
                        });
                    }
                });
            },

            setSubjects: (subjects) => set({ subjects }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;

                try {
                    const subjects = await subjectsService.getSubjects(auth.user.id);
                    // Sort locally if needed, getSubjects fetches direct from DB
                    subjects.sort((a, b) => a.createdAt - b.createdAt);
                    set({ subjects });
                } catch (err) {
                    console.error('Failed to fetch subjects from Supabase:', err);
                }
            },
        }),
        { name: 'focoplan-subjects-storage' }
    )
);
