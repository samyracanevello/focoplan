import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'pomodoro' | 'tarefa' | 'meta' | 'sistema' | 'conquista';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: number;
    actionLabel?: string;
    actionPath?: string;
}

interface NotificationsState {
    notifications: AppNotification[];
    addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

const generateId = () => uuidv4();

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set) => ({
            notifications: [
                {
                    id: 'welcome-1',
                    type: 'sistema',
                    title: 'Bem-vindo ao FocoPlan! 🎉',
                    message: 'Seu espaço de foco e produtividade pessoal. Comece criando suas primeiras tarefas!',
                    read: false,
                    createdAt: Date.now() - 60000,
                    actionLabel: 'Criar tarefa',
                    actionPath: '/tasks',
                },
                {
                    id: 'tip-1',
                    type: 'sistema',
                    title: 'Dica: A Técnica Pomodoro',
                    message: 'Trabalhe em blocos de 25 minutos com pausas de 5 minutos para maximizar seu foco e evitar o esgotamento.',
                    read: false,
                    createdAt: Date.now() - 30000,
                    actionLabel: 'Iniciar Pomodoro',
                    actionPath: '/pomodoro',
                },
            ],

            addNotification: (notifData) => set((state) => ({
                notifications: [
                    {
                        ...notifData,
                        id: generateId(),
                        createdAt: Date.now(),
                        read: false,
                    },
                    ...state.notifications,
                ]
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            })),

            deleteNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),

            clearAll: () => set({ notifications: [] }),
        }),
        { name: 'focoplan-notifications-storage' }
    )
);
