import { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useNotificationsStore } from '../../store/useNotificationsStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useGoalsStore } from '../../store/useGoalsStore';

const Topbar = () => {
    const { name } = useUserStore();
    const navigate = useNavigate();
    const unreadCount = useNotificationsStore(state => state.notifications.filter(n => !n.read).length);
    const tasks = useTaskStore(state => state.tasks);
    const goals = useGoalsStore(state => state.goals);

    const [searchVal, setSearchVal] = useState('');
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Search results
    const q = searchVal.trim().toLowerCase();
    const matchedTasks = q
        ? tasks.filter(t => t.title.toLowerCase().includes(q) || (t.tag || '').toLowerCase().includes(q)).slice(0, 5)
        : [];
    const matchedGoals = q
        ? goals.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)).slice(0, 3)
        : [];
    const hasResults = matchedTasks.length > 0 || matchedGoals.length > 0;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Ctrl+K → focus search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const clear = () => { setSearchVal(''); setShowResults(false); inputRef.current?.focus(); };

    const goTo = (path: string) => {
        setSearchVal('');
        setShowResults(false);
        navigate(path);
    };

    return (
        <header className="topbar h-16 mx-3 mt-3 rounded-[20px] px-5 flex items-center justify-between gap-4">
            {/* Search */}
            <div ref={containerRef} className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={16} className="text-pastel-muted" strokeWidth={2} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchVal}
                    onChange={e => { setSearchVal(e.target.value); setShowResults(true); }}
                    onFocus={() => { if (searchVal.trim()) setShowResults(true); }}
                    onKeyDown={e => {
                        if (e.key === 'Escape') { clear(); }
                        if (e.key === 'Enter' && q) { goTo(`/tasks?q=${encodeURIComponent(q)}`); }
                    }}
                    placeholder="Buscar tarefas, metas...  (Ctrl+K)"
                    className="input w-full pl-10 pr-8 h-9 text-sm"
                    autoComplete="off"
                />
                {searchVal && (
                    <button onClick={clear} className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600">
                        <X size={14} />
                    </button>
                )}

                {/* Dropdown */}
                {showResults && q && (
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 card bg-white/97 shadow-xl z-50 py-2 max-h-80 overflow-y-auto"
                        style={{ background: 'rgba(255,255,255,0.98)' }}>
                        {!hasResults ? (
                            <p className="text-sm text-slate-400 px-4 py-3 text-center">Nenhum resultado para "{searchVal}"</p>
                        ) : (
                            <>
                                {matchedTasks.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-1.5">Tarefas</p>
                                        {matchedTasks.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => goTo('/tasks')}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3"
                                            >
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === 'completed' ? 'bg-emerald-300' : 'bg-pastel-mint'}`} />
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-medium truncate ${t.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.title}</p>
                                                    <p className="text-xs text-slate-400 truncate">{t.tag}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {matchedGoals.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-1.5 mt-1">Metas</p>
                                        {matchedGoals.map(g => (
                                            <button
                                                key={g.id}
                                                onClick={() => goTo('/goals')}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3"
                                            >
                                                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-pastel-lavender" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 truncate">{g.title}</p>
                                                    <p className="text-xs text-slate-400">{g.progress}% concluído</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <button
                                        onClick={() => goTo(`/tasks`)}
                                        className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-pastel-mint transition-colors"
                                    >
                                        Ver todas as tarefas →
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button
                    onClick={() => navigate('/notifications')}
                    className="relative w-9 h-9 rounded-xl btn-ghost flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pastel-coral ring-2 ring-white animate-pulse" />
                    )}
                    <Bell size={18} strokeWidth={1.8} />
                </button>

                {/* User avatar */}
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2.5 pl-2 pr-3 h-9 rounded-xl btn-ghost group"
                >
                    <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {(name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-700 leading-none">{name || 'Usuário'}</p>
                        <p className="text-[11px] text-pastel-muted leading-tight mt-0.5">Conta local</p>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
