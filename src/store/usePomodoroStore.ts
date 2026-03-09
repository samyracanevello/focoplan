import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

export interface PomodoroSession {
    id: string;
    taskId: string | null;
    durationMinutes: number;
    completedAt: number;
    type: 'focus' | 'short_break' | 'long_break';
}

interface PomodoroState {
    sessions: PomodoroSession[];
    dailyGoalSessions: number;
    addSession: (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => void;
    setDailyGoal: (goal: number) => void;
    setSessions: (sessions: PomodoroSession[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set) => ({
            sessions: [],
            dailyGoalSessions: 6,

            addSession: (sessionData) => {
                const newSession: PomodoroSession = {
                    ...sessionData,
                    id: generateId(),
                    completedAt: Date.now(),
                };
                set((state) => ({ sessions: [...state.sessions, newSession] }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('pomodoro_sessions').insert({
                            id: newSession.id,
                            user_id: auth.user.id,
                            started_at: new Date(newSession.completedAt).toISOString(),
                            duration_minutes: newSession.durationMinutes,
                            type: newSession.type,
                            completed: true,
                        }).then(({ error }) => { if (error) console.error('Supabase insert session:', error); });
                    }
                });
            },

            setDailyGoal: (goal) => set({ dailyGoalSessions: goal }),

            setSessions: (sessions) => set({ sessions }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                const { data, error } = await supabase.from('pomodoro_sessions').select('*').order('started_at', { ascending: true });
                if (error) { console.error('Supabase fetch sessions:', error); return; }
                if (data) {
                    const sessions: PomodoroSession[] = data.map((r: Record<string, unknown>) => ({
                        id: r.id as string,
                        taskId: null,
                        durationMinutes: r.duration_minutes as number,
                        completedAt: new Date(r.started_at as string).getTime(),
                        type: r.type as PomodoroSession['type'],
                    }));
                    set({ sessions });
                }
            },
        }),
        { name: 'focoplan-pomodoro-storage' }
    )
);
