import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
    id: string;
    title: string;
    description?: string;
    subjectId?: string;
    tag: string;
    tagColor: string;
    priority: TaskPriority;
    status: TaskStatus;
    date: string | null;
    durationMinutes: number | null;
    pinned?: boolean;
    createdAt: number;
}

interface TaskState {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskStatus: (id: string) => void;
    setTasks: (tasks: Task[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],

            addTask: (taskData) => {
                const newTask: Task = {
                    ...taskData,
                    id: generateId(),
                    status: 'pending',
                    createdAt: Date.now(),
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('tasks').insert({
                            id: newTask.id,
                            user_id: auth.user.id,
                            title: newTask.title,
                            description: newTask.description || null,
                            subject_id: newTask.subjectId || null,
                            tag: newTask.tag,
                            tag_color: newTask.tagColor,
                            priority: newTask.priority,
                            status: newTask.status,
                            date: newTask.date || null,
                            duration_minutes: newTask.durationMinutes,
                            pinned: newTask.pinned || false,
                        }).then(({ error }) => { if (error) console.error('Supabase insert task:', error); });
                    }
                });
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
                }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        const dbUpdates: Record<string, unknown> = {};
                        if (updates.title !== undefined) dbUpdates.title = updates.title;
                        if (updates.description !== undefined) dbUpdates.description = updates.description;
                        if (updates.subjectId !== undefined) dbUpdates.subject_id = updates.subjectId;
                        if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
                        if (updates.tagColor !== undefined) dbUpdates.tag_color = updates.tagColor;
                        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
                        if (updates.status !== undefined) dbUpdates.status = updates.status;
                        if (updates.date !== undefined) dbUpdates.date = updates.date;
                        if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
                        if (updates.pinned !== undefined) dbUpdates.pinned = updates.pinned;
                        if (Object.keys(dbUpdates).length > 0) {
                            supabase.from('tasks').update(dbUpdates).eq('id', id)
                                .then(({ error }) => { if (error) console.error('Supabase update task:', error); });
                        }
                    }
                });
            },

            deleteTask: (id) => {
                set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('tasks').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete task:', error); });
                    }
                });
            },

            toggleTaskStatus: (id) => {
                const task = get().tasks.find(t => t.id === id);
                if (!task) return;
                const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('tasks').update({ status: newStatus }).eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase toggle task:', error); });
                    }
                });
            },

            setTasks: (tasks) => set({ tasks }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
                if (error) { console.error('Supabase fetch tasks:', error); return; }
                if (data) {
                    const tasks: Task[] = data.map((r: Record<string, unknown>) => ({
                        id: r.id as string,
                        title: r.title as string,
                        description: (r.description as string) || undefined,
                        subjectId: (r.subject_id as string) || undefined,
                        tag: r.tag as string,
                        tagColor: r.tag_color as string,
                        priority: r.priority as TaskPriority,
                        status: r.status as TaskStatus,
                        date: (r.date as string) || null,
                        durationMinutes: (r.duration_minutes as number) || null,
                        pinned: (r.pinned as boolean) || false,
                        createdAt: new Date(r.created_at as string).getTime(),
                    }));
                    set({ tasks });
                }
            },
        }),
        { name: 'focoplan-tasks-storage' }
    )
);
