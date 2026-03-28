import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { topicsService } from '../services/topicsService';

export interface Topic {
    id: string;
    subjectId: string;
    parentId: string | null;
    title: string;
    completed: boolean;
    order: number;
    createdAt: number;
}

interface TopicsState {
    topics: Topic[];
    addTopic: (data: Omit<Topic, 'id' | 'createdAt'>) => void;
    updateTopic: (id: string, updates: Partial<Topic>) => void;
    deleteTopic: (id: string) => void;
    toggleTopic: (id: string) => void;
    reorderTopic: (id: string, newOrder: number) => void;
    getTopicsBySubject: (subjectId: string) => Topic[];
    setTopics: (topics: Topic[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

export const useTopicsStore = create<TopicsState>()(
    persist(
        (set, get) => ({
            topics: [],

            addTopic: (data) => {
                const newTopic: Topic = { ...data, id: generateId(), createdAt: Date.now() };
                set((state) => ({ topics: [...state.topics, newTopic] }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        topicsService.addTopic(auth.user.id, newTopic).catch((err) => {
                            console.error('Failed to add topic to Supabase:', err);
                        });
                    }
                });
            },

            updateTopic: (id, updates) => {
                set((state) => ({
                    topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        topicsService.updateTopic(auth.user.id, id, updates).catch((err) => {
                            console.error('Failed to update topic in Supabase:', err);
                        });
                    }
                });
            },

            deleteTopic: (id) => {
                // Recursive delete descendants
                const getDescendants = (parentId: string): string[] => {
                    const children = get().topics.filter(t => t.parentId === parentId);
                    return children.reduce<string[]>((acc, c) => [...acc, c.id, ...getDescendants(c.id)], []);
                };
                const toDelete = new Set([id, ...getDescendants(id)]);
                set((state) => ({ topics: state.topics.filter(t => !toDelete.has(t.id)) }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        // Supabase CASCADE handles children via FK, but we delete the root one explicitly
                        topicsService.deleteTopic(auth.user.id, id).catch((err) => {
                            console.error('Failed to delete topic from Supabase:', err);
                        });
                    }
                });
            },

            toggleTopic: (id) => {
                const topic = get().topics.find(t => t.id === id);
                if (!topic) return;
                const newCompleted = !topic.completed;
                set((state) => ({
                    topics: state.topics.map(t => t.id === id ? { ...t, completed: newCompleted } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        topicsService.updateTopic(auth.user.id, id, { completed: newCompleted }).catch((err) => {
                            console.error('Failed to toggle topic completed in Supabase:', err);
                        });
                    }
                });
            },

            reorderTopic: (id, newOrder) => {
                set((state) => ({
                    topics: state.topics.map(t => t.id === id ? { ...t, order: newOrder } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        topicsService.updateTopic(auth.user.id, id, { order: newOrder }).catch((err) => {
                            console.error('Failed to reorder topic in Supabase:', err);
                        });
                    }
                });
            },

            getTopicsBySubject: (subjectId) => get().topics.filter(t => t.subjectId === subjectId),

            setTopics: (topics) => set({ topics }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                try {
                    const topics = await topicsService.getTopics(auth.user.id);
                    topics.sort((a, b) => a.order - b.order);
                    set({ topics });
                } catch (err) {
                    console.error('Failed to fetch topics from Supabase:', err);
                }
            },
        }),
        { name: 'focoplan-topics-storage' }
    )
);
