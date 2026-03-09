import { useState } from 'react';
import { BookOpen, CheckSquare, Clock, ArrowRight, Sparkles, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserStore } from '../store/useUserStore';
import { useTaskStore } from '../store/useTaskStore';
import { useNavigate } from 'react-router-dom';

interface Step {
    id: number;
    icon: JSX.Element;
    title: string;
    subtitle: string;
    content: JSX.Element;
}

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const [taskTitle, setTaskTitle] = useState('');
    const { setHasSeenOnboarding } = useUserStore();
    const { addTask } = useTaskStore();
    const navigate = useNavigate();

    const finish = () => {
        setHasSeenOnboarding(true);
        navigate('/dashboard');
    };

    const steps: Step[] = [
        {
            id: 0,
            icon: <BookOpen size={28} className="text-white" />,
            title: 'Bem-vindo ao FocoPlan! 🎉',
            subtitle: 'Seu espaço pessoal de foco e produtividade',
            content: (
                <div className="space-y-4 text-center">
                    <p className="text-slate-600 leading-relaxed">
                        O FocoPlan combina um <strong>planejador de tarefas</strong> com um <strong>timer Pomodoro</strong> para turbinar sua produtividade. Vamos configurar tudo em 3 passos rápidos.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {[
                            { icon: <CheckSquare size={20} />, label: 'Tarefas', desc: 'Planeje seu dia' },
                            { icon: <Clock size={20} />, label: 'Pomodoro', desc: 'Foco total' },
                            { icon: <Target size={20} />, label: 'Metas', desc: 'Evolua sempre' },
                        ].map(f => (
                            <div key={f.label} className="card p-4 text-center flex flex-col items-center gap-2">
                                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center text-white shadow-sm">
                                    {f.icon}
                                </div>
                                <p className="text-sm font-semibold text-slate-700">{f.label}</p>
                                <p className="text-xs text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 1,
            icon: <CheckSquare size={28} className="text-white" />,
            title: 'Crie sua primeira tarefa',
            subtitle: 'O que você precisa estudar ou fazer hoje?',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-500 text-sm text-center">
                        Tarefas te ajudam a manter o foco. Adicione pelo menos uma para começar!
                    </p>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Título da tarefa</label>
                        <input
                            value={taskTitle}
                            onChange={e => setTaskTitle(e.target.value)}
                            className="input w-full h-12 text-sm"
                            placeholder="Ex: Estudar Cálculo I, Revisar inglês..."
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter' && taskTitle.trim()) setStep(2); }}
                        />
                    </div>
                    {taskTitle.trim() && (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
                            <CheckSquare size={15} className="text-emerald-500 flex-shrink-0" />
                            Sua tarefa "<strong>{taskTitle}</strong>" será criada!
                        </div>
                    )}
                    <p className="text-xs text-slate-400 text-center">Pode pular — você poderá adicionar tarefas depois</p>
                </div>
            ),
        },
        {
            id: 2,
            icon: <Clock size={28} className="text-white" />,
            title: 'Como funciona o Pomodoro',
            subtitle: 'A técnica de foco mais famosa do mundo',
            content: (
                <div className="space-y-3">
                    <p className="text-slate-500 text-sm text-center mb-4">O método Pomodoro divide seu trabalho em blocos de foco com pausas regulares.</p>
                    {[
                        { num: '1', color: 'bg-pastel-mint', label: 'Foco (25 min)', desc: 'Trabalhe sem distrações em uma tarefa' },
                        { num: '2', color: 'bg-pastel-peach', label: 'Pausa curta (5m)', desc: 'Descanse, respire, beba água' },
                        { num: '3', color: 'bg-pastel-lavender', label: 'Pausa longa (15m)', desc: 'A cada 4 ciclos, uma pausa maior' },
                    ].map(s => (
                        <div key={s.num} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-pastel-border">
                            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                {s.num}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                                <p className="text-xs text-slate-400">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-pastel-muted text-center pt-1">
                        Você pode personalizar as durações em <strong>Configurações → Pomodoro</strong>
                    </p>
                </div>
            ),
        },
        {
            id: 3,
            icon: <Sparkles size={28} className="text-white" />,
            title: 'Tudo pronto! 🚀',
            subtitle: 'Comece seu primeiro foco agora',
            content: (
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl gradient-hero flex items-center justify-center shadow-lg mx-auto animate-float">
                        <Sparkles size={36} className="text-white" />
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        Você está pronto! Seu espaço pessoal foi criado com as configurações padrão. Explore o painel, crie tarefas e inicie seu primeiro Pomodoro.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { emoji: '📋', text: 'Adicione tarefas na aba Tarefas' },
                            { emoji: '⏱', text: 'Inicie um foco no Pomodoro' },
                            { emoji: '🎯', text: 'Defina metas de longo prazo' },
                            { emoji: '📊', text: 'Acompanhe seu progresso em Stats' },
                        ].map(t => (
                            <div key={t.emoji} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-pastel-border text-left text-slate-600">
                                <span className="text-lg">{t.emoji}</span>
                                <span className="text-xs">{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    const currentStep = steps[step];
    const isLast = step === steps.length - 1;

    const handleNext = () => {
        if (step === 1 && taskTitle.trim()) {
            addTask({
                title: taskTitle.trim(),
                tag: 'Geral',
                tagColor: 'bg-pastel-mint text-slate-700',
                priority: 'medium',
                date: null,
                durationMinutes: null,
            });
        }
        if (isLast) { finish(); } else { setStep(s => s + 1); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--app-bg)' }}>
            {/* Ambient orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30"
                style={{ background: 'radial-gradient(circle, #F2B8C6, transparent)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #8FC4B0, transparent)' }} />

            <div className="card w-full max-w-md p-0 overflow-hidden relative shadow-float">
                {/* Top gradient header */}
                <div className="gradient-hero p-7 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 shadow-inner">
                        {currentStep.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{currentStep.title}</h2>
                    <p className="text-white/80 text-sm">{currentStep.subtitle}</p>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 py-4 border-b border-pastel-border">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => i < step && setStep(i)}
                            className={`transition-all duration-300 rounded-full ${i === step
                                ? 'w-6 h-2 bg-pastel-coral'
                                : i < step
                                    ? 'w-2 h-2 bg-pastel-mint cursor-pointer'
                                    : 'w-2 h-2 bg-pastel-border'
                                }`}
                        />
                    ))}
                </div>

                {/* Content area */}
                <div className="p-6">
                    {currentStep.content}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex justify-between items-center">
                    <button
                        onClick={finish}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Pular configuração
                    </button>
                    <Button onClick={handleNext} size="md">
                        {isLast ? 'Ir para o Painel' : 'Próximo'}
                        <ArrowRight size={16} className="ml-1.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
