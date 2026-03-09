import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface PomodoroSession {
    id: string;
    taskId: string | null; // Null if it was a general session without a specific task
    durationMinutes: number;
    completedAt: number; // timestamp
    type: 'focus' | 'short_break' | 'long_break';
}

interface PomodoroState {
    sessions: PomodoroSession[];
    dailyGoalSessions: number;
    addSession: (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => void;
    setDailyGoal: (goal: number) => void;
    setSessions: (sessions: PomodoroSession[]) => void;
}

const generateId = () => uuidv4();

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set) => ({
            sessions: [],
            dailyGoalSessions: 6, // Default daily goal: 6 focus sessions

            addSession: (sessionData) => set((state) => ({
                sessions: [
                    ...state.sessions,
                    {
                        ...sessionData,
                        id: generateId(),
                        completedAt: Date.now()
                    }
                ]
            })),

            setDailyGoal: (goal) => set({ dailyGoalSessions: goal }),

            setSessions: (sessions) => set({ sessions }),
        }),
        {
            name: 'focoplan-pomodoro-storage',
        }
    )
);
