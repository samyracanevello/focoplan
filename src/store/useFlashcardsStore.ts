import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

export interface Flashcard {
    id: string;
    subjectId: string;
    front: string;
    back: string;
    interval: number;
    repetition: number;
    easeFactor: number;
    nextReview: string;
    lastReview: string | null;
    createdAt: number;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

interface FlashcardsState {
    flashcards: Flashcard[];
    addFlashcard: (data: { subjectId: string; front: string; back: string }) => void;
    updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
    deleteFlashcard: (id: string) => void;
    reviewFlashcard: (id: string, quality: ReviewQuality) => void;
    getDueCards: (subjectId?: string) => Flashcard[];
    setFlashcards: (flashcards: Flashcard[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

function sm2(card: Flashcard, quality: ReviewQuality): Pick<Flashcard, 'interval' | 'repetition' | 'easeFactor' | 'nextReview' | 'lastReview'> {
    const today = new Date().toISOString().slice(0, 10);
    let { interval, repetition, easeFactor } = card;
    if (quality >= 3) {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetition += 1;
    } else {
        repetition = 0;
        interval = 1;
    }
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
    const next = new Date();
    next.setDate(next.getDate() + interval);
    return { interval, repetition, easeFactor, nextReview: next.toISOString().slice(0, 10), lastReview: today };
}

const generateId = () => uuidv4();
const todayStr = () => new Date().toISOString().slice(0, 10);

export const useFlashcardsStore = create<FlashcardsState>()(
    persist(
        (set, get) => ({
            flashcards: [],

            addFlashcard: ({ subjectId, front, back }) => {
                const card: Flashcard = {
                    id: generateId(), subjectId, front, back,
                    interval: 0, repetition: 0, easeFactor: 2.5,
                    nextReview: todayStr(), lastReview: null, createdAt: Date.now(),
                };
                set((state) => ({ flashcards: [...state.flashcards, card] }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('flashcards').insert({
                            id: card.id, user_id: auth.user.id, subject_id: card.subjectId,
                            front: card.front, back: card.back, interval: card.interval,
                            repetition: card.repetition, ease_factor: card.easeFactor,
                            next_review: card.nextReview, last_review: card.lastReview,
                        }).then(({ error }) => { if (error) console.error('Supabase insert flashcard:', error); });
                    }
                });
            },

            updateFlashcard: (id, updates) => {
                set((state) => ({ flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        const db: Record<string, unknown> = {};
                        if (updates.front !== undefined) db.front = updates.front;
                        if (updates.back !== undefined) db.back = updates.back;
                        if (updates.interval !== undefined) db.interval = updates.interval;
                        if (updates.repetition !== undefined) db.repetition = updates.repetition;
                        if (updates.easeFactor !== undefined) db.ease_factor = updates.easeFactor;
                        if (updates.nextReview !== undefined) db.next_review = updates.nextReview;
                        if (updates.lastReview !== undefined) db.last_review = updates.lastReview;
                        if (Object.keys(db).length > 0) {
                            supabase.from('flashcards').update(db).eq('id', id)
                                .then(({ error }) => { if (error) console.error('Supabase update flashcard:', error); });
                        }
                    }
                });
            },

            deleteFlashcard: (id) => {
                set((state) => ({ flashcards: state.flashcards.filter(f => f.id !== id) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('flashcards').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete flashcard:', error); });
                    }
                });
            },

            reviewFlashcard: (id, quality) => {
                const card = get().flashcards.find(f => f.id === id);
                if (!card) return;
                const result = sm2(card, quality);
                set((state) => ({
                    flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...result } : f),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('flashcards').update({
                            interval: result.interval, repetition: result.repetition,
                            ease_factor: result.easeFactor, next_review: result.nextReview,
                            last_review: result.lastReview,
                        }).eq('id', id).then(({ error }) => { if (error) console.error('Supabase review flashcard:', error); });
                    }
                });
            },

            getDueCards: (subjectId?) => {
                const today = todayStr();
                return get().flashcards.filter(f => {
                    if (subjectId && f.subjectId !== subjectId) return false;
                    return f.nextReview <= today;
                });
            },

            setFlashcards: (flashcards) => set({ flashcards }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                const { data, error } = await supabase.from('flashcards').select('*').order('created_at', { ascending: true });
                if (error) { console.error('Supabase fetch flashcards:', error); return; }
                if (data) {
                    const flashcards: Flashcard[] = data.map((r: Record<string, unknown>) => ({
                        id: r.id as string, subjectId: r.subject_id as string,
                        front: r.front as string, back: r.back as string,
                        interval: r.interval as number, repetition: r.repetition as number,
                        easeFactor: Number(r.ease_factor), nextReview: r.next_review as string,
                        lastReview: (r.last_review as string) || null,
                        createdAt: new Date(r.created_at as string).getTime(),
                    }));
                    set({ flashcards });
                }
            },
        }),
        { name: 'focoplan-flashcards-storage' }
    )
);
