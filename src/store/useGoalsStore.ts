import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type GoalCategory = 'estudo' | 'saude' | 'habito' | 'projeto' | 'outro';
export type GoalStatus = 'em_progresso' | 'concluida' | 'pausada';
export type GoalPriority = 'alta' | 'media' | 'baixa';

export interface GoalMilestone {
    id: string;
    title: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    priority: GoalPriority;
    targetDate: string | null; // ISO date string
    createdAt: number;
    progress: number; // 0–100
    milestones: GoalMilestone[];
}

interface GoalsState {
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    toggleMilestone: (goalId: string, milestoneId: string) => void;
    addMilestone: (goalId: string, title: string) => void;
    setGoals: (goals: Goal[]) => void;
}

const generateId = () => uuidv4();

export const useGoalsStore = create<GoalsState>()(
    persist(
        (set) => ({
            goals: [],

            addGoal: (goalData) => set((state) => ({
                goals: [
                    ...state.goals,
                    {
                        ...goalData,
                        id: generateId(),
                        createdAt: Date.now(),
                    }
                ]
            })),

            updateGoal: (id, updates) => set((state) => ({
                goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
            })),

            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter(g => g.id !== id)
            })),

            updateProgress: (id, progress) => set((state) => ({
                goals: state.goals.map(g =>
                    g.id === id
                        ? { ...g, progress, status: progress >= 100 ? 'concluida' : g.status }
                        : g
                )
            })),

            toggleMilestone: (goalId, milestoneId) => set((state) => {
                const goals = state.goals.map(g => {
                    if (g.id !== goalId) return g;
                    const milestones = g.milestones.map(m =>
                        m.id === milestoneId ? { ...m, completed: !m.completed } : m
                    );
                    const progress = milestones.length > 0
                        ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
                        : g.progress;
                    return { ...g, milestones, progress };
                });
                return { goals };
            }),

            addMilestone: (goalId, title) => set((state) => ({
                goals: state.goals.map(g =>
                    g.id === goalId
                        ? { ...g, milestones: [...g.milestones, { id: generateId(), title, completed: false }] }
                        : g
                )
            })),

            setGoals: (goals) => set({ goals }),
        }),
        { name: 'focoplan-goals-storage' }
    )
);
