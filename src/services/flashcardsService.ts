import { supabase } from '../lib/supabase';
import { Flashcard } from '../store/useFlashcardsStore';

export const flashcardsService = {
    async getFlashcards(userId: string) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error fetching flashcards:', error);
            throw new Error(error.message);
        }
        
        return data.map((f: any) => ({
            id: f.id,
            subjectId: f.subject_id,
            front: f.front,
            back: f.back,
            interval: f.interval,
            repetition: f.repetition,
            easeFactor: Number(f.ease_factor),
            nextReview: f.next_review,
            lastReview: f.last_review || null,
            createdAt: new Date(f.created_at).getTime()
        })) as Flashcard[];
    },

    async addFlashcard(userId: string, card: Flashcard) {
        if (!userId) return null;
        const payload = {
            id: card.id,
            user_id: userId,
            subject_id: card.subjectId,
            front: card.front,
            back: card.back,
            interval: card.interval,
            repetition: card.repetition,
            ease_factor: card.easeFactor,
            next_review: card.nextReview,
            last_review: card.lastReview,
            created_at: new Date(card.createdAt).toISOString()
        };
        const { error } = await supabase.from('flashcards').insert([payload]);
        if (error) {
            console.error('Error adding flashcard:', error);
            throw new Error(error.message);
        }
        return payload;
    },

    async updateFlashcard(userId: string, id: string, updates: Partial<Flashcard>) {
        if (!userId) return;
        const payload: any = {};
        if (updates.front !== undefined) payload.front = updates.front;
        if (updates.back !== undefined) payload.back = updates.back;
        if (updates.subjectId !== undefined) payload.subject_id = updates.subjectId;
        if (updates.interval !== undefined) payload.interval = updates.interval;
        if (updates.repetition !== undefined) payload.repetition = updates.repetition;
        if (updates.easeFactor !== undefined) payload.ease_factor = updates.easeFactor;
        if (updates.nextReview !== undefined) payload.next_review = updates.nextReview;
        if (updates.lastReview !== undefined) payload.last_review = updates.lastReview;
        
        const { error } = await supabase
            .from('flashcards')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error updating flashcard:', error);
            throw new Error(error.message);
        }
    },

    async deleteFlashcard(userId: string, id: string) {
        if (!userId) return;
        const { error } = await supabase
            .from('flashcards')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) {
            console.error('Error deleting flashcard:', error);
            throw new Error(error.message);
        }
    }
};
