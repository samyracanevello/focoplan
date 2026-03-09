import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Target, Coffee, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';

type TimerMode = 'focus' | 'short_break' | 'long_break';

const Pomodoro = () => {
    const navigate = useNavigate();
    const { focusDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak, autoStartBreaks, autoStartFocus, soundEnabled, soundVolume } = useSettingsStore(s => s.pomodoro);

    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0); // focus sessions completed this cycle

    const addSession = usePomodoroStore(state => state.addSession);
    const tasks = useTaskStore(state => state.tasks);
    const currentTask = tasks.find(t => t.status === 'pending');

    // Duration in seconds per mode (reads from settings)
    const getDuration = useCallback((m: TimerMode) => {
        if (m === 'focus') return focusDuration * 60;
        if (m === 'short_break') return shortBreakDuration * 60;
        return longBreakDuration * 60;
    }, [focusDuration, shortBreakDuration, longBreakDuration]);

    // Reset time when mode or settings change (only if timer not running)
    useEffect(() => {
        if (!isActive) setTimeLeft(getDuration(mode));
    }, [mode, getDuration, isActive]);

    const playSound = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(soundVolume / 100 * 0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            osc.frequency.value = 660;
            osc.type = 'sine';
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch (e) { /* AudioContext not available */ }
    }, [soundEnabled, soundVolume]);

    const handleSessionComplete = useCallback(() => {
        setIsActive(false);
        playSound();

        // Browser notification (works even if tab is in background)
        try {
            if (Notification.permission === 'granted') {
                new Notification('FocoPlan', {
                    body: mode === 'focus' ? '🎯 Sessão de foco concluída! Hora de descansar.' : '☕ Pausa encerrada! Bora focar.',
                    icon: '/vite.svg',
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        } catch (_) { /* Notification API not available */ }

        addSession({
            taskId: currentTask?.id || null,
            type: mode,
            durationMinutes: getDuration(mode) / 60,
        });

        if (mode === 'focus') {
            const newCount = sessionCount + 1;
            setSessionCount(newCount);

            // Decide next break type
            const nextMode = newCount % sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break';
            setMode(nextMode);
            setTimeLeft(getDuration(nextMode));
            if (autoStartBreaks) setIsActive(true);
        } else {
            setMode('focus');
            setTimeLeft(getDuration('focus'));
            if (autoStartFocus) setIsActive(true);
        }
    }, [mode, currentTask, addSession, getDuration, sessionCount, sessionsBeforeLongBreak, autoStartBreaks, autoStartFocus, playSound]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (isActive && timeLeft === 0) {
            handleSessionComplete();
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isActive, timeLeft, handleSessionComplete]);

    const resetTimer = () => { setIsActive(false); setTimeLeft(getDuration(mode)); };
    const switchMode = (m: TimerMode) => { setMode(m); setIsActive(false); setTimeLeft(getDuration(m)); };

    // ── Keyboard shortcut: Space or K → play/pause ───────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
            if (e.code === 'Space' || e.key === 'k') {
                e.preventDefault();
                setIsActive(a => !a);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // ── Timer in browser tab title ──────────────────────────────────────────
    useEffect(() => {
        if (isActive) {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            const emoji = mode === 'focus' ? '🍅' : '☕';
            document.title = `${m}:${s} ${emoji} Pomodoro · FocoPlan`;
        } else {
            document.title = 'Pomodoro · FocoPlan';
        }
        return () => { document.title = 'Pomodoro · FocoPlan'; };
    }, [isActive, timeLeft, mode]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const totalDuration = getDuration(mode);
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
    const circumference = 2 * Math.PI * 110; // r=110
    const strokeDashoffset = circumference * (1 - progress / 100);

    const modeConfig = {
        focus: { label: `Foco (${focusDuration}m)`, color: '#8FC4B0', colorClass: 'text-pastel-mint', bg: 'gradient-mint' },
        short_break: { label: `Pausa Curta (${shortBreakDuration}m)`, color: '#F8C9A0', colorClass: 'text-pastel-peach', bg: 'gradient-peach' },
        long_break: { label: `Pausa Longa (${longBreakDuration}m)`, color: '#C9C0DE', colorClass: 'text-pastel-lavender', bg: 'gradient-lavender' },
    };

    const cfg = modeConfig[mode];

    return (
        <div className="p-6 max-w-3xl mx-auto w-full flex flex-col items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div className="text-center mb-8 mt-4">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pomodoro Timer</h1>
                <p className="text-slate-500 mt-1 text-sm">Sessão {sessionCount + 1} · Concentre-se, descanse, repita.</p>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 mb-8 card p-1.5 rounded-2xl w-fit">
                {(Object.entries(modeConfig) as [TimerMode, typeof modeConfig[TimerMode]][]).map(([m, c]) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === m ? `bg-white shadow-sm ${c.colorClass}` : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Circular timer */}
            <div className="relative flex items-center justify-center mb-8">
                <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
                    {/* Track */}
                    <circle cx="140" cy="140" r="110" fill="none" stroke="var(--border)" strokeWidth="10" />
                    {/* Progress */}
                    <circle
                        cx="140" cy="140" r="110"
                        fill="none"
                        stroke={cfg.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute flex flex-col items-center">
                    <div className={`text-7xl font-bold tabular-nums tracking-tighter leading-none ${cfg.colorClass}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-slate-400 mt-2 font-medium">
                        {isActive ? 'em andamento' : 'pausado'}
                    </div>
                    {mode === 'focus' && currentTask && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-100">
                            <Target size={12} className={cfg.colorClass} />
                            <span className="font-medium truncate max-w-[160px]">{currentTask.title}</span>
                        </div>
                    )}
                    {mode !== 'focus' && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-100">
                            <Coffee size={12} className={cfg.colorClass} />
                            <span>Hora de descansar</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-2xl card flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    title="Reiniciar"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-20 h-20 rounded-3xl ${cfg.bg} text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95`}
                    style={{ boxShadow: `0 8px 30px ${cfg.color}55` }}
                    aria-label={isActive ? 'Pausar timer' : 'Iniciar timer'}
                >
                    {isActive
                        ? <Pause size={30} fill="currentColor" />
                        : <Play size={30} fill="currentColor" className="ml-1" />
                    }
                </button>

                <button
                    onClick={() => navigate('/settings')}
                    className="w-12 h-12 rounded-2xl card flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    title="Configurações do timer"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Session dots */}
            <div className="flex gap-2 mt-6">
                {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < (sessionCount % sessionsBeforeLongBreak)
                            ? 'bg-pastel-mint scale-110'
                            : 'bg-pastel-border'
                            }`}
                    />
                ))}
            </div>

            <p className="text-xs text-slate-400 mt-3">
                {sessionCount % sessionsBeforeLongBreak} de {sessionsBeforeLongBreak} sessões para pausa longa
            </p>
        </div>
    );
};

export default Pomodoro;
