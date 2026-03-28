import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { tasksService } from '../services/tasksService';

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
                        tasksService.addTask(auth.user.id, newTask).catch((err) => {
                            console.error('Failed to add task to Supabase:', err);
                        });
                    }
                });
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
                }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        tasksService.updateTask(auth.user.id, id, updates).catch((err) => {
                            console.error('Failed to update task in Supabase:', err);
                        });
                    }
                });
            },

            deleteTask: (id) => {
                set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        tasksService.deleteTask(auth.user.id, id).catch((err) => {
                            console.error('Failed to delete task from Supabase:', err);
                        });
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
                        tasksService.updateTask(auth.user.id, id, { status: newStatus }).catch((err: any) => {
                            console.error('Failed to toggle task status in Supabase:', err);
                        });
                    }
                });
            },

            setTasks: (tasks) => set({ tasks }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                try {
                    const tasks = await tasksService.getTasks(auth.user.id);
                    tasks.sort((a, b) => a.createdAt - b.createdAt);
                    set({ tasks });
                } catch (err) {
                    console.error('Failed to fetch tasks from Supabase:', err);
                }
            },
        }),
        { name: 'focoplan-tasks-storage' }
    )
);
