import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;        // YYYY-MM-DD
    startTime: string;   // HH:MM
    endTime: string;     // HH:MM
    color: string;       // CSS class key
    description?: string;
}

interface EventsState {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
}

const generateId = () => uuidv4();

export const useEventsStore = create<EventsState>()(
    persist(
        (set) => ({
            events: [],

            addEvent: (data) => set((state) => ({
                events: [...state.events, { ...data, id: generateId() }]
            })),

            updateEvent: (id, updates) => set((state) => ({
                events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
            })),

            deleteEvent: (id) => set((state) => ({
                events: state.events.filter(e => e.id !== id)
            })),
        }),
        { name: 'focoplan-events-storage' }
    )
);
