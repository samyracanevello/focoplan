import { supabase } from '../lib/supabase';
import { PomodoroSession } from '../store/usePomodoroStore';

export const pomodoroService = {
    async getSessions(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('pomodoro_sessions')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching pomodoro sessions:', error);
            throw new Error(error.message);
        }
        
        return data.map((s: any) => ({
            id: s.id,
            taskId: s.task_id,
            durationMinutes: s.duration_minutes,
            completedAt: new Date(s.completed_at).getTime(),
            type: s.type
        })) as PomodoroSession[];
    },

    async addSession(userId: string, session: PomodoroSession) {
        if (!userId) return null;
        const payload = {
            id: session.id,
            user_id: userId,
            task_id: session.taskId,
            duration_minutes: session.durationMinutes,
            type: session.type,
            completed_at: new Date(session.completedAt).toISOString()
        };
        const { error } = await supabase.from('pomodoro_sessions').insert([payload]);
        if (error) {
            console.error('Error adding pomodoro session:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async getDailyGoals(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('daily_pomodoro_goals')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching daily goals:', error);
            throw new Error(error.message);
        }
        
        return data.map((g: any) => ({
            date: g.date,
            goal: g.goal
        }));
    },

    async setDailyGoal(userId: string, date: string, goal: number) {
        if (!userId) return;
        const payload = {
            user_id: userId,
            date,
            goal
        };
        // Upsert based on composite key (user_id, date)
        const { error } = await supabase
            .from('daily_pomodoro_goals')
            .upsert([payload], { onConflict: 'user_id,date' });
            
        if (error) {
            console.error('Error setting daily goal:', error);
            throw new Error(error.message);
        }
    }
};
