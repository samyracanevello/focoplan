import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

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
    targetDate: string | null;
    createdAt: number;
    progress: number;
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
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

function syncGoal(goal: Goal) {
    supabase.auth.getUser().then(({ data: auth }) => {
        if (auth.user) {
            import('../services/goalsService').then(({ goalsService }) => {
                goalsService.updateGoal(auth.user.id, goal.id, goal).catch(err => {
                    // If it doesn't exist yet, this update might fail or we might need upsert
                    // but for simplicity, we'll try update, and if we wanted full upsert we can add it to service
                    // Actually, let's just use updateGoal for existing, addGoal for new.
                    console.error('Supabase sync goal:', err); 
                });
            });
        }
    });
}

export const useGoalsStore = create<GoalsState>()(
    persist(
        (set, get) => ({
            goals: [],

            addGoal: (goalData) => {
                const newGoal: Goal = { ...goalData, id: generateId(), createdAt: Date.now() };
                set((state) => ({ goals: [...state.goals, newGoal] }));
                
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        import('../services/goalsService').then(({ goalsService }) => {
                            goalsService.addGoal(auth.user.id, newGoal).catch(err => console.error('Supabase add goal:', err));
                        });
                    }
                });
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g),
                }));
                const updated = get().goals.find(g => g.id === id);
                if (updated) syncGoal(updated);
            },

            deleteGoal: (id) => {
                set((state) => ({ goals: state.goals.filter(g => g.id !== id) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('goals').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete goal:', error); });
                    }
                });
            },

            updateProgress: (id, progress) => {
                set((state) => ({
                    goals: state.goals.map(g =>
                        g.id === id ? { ...g, progress, status: progress >= 100 ? 'concluida' : g.status } : g
                    ),
                }));
                const updated = get().goals.find(g => g.id === id);
                if (updated) syncGoal(updated);
            },

            toggleMilestone: (goalId, milestoneId) => {
                set((state) => {
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
                });
                const updated = get().goals.find(g => g.id === goalId);
                if (updated) syncGoal(updated);
            },

            addMilestone: (goalId, title) => {
                set((state) => ({
                    goals: state.goals.map(g =>
                        g.id === goalId
                            ? { ...g, milestones: [...g.milestones, { id: generateId(), title, completed: false }] }
                            : g
                    ),
                }));
                const updated = get().goals.find(g => g.id === goalId);
                if (updated) syncGoal(updated);
            },

            setGoals: (goals) => set({ goals }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                try {
                    const { goalsService } = await import('../services/goalsService');
                    const goals = await goalsService.getGoals(auth.user.id);
                    goals.sort((a, b) => a.createdAt - b.createdAt);
                    set({ goals });
                } catch (err) {
                    console.error('Supabase fetch goals:', err);
                }
            },
        }),
        { name: 'focoplan-goals-storage' }
    )
);
