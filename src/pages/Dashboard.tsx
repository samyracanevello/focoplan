import { useMemo } from 'react';
import { CheckCircle2, Play, TrendingUp, Calendar as CalendarIcon, ArrowRight, Target, Quote, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isToday, isFuture } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserStore } from '../store/useUserStore';
import { useTaskStore } from '../store/useTaskStore';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSubjectsStore } from '../store/useSubjectsStore';
import { getDailyQuote } from '../data/quotes';

const Dashboard = () => {
    const navigate = useNavigate();
    const { name } = useUserStore();
    const { tasks, toggleTaskStatus } = useTaskStore();
    const { sessions } = usePomodoroStore();
    const showQuotes = useSettingsStore(s => s.appearance.showMotivationalQuotes);
    const dailyQuote = getDailyQuote();

    const todayTasks = useMemo(() => tasks.filter(t => t.date && isToday(new Date(t.date))), [tasks]);
    const pendingTodayTasks = useMemo(() => todayTasks.filter(t => t.status === 'pending'), [todayTasks]);
    const upcomingTasks = useMemo(() =>
        tasks.filter(t => t.date && isFuture(new Date(t.date)) && t.status === 'pending').slice(0, 3),
        [tasks]);

    const todaySessions = useMemo(() =>
        sessions.filter(s => isToday(new Date(s.completedAt)) && s.type === 'focus'),
        [sessions]);
    const totalFocusMinutesToday = useMemo(() =>
        todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0),
        [todaySessions]);

    const { subjects } = useSubjectsStore();
    const topSubjectToday = useMemo(() => {
        const map: Record<string, number> = {};
        todaySessions.forEach(s => {
            if (s.taskId) {
                const t = tasks.find(tsk => tsk.id === s.taskId);
                if (t && t.subjectId) {
                    map[t.subjectId] = (map[t.subjectId] || 0) + s.durationMinutes;
                }
            }
        });
        const [topId] = Object.entries(map).sort((a, b) => b[1] - a[1])[0] || [null];
        return topId ? subjects.find(s => s.id === topId) : null;
    }, [todaySessions, tasks, subjects]);

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Greeting */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">
                        Olá, {name || 'Estudante'} <span className="text-pastel-peach">👋</span>
                    </h1>
                    <p className="text-lg text-slate-500">
                        Pronto para mais um dia de foco? Você tem{' '}
                        <span className="font-semibold text-pastel-mint">{pendingTodayTasks.length}</span> tarefas planejadas hoje.
                    </p>
                </div>

                {/* Daily quote */}
                {showQuotes && (
                    <div className="card p-4 max-w-sm flex-shrink-0 border-l-4 border-l-pastel-coral">
                        <div className="flex gap-3">
                            <Quote size={18} className="text-pastel-coral flex-shrink-0 mt-0.5 opacity-70" />
                            <div>
                                <p className="text-sm text-slate-600 italic leading-relaxed">"{dailyQuote.text}"</p>
                                <p className="text-xs text-pastel-muted mt-1.5 font-medium">— {dailyQuote.author}</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Top Grid: Focus CTA + Stats */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"
            >
                {/* Main Focus Area */}
                <div className="lg:col-span-8">
                    <Card className="h-full bg-gradient-blush-mint text-white border-0 shadow-lg relative overflow-hidden flex flex-col justify-between p-8 md:p-10 min-h-[300px]">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-start gap-4 h-full">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/30 flex items-center gap-2">
                                <Target size={16} /> Próxima Tarefa Sugerida
                            </div>

                            <div className="mt-4 mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                                    {pendingTodayTasks.length > 0 ? pendingTodayTasks[0].title : 'Sessão de Foco Livre'}
                                </h2>
                                <p className="text-white/80 text-lg">
                                    {pendingTodayTasks.length > 0
                                        ? `Duração sugerida: ${pendingTodayTasks[0].durationMinutes || 25} minutos`
                                        : 'Nenhuma tarefa pendente para hoje. Que tal revisar algo?'}
                                </p>
                            </div>

                            <div className="mt-auto">
                                <Button
                                    size="lg"
                                    className="bg-white text-emerald-700 hover:bg-slate-50 shadow-xl border-0 group"
                                    onClick={() => navigate('/pomodoro')}
                                >
                                    <Play size={20} className="mr-2 group-hover:scale-110 transition-transform text-emerald-600 fill-emerald-600" />
                                    Iniciar Pomodoro
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Stats */}
                <div className="lg:col-span-4 grid grid-rows-3 gap-4">
                    <Card className="flex flex-col justify-center p-5 bg-white/70">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2.5 bg-pastel-mint/20 text-emerald-700 rounded-xl">
                                <CheckCircle2 size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">Hoje</span>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium text-xs mb-0.5">Tarefas Concluídas</p>
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {todayTasks.filter(t => t.status === 'completed').length}{' '}
                                <span className="text-sm text-slate-400 font-medium">/ {todayTasks.length}</span>
                            </h3>
                        </div>
                    </Card>

                    <Card className="flex flex-col justify-center p-5 bg-white/70">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2.5 bg-pastel-peach/20 text-orange-700 rounded-xl">
                                <TrendingUp size={20} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium text-xs mb-0.5">Minutos de Foco</p>
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {Math.floor(totalFocusMinutesToday / 60)}h{' '}
                                <span className="text-sm text-slate-400 font-medium">{totalFocusMinutesToday % 60}m</span>
                            </h3>
                        </div>
                    </Card>

                    <Card className="flex flex-col justify-center p-5 bg-white/70">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2.5 bg-pastel-lavender/20 text-purple-700 rounded-xl">
                                <Star size={20} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium text-xs mb-0.5">Top Matéria do Dia</p>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight truncate">
                                {topSubjectToday ? (
                                    <span className="flex items-center gap-1.5"><span className="text-sm">{topSubjectToday.icon}</span> {topSubjectToday.name}</span>
                                ) : (
                                    <span className="text-slate-400">Nenhuma ainda</span>
                                )}
                            </h3>
                        </div>
                    </Card>
                </div>
            </motion.div>

            {/* Bottom Grid: Today's Tasks + Upcoming */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Today's Tasks */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-slate-400" /> Plano de Hoje
                        </h3>
                        <Button variant="ghost" size="sm" className="text-pastel-coral hover:text-red-500" onClick={() => navigate('/tasks')}>
                            Ver todas <ArrowRight size={16} className="ml-1" />
                        </Button>
                    </div>

                    <Card className="p-2 bg-white/60">
                        <div className="divide-y divide-slate-100">
                            {todayTasks.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    <p>Nenhuma tarefa agendada para hoje.</p>
                                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate('/tasks')}>
                                        + Adicionar tarefa
                                    </Button>
                                </div>
                            ) : (
                                todayTasks.map(task => (
                                    <div key={task.id} className="p-4 flex items-center justify-between group hover:bg-white/50 transition-colors rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleTaskStatus(task.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${task.status === 'completed'
                                                    ? 'bg-pastel-mint border-pastel-mint text-white'
                                                    : 'border-slate-300 group-hover:border-pastel-mint bg-white'
                                                    }`}
                                            >
                                                {task.status === 'completed' && <CheckCircle2 size={16} strokeWidth={3} />}
                                            </button>
                                            <div>
                                                <p className={`font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">{task.tag} • {task.durationMinutes || 25} min</p>
                                            </div>
                                        </div>
                                        {task.status === 'pending' && (
                                            <button
                                                onClick={() => navigate('/pomodoro')}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-pastel-mint hover:bg-emerald-50 rounded-lg transition-all"
                                            >
                                                <Play size={18} className="fill-pastel-mint" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Upcoming Tasks */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Próximos Dias</h3>
                    </div>
                    <Card className="p-4 bg-white/60 space-y-3">
                        {upcomingTasks.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                <p>Nenhuma tarefa futura pendente.</p>
                            </div>
                        ) : (
                            upcomingTasks.map(task => (
                                <div key={task.id} className="p-4 bg-white border border-slate-100 rounded-[16px] shadow-sm flex justify-between items-center group hover:border-pastel-peach/50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-400' :
                                                task.priority === 'medium' ? 'bg-orange-400' : 'bg-emerald-400'
                                                }`} />
                                            <p className="font-semibold text-slate-700 text-sm">{task.title}</p>
                                        </div>
                                        <p className="text-xs text-slate-400 ml-4">
                                            {task.tag} • {task.date ? new Date(task.date).toLocaleDateString('pt-BR') : ''}
                                        </p>
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md">
                                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
