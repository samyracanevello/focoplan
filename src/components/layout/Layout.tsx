import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import KeyboardShortcuts from '../ui/KeyboardShortcuts';
import { useSettingsStore } from '../../store/useSettingsStore';

// Map accent key → { light hex, dark hex }
const ACCENT_COLORS: Record<string, { light: string; dark: string }> = {
    mint: { light: '#8FC4B0', dark: '#5A9080' },
    lavender: { light: '#C9C0DE', dark: '#8A82A8' },
    peach: { light: '#F8C9A0', dark: '#C4916A' },
    coral: { light: '#EE9090', dark: '#C46060' },
    amber: { light: '#F5C771', dark: '#C4A050' },
};

const Layout = () => {
    const theme = useSettingsStore(s => s.appearance.theme);
    const compactMode = useSettingsStore(s => s.appearance.compactMode);
    const accentColor = useSettingsStore(s => s.appearance.accentColor);
    const { pathname } = useLocation();

    /* ── Dynamic page title ────────────────────────────────────────────────── */
    useEffect(() => {
        const titles: Record<string, string> = {
            '/dashboard': 'Painel', '/subjects': 'Matérias', '/flashcards': 'Flashcards',
            '/tasks': 'Tarefas',
            '/calendar': 'Calendário', '/pomodoro': 'Pomodoro', '/stats': 'Estatísticas',
            '/goals': 'Metas', '/notifications': 'Notificações', '/settings': 'Configurações',
        };
        document.title = `${titles[pathname] || 'FocoPlan'} · FocoPlan`;
    }, [pathname]);

    /* ── Dark mode ─────────────────────────────────────────────────────────── */
    useEffect(() => {
        const root = document.documentElement;
        const isDark =
            theme === 'escuro' ||
            (theme === 'automatico' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
        } else {
            root.removeAttribute('data-theme');
            root.classList.remove('dark');
        }
    }, [theme]);

    /* ── Compact mode ──────────────────────────────────────────────────────── */
    useEffect(() => {
        const root = document.documentElement;
        if (compactMode) {
            root.setAttribute('data-compact', 'true');
        } else {
            root.removeAttribute('data-compact');
        }
    }, [compactMode]);

    /* ── Accent color ──────────────────────────────────────────────────────── */
    useEffect(() => {
        const root = document.documentElement;
        const isDark =
            theme === 'escuro' ||
            (theme === 'automatico' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const palette = ACCENT_COLORS[accentColor] ?? ACCENT_COLORS.mint;
        const hex = isDark ? palette.dark : palette.light;

        // Override --mint so every pastel-mint class picks up the chosen accent
        root.style.setProperty('--mint', hex);
        root.style.setProperty('--accent', hex);
    }, [accentColor, theme]);

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Ambient orbs — decorative */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(242,184,198,0.08) 0%, transparent 70%)' }} />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(143,196,176,0.08) 0%, transparent 70%)' }} />

            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <Topbar />
                <main className="flex-1 overflow-y-auto page-enter">
                    <Outlet />
                </main>
            </div>

            <KeyboardShortcuts />
        </div>
    );
};

export default Layout;
