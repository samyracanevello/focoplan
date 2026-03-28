import { supabase } from '../lib/supabase';
import { Task, TaskPriority } from '../store/useTaskStore';

export const tasksService = {
    async getTasks(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching tasks:', error);
            throw new Error(error.message);
        }
        
        return data.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            subjectId: t.subject_id,
            tag: t.tag,
            tagColor: t.tag_color,
            priority: t.priority as TaskPriority,
            date: t.date,
            durationMinutes: t.duration_minutes,
            status: t.status,
            createdAt: t.created_at
        })) as Task[];
    },

    async addTask(userId: string, task: Task) {
        if (!userId) return null;
        const payload = {
            id: task.id,
            user_id: userId,
            title: task.title,
            description: task.description,
            subject_id: task.subjectId,
            tag: task.tag,
            tag_color: task.tagColor,
            priority: task.priority,
            date: task.date,
            duration_minutes: task.durationMinutes,
            status: task.status,
            created_at: task.createdAt
        };
        const { error } = await supabase.from('tasks').insert([payload]);
        if (error) {
            console.error('Error adding task:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async updateTask(userId: string, id: string, updates: Partial<Task>) {
        if (!userId) return;
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.subjectId !== undefined) payload.subject_id = updates.subjectId;
        if (updates.tag !== undefined) payload.tag = updates.tag;
        if (updates.tagColor !== undefined) payload.tag_color = updates.tagColor;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        if (updates.date !== undefined) payload.date = updates.date;
        if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes;
        if (updates.status !== undefined) payload.status = updates.status;
        
        const { error } = await supabase
            .from('tasks')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error updating task:', error);
            throw new Error(error.message);
        }
    },

    async deleteTask(userId: string, id: string) {
        if (!userId) return;
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error deleting task:', error);
            throw new Error(error.message);
        }
    }
};
