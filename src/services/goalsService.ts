import { supabase } from '../lib/supabase';
import { Goal, GoalMilestone } from '../store/useGoalsStore';

export const goalsService = {
    async getGoals(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching goals:', error);
            throw new Error(error.message);
        }
        
        return data.map((g: any) => {
            let milestones: GoalMilestone[] = [];
            let progress = 0;
            let description = '';
            let category = 'outro';
            let status = 'em_progresso';
            let priority = 'media';

            try {
                // description now stores the complex JSON object for milestones, progress, and extra fields
                const parsed = JSON.parse(g.description || '{}');
                milestones = parsed.milestones || [];
                progress = parsed.progress || 0;
                description = parsed.description || '';
                category = parsed.category || 'outro';
                status = parsed.status || 'em_progresso';
                priority = parsed.priority || 'media';
            } catch (e) {
                // fallback if it wasn't json
                description = g.description;
            }

            return {
                id: g.id,
                title: g.title,
                description,
                category,
                status,
                priority,
                targetDate: g.target_date,
                progress,
                milestones,
                createdAt: new Date(g.created_at).getTime()
            } as Goal;
        });
    },

    async addGoal(userId: string, goal: Goal) {
        if (!userId) return null;
        const payload = {
            id: goal.id,
            user_id: userId,
            title: goal.title,
            target_date: goal.targetDate,
            description: JSON.stringify({
                progress: goal.progress, 
                milestones: goal.milestones,
                description: goal.description,
                category: goal.category,
                status: goal.status,
                priority: goal.priority
            }),
            created_at: new Date(goal.createdAt).toISOString()
        };
        const { error } = await supabase.from('goals').insert([payload]);
        if (error) {
            console.error('Error adding goal:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async updateGoal(userId: string, id: string, updates: Partial<Goal>) {
        if (!userId) return;
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.targetDate !== undefined) payload.target_date = updates.targetDate;
        
        // Handle nested JSON updates
        if (updates.progress !== undefined || updates.milestones !== undefined || updates.description !== undefined || updates.category !== undefined || updates.status !== undefined || updates.priority !== undefined) {
            // we need to fetch the existing description first or assume updates has both
            const { data } = await supabase.from('goals').select('description').eq('id', id).eq('user_id', userId).single();
            let parsed: any = { progress: 0, milestones: [], description: '', category: 'outro', status: 'em_progresso', priority: 'media' };
            if (data?.description) {
                try { parsed = JSON.parse(data.description); } catch(e){ parsed.description = data.description; }
            }
            if (updates.progress !== undefined) parsed.progress = updates.progress;
            if (updates.milestones !== undefined) parsed.milestones = updates.milestones;
            if (updates.description !== undefined) parsed.description = updates.description;
            if (updates.category !== undefined) parsed.category = updates.category;
            if (updates.status !== undefined) parsed.status = updates.status;
            if (updates.priority !== undefined) parsed.priority = updates.priority;
            
            payload.description = JSON.stringify(parsed);
        }
        
        const { error } = await supabase
            .from('goals')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error updating goal:', error);
            throw new Error(error.message);
        }
    },

    async deleteGoal(userId: string, id: string) {
        if (!userId) return;
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error deleting goal:', error);
            throw new Error(error.message);
        }
    }
};
