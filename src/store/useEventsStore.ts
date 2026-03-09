import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    color: string;
    description?: string;
}

interface EventsState {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
    setEvents: (events: CalendarEvent[]) => void;
    fetchFromSupabase: () => Promise<void>;
}

const generateId = () => uuidv4();

export const useEventsStore = create<EventsState>()(
    persist(
        (set) => ({
            events: [],

            addEvent: (data) => {
                const newEvent = { ...data, id: generateId() };
                set((state) => ({ events: [...state.events, newEvent] }));

                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('events').insert({
                            id: newEvent.id,
                            user_id: auth.user.id,
                            title: newEvent.title,
                            date: newEvent.date,
                            time: `${newEvent.startTime}-${newEvent.endTime}`,
                            color: newEvent.color,
                            description: newEvent.description || null,
                        }).then(({ error }) => { if (error) console.error('Supabase insert event:', error); });
                    }
                });
            },

            updateEvent: (id, updates) => {
                set((state) => ({
                    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e),
                }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        const db: Record<string, unknown> = {};
                        if (updates.title !== undefined) db.title = updates.title;
                        if (updates.date !== undefined) db.date = updates.date;
                        if (updates.startTime !== undefined || updates.endTime !== undefined) {
                            // Need current values to build the time string
                            db.time = `${updates.startTime || ''}-${updates.endTime || ''}`;
                        }
                        if (updates.color !== undefined) db.color = updates.color;
                        if (updates.description !== undefined) db.description = updates.description;
                        if (Object.keys(db).length > 0) {
                            supabase.from('events').update(db).eq('id', id)
                                .then(({ error }) => { if (error) console.error('Supabase update event:', error); });
                        }
                    }
                });
            },

            deleteEvent: (id) => {
                set((state) => ({ events: state.events.filter(e => e.id !== id) }));
                supabase.auth.getUser().then(({ data: auth }) => {
                    if (auth.user) {
                        supabase.from('events').delete().eq('id', id)
                            .then(({ error }) => { if (error) console.error('Supabase delete event:', error); });
                    }
                });
            },

            setEvents: (events) => set({ events }),

            fetchFromSupabase: async () => {
                const { data: auth } = await supabase.auth.getUser();
                if (!auth.user) return;
                const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
                if (error) { console.error('Supabase fetch events:', error); return; }
                if (data) {
                    const events: CalendarEvent[] = data.map((r: Record<string, unknown>) => {
                        const timeStr = (r.time as string) || '-';
                        const [startTime, endTime] = timeStr.split('-');
                        return {
                            id: r.id as string,
                            title: r.title as string,
                            date: r.date as string,
                            startTime: startTime || '',
                            endTime: endTime || '',
                            color: r.color as string,
                            description: (r.description as string) || undefined,
                        };
                    });
                    set({ events });
                }
            },
        }),
        { name: 'focoplan-events-storage' }
    )
);
