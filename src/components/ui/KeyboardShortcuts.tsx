import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Abrir busca global' },
    { keys: ['Espaço'], description: 'Play / Pause do Pomodoro' },
    { keys: ['K'], description: 'Play / Pause do Pomodoro' },
    { keys: ['Esc'], description: 'Fechar modal / limpar busca' },
];

const KeyboardShortcuts = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === '?' && !((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA')) {
                setOpen(o => !o);
            }
            if (e.key === 'Escape' && open) setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open]);

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-40 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-lg border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-lg transition-all group"
                title="Atalhos de teclado (?)"
            >
                <Keyboard size={16} />
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50" role="dialog">
                    <div
                        className="absolute inset-0"
                        style={{ background: 'rgba(80,60,50,0.25)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4 animate-scale-in">
                        <div className="card p-6 bg-white/95 shadow-float relative">
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute right-4 top-4 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 rounded-xl bg-pastel-lavender/20 text-pastel-lavender flex items-center justify-center">
                                    <Keyboard size={16} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Atalhos de Teclado</h3>
                            </div>

                            <div className="space-y-3">
                                {shortcuts.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">{s.description}</span>
                                        <div className="flex gap-1">
                                            {s.keys.map(k => (
                                                <kbd
                                                    key={k}
                                                    className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200 min-w-[28px] text-center"
                                                >
                                                    {k}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[11px] text-slate-400 mt-5 text-center">
                                Pressione <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">?</kbd> para abrir/fechar
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KeyboardShortcuts;
