import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

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
                        supabase.from('topics').insert({
                            id: newTopic.id,
                            user_id: auth.user.id,
                            subject_id: newTopic.subjectId,
                            parent_id: newTopic.parentId,
                            title: newTopic.title,
                            completed: newTopic.completed,
                            order: newTopic.order,
                        }).then(({ error }) => { if (error) console.error('Supabase insert topic:', error); });
                    }
                });
            },

            updateTopic: (id, updates) => {
                set((state) => ({
                    topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        const db: Record<string, unknown> = {};
                        if (updates.title !== undefined) db.title = updates.title;
                        if (updates.completed !== undefined) db.completed = updates.completed;
                        if (updates.order !== undefined) db.order = updates.order;
                        if (updates.parentId !== undefined) db.parent_id = updates.parentId;
                        if (Object.keys(db).length > 0) {
                            supabase.from('topics').update(db).eq('id', id)
                                .then(({ error }) => { if (error) console.error('Supabase update topic:', error); });
                        }
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
                        // Supabase CASCADE handles children via FK
                        supabase.from('topics').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete topic:', error); });
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
                        supabase.from('topics').update({ completed: newCompleted }).eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase toggle topic:', error); });
                    }
                });
            },

            reorderTopic: (id, newOrder) => {
                set((state) => ({
                    topics: state.topics.map(t => t.id === id ? { ...t, order: newOrder } : t),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('topics').update({ order: newOrder }).eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase reorder topic:', error); });
                    }
                });
            },

            getTopicsBySubject: (subjectId) => get().topics.filter(t => t.subjectId === subjectId),

            setTopics: (topics) => set({ topics }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                const { data, error } = await supabase.from('topics').select('*').order('order', { ascending: true });
                if (error) { console.error('Supabase fetch topics:', error); return; }
                if (data) {
                    const topics: Topic[] = data.map((r: Record<string, unknown>) => ({
                        id: r.id as string,
                        subjectId: r.subject_id as string,
                        parentId: (r.parent_id as string) || null,
                        title: r.title as string,
                        completed: r.completed as boolean,
                        order: r.order as number,
                        createdAt: new Date(r.created_at as string).getTime(),
                    }));
                    set({ topics });
                }
            },
        }),
        { name: 'focoplan-topics-storage' }
    )
);
