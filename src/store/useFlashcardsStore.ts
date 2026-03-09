import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Flashcard {
    id: string;
    subjectId: string;
    front: string;            // question
    back: string;             // answer
    // SM-2 algorithm fields
    interval: number;         // days until next review
    repetition: number;       // number of consecutive correct answers
    easeFactor: number;       // ease factor (min 1.3)
    nextReview: string;       // ISO date string YYYY-MM-DD
    lastReview: string | null;
    createdAt: number;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = total blackout, 1 = wrong but remembered after seeing answer
// 2 = wrong but answer was easy to recall, 3 = correct with difficulty
// 4 = correct after hesitation, 5 = perfect response

interface FlashcardsState {
    flashcards: Flashcard[];
    addFlashcard: (data: { subjectId: string; front: string; back: string }) => void;
    updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
    deleteFlashcard: (id: string) => void;
    reviewFlashcard: (id: string, quality: ReviewQuality) => void;
    getDueCards: (subjectId?: string) => Flashcard[];
    setFlashcards: (flashcards: Flashcard[]) => void;
}

// ─── SM-2 Algorithm ──────────────────────────────────────────────────────────
// Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

function sm2(card: Flashcard, quality: ReviewQuality): Pick<Flashcard, 'interval' | 'repetition' | 'easeFactor' | 'nextReview' | 'lastReview'> {
    const today = new Date().toISOString().slice(0, 10);
    let { interval, repetition, easeFactor } = card;

    if (quality >= 3) {
        // Correct response
        if (repetition === 0) {
            interval = 1;
        } else if (repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetition += 1;
    } else {
        // Incorrect — reset
        repetition = 0;
        interval = 1;
    }

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate next review date
    const next = new Date();
    next.setDate(next.getDate() + interval);
    const nextReview = next.toISOString().slice(0, 10);

    return { interval, repetition, easeFactor, nextReview, lastReview: today };
}

// ─────────────────────────────────────────────────────────────────────────────

const generateId = () => uuidv4();
const todayStr = () => new Date().toISOString().slice(0, 10);

export const useFlashcardsStore = create<FlashcardsState>()(
    persist(
        (set, get) => ({
            flashcards: [],

            addFlashcard: ({ subjectId, front, back }) => set((state) => ({
                flashcards: [
                    ...state.flashcards,
                    {
                        id: generateId(),
                        subjectId,
                        front,
                        back,
                        interval: 0,
                        repetition: 0,
                        easeFactor: 2.5,
                        nextReview: todayStr(), // due immediately
                        lastReview: null,
                        createdAt: Date.now(),
                    },
                ],
            })),

            updateFlashcard: (id, updates) => set((state) => ({
                flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f),
            })),

            deleteFlashcard: (id) => set((state) => ({
                flashcards: state.flashcards.filter(f => f.id !== id),
            })),

            reviewFlashcard: (id, quality) => set((state) => ({
                flashcards: state.flashcards.map(f => {
                    if (f.id !== id) return f;
                    return { ...f, ...sm2(f, quality) };
                }),
            })),

            getDueCards: (subjectId?) => {
                const today = todayStr();
                return get().flashcards.filter(f => {
                    if (subjectId && f.subjectId !== subjectId) return false;
                    return f.nextReview <= today;
                });
            },

            setFlashcards: (flashcards) => set({ flashcards }),
        }),
        { name: 'focoplan-flashcards-storage' }
    )
);
