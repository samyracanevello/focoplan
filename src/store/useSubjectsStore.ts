import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

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
                        supabase.from('subjects').insert({
                            id: newSubject.id,
                            user_id: auth.user.id,
                            name: newSubject.name,
                            color: newSubject.color,
                            icon: newSubject.icon,
                            weekly_goal_hours: newSubject.weeklyGoalHours,
                        }).then(({ error }) => {
                            if (error) console.error('Supabase insert subject error:', error);
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
                        const dbUpdates: Record<string, unknown> = {};
                        if (updates.name !== undefined) dbUpdates.name = updates.name;
                        if (updates.color !== undefined) dbUpdates.color = updates.color;
                        if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
                        if (updates.weeklyGoalHours !== undefined) dbUpdates.weekly_goal_hours = updates.weeklyGoalHours;
                        supabase.from('subjects').update(dbUpdates).eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase update subject error:', error); });
                    }
                });
            },

            deleteSubject: (id) => {
                set((state) => ({ subjects: state.subjects.filter(s => s.id !== id) }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('subjects').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete subject error:', error); });
                    }
                });
            },

            setSubjects: (subjects) => set({ subjects }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;

                const { data, error } = await supabase
                    .from('subjects')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) { console.error('Supabase fetch subjects error:', error); return; }
                if (data) {
                    const subjects: Subject[] = data.map((row: Record<string, unknown>) => ({
                        id: row.id as string,
                        name: row.name as string,
                        color: row.color as string,
                        icon: row.icon as string,
                        weeklyGoalHours: row.weekly_goal_hours as number,
                        createdAt: new Date(row.created_at as string).getTime(),
                    }));
                    set({ subjects });
                }
            },
        }),
        { name: 'focoplan-subjects-storage' }
    )
);
