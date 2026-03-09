import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Topic {
    id: string;
    subjectId: string;
    parentId: string | null;  // null = root topic
    title: string;
    completed: boolean;
    order: number;            // for sorting within siblings
    createdAt: number;
}

interface TopicsState {
    topics: Topic[];
    addTopic: (data: { subjectId: string; parentId: string | null; title: string }) => void;
    updateTopic: (id: string, updates: Partial<Topic>) => void;
    deleteTopic: (id: string) => void;
    toggleTopic: (id: string) => void;
    reorderTopic: (id: string, newOrder: number) => void;
    getTopicsBySubject: (subjectId: string) => Topic[];
    setTopics: (topics: Topic[]) => void;
}

const generateId = () => uuidv4();

export const useTopicsStore = create<TopicsState>()(
    persist(
        (set, get) => ({
            topics: [],

            addTopic: ({ subjectId, parentId, title }) => set((state) => {
                const siblings = state.topics.filter(
                    t => t.subjectId === subjectId && t.parentId === parentId
                );
                return {
                    topics: [
                        ...state.topics,
                        {
                            id: generateId(),
                            subjectId,
                            parentId,
                            title,
                            completed: false,
                            order: siblings.length,
                            createdAt: Date.now(),
                        },
                    ],
                };
            }),

            updateTopic: (id, updates) => set((state) => ({
                topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t),
            })),

            deleteTopic: (id) => set((state) => {
                // Delete topic and all descendants
                const idsToDelete = new Set<string>();
                const collectChildren = (parentId: string) => {
                    idsToDelete.add(parentId);
                    state.topics
                        .filter(t => t.parentId === parentId)
                        .forEach(t => collectChildren(t.id));
                };
                collectChildren(id);
                return { topics: state.topics.filter(t => !idsToDelete.has(t.id)) };
            }),

            toggleTopic: (id) => set((state) => ({
                topics: state.topics.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ),
            })),

            reorderTopic: (id, newOrder) => set((state) => ({
                topics: state.topics.map(t =>
                    t.id === id ? { ...t, order: newOrder } : t
                ),
            })),

            getTopicsBySubject: (subjectId) =>
                get().topics.filter(t => t.subjectId === subjectId),

            setTopics: (topics) => set({ topics }),
        }),
        { name: 'focoplan-topics-storage' }
    )
);
