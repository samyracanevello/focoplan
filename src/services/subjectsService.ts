import { supabase } from '../lib/supabase';
import { Subject } from '../store/useSubjectsStore';

export const subjectsService = {
    async getSubjects(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('user_id', userId);
        
        if (error) {
            console.error('Error fetching subjects:', error);
            throw new Error(error.message);
        }
        
        // Map snake_case to camelCase
        return data.map(s => ({
            id: s.id,
            name: s.name,
            icon: s.icon,
            color: s.color,
            weeklyGoalHours: s.weekly_goal_hours,
            createdAt: s.created_at
        })) as Subject[];
    },

    async addSubject(userId: string, subject: Partial<Subject>) {
        if (!userId) return null;
        const payload = {
            id: subject.id,
            user_id: userId,
            name: subject.name,
            icon: subject.icon,
            color: subject.color,
            weekly_goal_hours: subject.weeklyGoalHours,
            created_at: subject.createdAt
        };
        const { error } = await supabase.from('subjects').insert([payload]);
        if (error) {
            console.error('Error adding subject:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async updateSubject(userId: string, id: string, updates: Partial<Subject>) {
        if (!userId) return;
        const payload: any = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.icon !== undefined) payload.icon = updates.icon;
        if (updates.color !== undefined) payload.color = updates.color;
        if (updates.weeklyGoalHours !== undefined) payload.weekly_goal_hours = updates.weeklyGoalHours;
        
        const { error } = await supabase
            .from('subjects')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error updating subject:', error);
            throw new Error(error.message);
        }
    },

    async deleteSubject(userId: string, id: string) {
        if (!userId) return;
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error deleting subject:', error);
            throw new Error(error.message);
        }
    }
};
