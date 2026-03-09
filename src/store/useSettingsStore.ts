import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PomodoroSettings {
    focusDuration: number;     // minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    soundEnabled: boolean;
    soundVolume: number; // 0–100
}

export interface NotificationSettings {
    browserNotifications: boolean;
    sessionCompleteAlert: boolean;
    dailyReminderEnabled: boolean;
    dailyReminderTime: string; // "HH:MM"
    weeklyReportEnabled: boolean;
}

export interface AppearanceSettings {
    theme: 'claro' | 'escuro' | 'automatico';
    accentColor: 'mint' | 'lavender' | 'peach' | 'coral' | 'amber';
    compactMode: boolean;
    showMotivationalQuotes: boolean;
}

interface SettingsState {
    pomodoro: PomodoroSettings;
    notifications: NotificationSettings;
    appearance: AppearanceSettings;
    updatePomodoro: (updates: Partial<PomodoroSettings>) => void;
    updateNotifications: (updates: Partial<NotificationSettings>) => void;
    updateAppearance: (updates: Partial<AppearanceSettings>) => void;
    resetToDefaults: () => void;
}

const defaultPomodoro: PomodoroSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    soundEnabled: true,
    soundVolume: 70,
};

const defaultNotifications: NotificationSettings = {
    browserNotifications: false,
    sessionCompleteAlert: true,
    dailyReminderEnabled: false,
    dailyReminderTime: '08:00',
    weeklyReportEnabled: false,
};

const defaultAppearance: AppearanceSettings = {
    theme: 'claro',
    accentColor: 'mint',
    compactMode: false,
    showMotivationalQuotes: true,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            pomodoro: defaultPomodoro,
            notifications: defaultNotifications,
            appearance: defaultAppearance,

            updatePomodoro: (updates) => set((state) => ({
                pomodoro: { ...state.pomodoro, ...updates }
            })),

            updateNotifications: (updates) => set((state) => ({
                notifications: { ...state.notifications, ...updates }
            })),

            updateAppearance: (updates) => set((state) => ({
                appearance: { ...state.appearance, ...updates }
            })),

            resetToDefaults: () => set({
                pomodoro: defaultPomodoro,
                notifications: defaultNotifications,
                appearance: defaultAppearance,
            }),
        }),
        { name: 'focoplan-settings-storage' }
    )
);
