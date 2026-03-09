import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Subject {
    id: string;
    name: string;
    color: string;           // hex color
    icon: string;            // emoji
    weeklyGoalHours: number; // target hours per week
    createdAt: number;
}

interface SubjectsState {
    subjects: Subject[];
    addSubject: (data: Omit<Subject, 'id' | 'createdAt'>) => void;
    updateSubject: (id: string, updates: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;
    setSubjects: (subjects: Subject[]) => void;
}

const generateId = () => uuidv4();

export const useSubjectsStore = create<SubjectsState>()(
    persist(
        (set) => ({
            subjects: [],

            addSubject: (data) => set((state) => ({
                subjects: [
                    ...state.subjects,
                    { ...data, id: generateId(), createdAt: Date.now() },
                ],
            })),

            updateSubject: (id, updates) => set((state) => ({
                subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
            })),

            deleteSubject: (id) => set((state) => ({
                subjects: state.subjects.filter(s => s.id !== id),
            })),

            setSubjects: (subjects) => set({ subjects }),
        }),
        { name: 'focoplan-subjects-storage' }
    )
);
