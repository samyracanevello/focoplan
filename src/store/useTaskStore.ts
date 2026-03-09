import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
    id: string;
    title: string;
    description?: string;
    subjectId?: string;       // links to Subject.id
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
}

const generateId = () => uuidv4();

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],

            addTask: (taskData) => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        ...taskData,
                        id: generateId(),
                        status: 'pending',
                        createdAt: Date.now(),
                    }
                ]
            })),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            toggleTaskStatus: (id) => set((state) => ({
                tasks: state.tasks.map(t => {
                    if (t.id === id) {
                        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
                    }
                    return t;
                })
            })),

            setTasks: (tasks) => set({ tasks }),
        }),
        {
            name: 'focoplan-tasks-storage',
        }
    )
);
