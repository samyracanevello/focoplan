import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Settings } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Pomodoro = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    return (
        <div className="max-w-4xl mx-auto pt-6 pb-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Timer Pomodoro</h1>
                <p className="text-slate-500">Mantenha o foco em blocos de tempo para maximizar sua produtividade.</p>
            </div>

            <div className="flex justify-center mb-8 gap-4">
                <Button
                    variant={mode === 'focus' ? 'primary' : 'ghost'}
                    onClick={() => setMode('focus')}
                    className={mode === 'focus' ? 'bg-pastel-mint ring-0' : ''}
                >
                    <Play size={18} className="mr-2" /> Foco
                </Button>
                <Button
                    variant={mode === 'break' ? 'primary' : 'ghost'}
                    onClick={() => setMode('break')}
                    className={mode === 'break' ? 'bg-pastel-peach ring-0' : ''}
                >
                    <Coffee size={18} className="mr-2" /> Pausa
                </Button>
            </div>

            <Card className="max-w-md mx-auto relative overflow-hidden text-center py-12 px-6 shadow-sm border-white/60">
                {/* Animated background gradient based on mode */}
                <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000 ${mode === 'focus' ? 'bg-pastel-mint' : 'bg-pastel-peach'}`}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter mb-8 tabular-nums" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        {mode === 'focus' ? '25:00' : '05:00'}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button size="lg" className="rounded-full w-20 h-20 shadow-lg !p-0" onClick={() => setIsRunning(!isRunning)}>
                            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full w-14 h-14 !p-0 ml-4 border-slate-200">
                            <RotateCcw size={24} className="text-slate-500" />
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="mt-12">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 px-2">Tarefa Atual</h3>
                <Card className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-pastel-mint uppercase tracking-wider">Em Andamento</span>
                        <h4 className="text-slate-800 font-medium text-lg mt-1">Revisão de Contabilidade de Custos</h4>
                    </div>
                    <Button variant="ghost" className="text-slate-400">
                        <Settings size={20} />
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Pomodoro;
