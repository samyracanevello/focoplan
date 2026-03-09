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

function goalToDb(goal: Goal, userId: string) {
    return {
        id: goal.id,
        user_id: userId,
        title: goal.title,
        description: JSON.stringify({ text: goal.description, milestones: goal.milestones, progress: goal.progress }),
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        target_date: goal.targetDate || null,
    };
}

function syncGoal(goal: Goal) {
    supabase.auth.getUser().then(({ data: auth }) => {
        if (auth.user) {
            supabase.from('goals').upsert(goalToDb(goal, auth.user.id))
                .then(({ error }) => { if (error) console.error('Supabase sync goal:', error); });
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
                syncGoal(newGoal);
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
                const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: true });
                if (error) { console.error('Supabase fetch goals:', error); return; }
                if (data) {
                    const goals: Goal[] = data.map((r: Record<string, unknown>) => {
                        let desc = '', milestones: GoalMilestone[] = [], progress = 0;
                        try {
                            const parsed = JSON.parse(r.description as string);
                            desc = parsed.text || '';
                            milestones = parsed.milestones || [];
                            progress = parsed.progress || 0;
                        } catch { desc = (r.description as string) || ''; }
                        return {
                            id: r.id as string,
                            title: r.title as string,
                            description: desc,
                            category: r.category as GoalCategory,
                            status: r.status as GoalStatus,
                            priority: r.priority as GoalPriority,
                            targetDate: (r.target_date as string) || null,
                            createdAt: new Date(r.created_at as string).getTime(),
                            progress,
                            milestones,
                        };
                    });
                    set({ goals });
                }
            },
        }),
        { name: 'focoplan-goals-storage' }
    )
);
