import React from 'react';
import { Play, CheckCircle2, Clock, Flame, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockTasks = [
    { id: 1, title: 'Revisão de Contabilidade de Custos para o CRC', tag: 'Exame 24/05', tagColor: 'bg-pastel-lavender', priority: 'high', duration: '60 min' },
    { id: 2, title: 'Fichamento de artigos sobre perfil de egressos', tag: 'TCC', tagColor: 'bg-pastel-mint', priority: 'medium', duration: '120 min' },
    { id: 3, title: 'Reunião de orientação com a Prof. Cléia', tag: 'TCC', tagColor: 'bg-pastel-mint', priority: 'low', status: 'completed' },
];

const Dashboard = () => {
    return (
        <div className="space-y-6 pt-2 pb-12 max-w-7xl mx-auto">
            {/* Greeting Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                        Bom dia, <span className="text-gradient">Alex!</span> 👋
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Pronto para mais um dia de foco?</p>
                </div>
                <div className="glass-card py-3 px-5 flex items-center gap-3 bg-white/70">
                    <div className="p-2 bg-pastel-amber/20 rounded-xl text-amber-600">
                        <Flame size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Meta Diária</p>
                        <p className="text-xs text-slate-500">4 de 6 sessões concluídas</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Takes 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Próximas Tarefas" action={<Button variant="ghost" size="sm">Ver Todas <ArrowRight size={16} className="ml-1" /></Button>}>
                        <div className="space-y-3">
                            {mockTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-start md:items-center justify-between p-4 rounded-[16px] border transition-all duration-200 ${task.status === 'completed'
                                            ? 'bg-slate-50/50 border-slate-100 opacity-60'
                                            : 'bg-white/80 border-white/60 hover:border-pastel-peach/50 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
                                        <button className={`mt-0.5 md:mt-0 flex-shrink-0 ${task.status === 'completed' ? 'text-pastel-mint' : 'text-slate-300 hover:text-pastel-mint cursor-pointer transition-colors'}`}>
                                            <CheckCircle2 size={22} strokeWidth={task.status === 'completed' ? 2 : 1.5} />
                                        </button>
                                        <div>
                                            <h4 className={`font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {task.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-slate-600 ${task.tagColor}/60`}>
                                                    {task.tag}
                                                </span>
                                                {task.duration && (
                                                    <span className="flex items-center text-xs text-slate-500 gap-1">
                                                        <Clock size={12} /> {task.duration}
                                                    </span>
                                                )}
                                                {task.priority === 'high' && (
                                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-pastel-coral/20 text-red-600">Alta Prioridade</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {task.status !== 'completed' && (
                                        <button className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-pastel-coral hover:bg-pastel-coral/10 transition-colors ml-4">
                                            <Play size={18} fill="currentColor" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Plano de Hoje" className="bg-gradient-to-br from-white/80 to-pastel-cream/30">
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2 text-slate-600">
                                    <span>Progresso</span>
                                    <span className="font-semibold text-pastel-coral">65%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gradient-blush-peach h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <ul className="space-y-2 mt-6">
                                <li className="flex items-center gap-3 text-sm text-slate-600 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-pastel-mint">
                                    2 sessões de foco (TCC)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-600 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-pastel-mint">
                                    1 simulado (CRC)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-300">
                                    Revisar anotações
                                </li>
                            </ul>
                        </Card>

                        <Card className="bg-gradient-blush-mint flex items-center justify-center relative overflow-hidden group cursor-pointer border-none pb-0">
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="text-center text-white z-10 py-6">
                                <div className="bg-white/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                    <Play size={32} fill="currentColor" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Iniciar Pomodoro</h3>
                                <p className="text-white/80 text-sm">Próxima: Contabilidade</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sidebar Data - Takes 1 col */}
                <div className="space-y-6">
                    <Card title="Tempo Focado">
                        <div className="text-center py-6">
                            <div className="relative inline-flex items-center justify-center">
                                {/* CSS Circle Chart Mock */}
                                <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-8 border-pastel-mint border-t-transparent border-r-transparent transform -rotate-45"></div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-slate-700">3.5<span className="text-lg">h</span></span>
                                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hoje</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="text-center p-3 rounded-xl bg-slate-50/50">
                                <span className="block text-xs text-slate-500 mb-1">Semana</span>
                                <span className="block text-lg font-semibold text-slate-700">12h</span>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-slate-50/50">
                                <span className="block text-xs text-slate-500 mb-1">Média</span>
                                <span className="block text-lg font-semibold text-slate-700">4h/dia</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
