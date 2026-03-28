import { supabase } from '../lib/supabase';
import { Topic } from '../store/useTopicsStore';

export const topicsService = {
    async getTopics(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching topics:', error);
            throw new Error(error.message);
        }
        
        return data.map(t => ({
            id: t.id,
            subjectId: t.subject_id,
            parentId: t.parent_id,
            title: t.title,
            order: t.order_index,
            completed: t.completed,
            createdAt: t.created_at
        })) as Topic[];
    },

    async addTopic(userId: string, topic: Topic) {
        if (!userId) return null;
        const payload = {
            id: topic.id,
            user_id: userId,
            subject_id: topic.subjectId,
            parent_id: topic.parentId,
            title: topic.title,
            order_index: topic.order,
            completed: topic.completed,
            created_at: topic.createdAt
        };
        const { error } = await supabase.from('topics').insert([payload]);
        if (error) {
            console.error('Error adding topic:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async updateTopic(userId: string, id: string, updates: Partial<Topic>) {
        if (!userId) return;
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.order !== undefined) payload.order_index = updates.order;
        if (updates.completed !== undefined) payload.completed = updates.completed;
        if (updates.parentId !== undefined) payload.parent_id = updates.parentId;
        if (updates.subjectId !== undefined) payload.subject_id = updates.subjectId;
        
        const { error } = await supabase
            .from('topics')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error updating topic:', error);
            throw new Error(error.message);
        }
    },

    async deleteTopic(userId: string, id: string) {
        if (!userId) return;
        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error deleting topic:', error);
            throw new Error(error.message);
        }
    }
};
