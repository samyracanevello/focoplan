import { useMemo } from 'react';
import {
    CheckCircle2, Clock, Flame, BarChart3,
    Trophy, Star, Zap
} from 'lucide-react';
import { isToday, isThisWeek, isThisMonth, format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Card from '../components/ui/Card';
import { useTaskStore } from '../store/useTaskStore';
import { usePomodoroStore } from '../store/usePomodoroStore';

const Stats = () => {
    const tasks = useTaskStore(state => state.tasks);
    const { sessions, dailyGoalSessions } = usePomodoroStore();

    // ── Task Stats ──────────────────────────────────────────────────────────
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const todayCompleted = tasks.filter(t => t.status === 'completed' && t.date && isToday(new Date(t.date))).length;
    const weekCompleted = tasks.filter(t => t.status === 'completed' && t.date && isThisWeek(new Date(t.date), { locale: ptBR })).length;
    const monthCompleted = tasks.filter(t => t.status === 'completed' && t.date && isThisMonth(new Date(t.date))).length;

    // ── Pomodoro Stats ───────────────────────────────────────────────────────
    const focusSessions = sessions.filter(s => s.type === 'focus');
    const totalFocusMinutes = focusSessions.reduce((a, b) => a + b.durationMinutes, 0);

    const todaySessions = focusSessions.filter(s => isToday(new Date(s.completedAt)));
    const todayMinutes = todaySessions.reduce((a, b) => a + b.durationMinutes, 0);

    const weekSessions = focusSessions.filter(s => isThisWeek(new Date(s.completedAt), { locale: ptBR }));
    const weekMinutes = weekSessions.reduce((a, b) => a + b.durationMinutes, 0);

    const monthSessions = focusSessions.filter(s => isThisMonth(new Date(s.completedAt)));
    const monthMinutes = monthSessions.reduce((a, b) => a + b.durationMinutes, 0);

    // ── Streak (consecutive days with at least 1 focus session) ─────────────
    const streak = useMemo(() => {
        let count = 0;
        const now = new Date();
        while (count < 365) {
            const checkDate = format(subDays(now, count), 'yyyy-MM-dd');
            const hasSessions = focusSessions.some(
                s => format(new Date(s.completedAt), 'yyyy-MM-dd') === checkDate
            );
            if (!hasSessions) break;
            count++;
        }
        return count;
    }, [focusSessions]);

    // ── Last 7 days chart data ───────────────────────────────────────────────
    const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
    const chartData = last7Days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayMin = focusSessions
            .filter(s => format(new Date(s.completedAt), 'yyyy-MM-dd') === dayStr)
            .reduce((a, b) => a + b.durationMinutes, 0);
        const dayTasks = tasks.filter(t =>
            t.status === 'completed' && t.date && format(new Date(t.date), 'yyyy-MM-dd') === dayStr
        ).length;
        return { day, label: format(day, 'EEE', { locale: ptBR }), minutes: dayMin, tasksCompleted: dayTasks };
    });

    const maxMinutes = Math.max(...chartData.map(d => d.minutes), 1);

    // ── Task categories ──────────────────────────────────────────────────────
    const tagCounts = useMemo(() => {
        const map: Record<string, number> = {};
        tasks.forEach(t => {
            const tag = t.tag || 'Sem categoria';
            map[tag] = (map[tag] || 0) + 1;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [tasks]);

    const tagColors = ['bg-pastel-mint', 'bg-pastel-lavender', 'bg-pastel-peach', 'bg-pastel-coral', 'bg-pastel-amber'];

    const formatHm = (min: number) => `${Math.floor(min / 60)}h ${min % 60}m`;

    // ── Priority Stats ──────────────────────────────────────────────────────
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                    <BarChart3 size={36} className="text-pastel-mint" />
                    Estatísticas
                </h1>
                <p className="text-lg text-slate-500">Acompanhe sua evolução e produtividade ao longo do tempo.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                    {
                        icon: <Flame size={22} />,
                        label: 'Sequência Atual',
                        value: `${streak} dia${streak !== 1 ? 's' : ''}`,
                        sub: 'dias consecutivos',
                        color: 'text-orange-500',
                        bg: 'bg-orange-50',
                    },
                    {
                        icon: <Clock size={22} />,
                        label: 'Foco Hoje',
                        value: formatHm(todayMinutes),
                        sub: `${todaySessions.length} sessões`,
                        color: 'text-pastel-mint',
                        bg: 'bg-emerald-50',
                    },
                    {
                        icon: <CheckCircle2 size={22} />,
                        label: 'Taxa de Conclusão',
                        value: `${completionRate}%`,
                        sub: `${completedTasks} de ${totalTasks} tarefas`,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50',
                    },
                    {
                        icon: <Trophy size={22} />,
                        label: 'Sessões no Mês',
                        value: monthSessions.length.toString(),
                        sub: formatHm(monthMinutes) + ' focadas',
                        color: 'text-amber-500',
                        bg: 'bg-amber-50',
                    },
                ].map((kpi, idx) => (
                    <Card key={idx} className="bg-white/70 p-6">
                        <div className={`w-11 h-11 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-4`}>
                            {kpi.icon}
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</p>
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{kpi.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                    </Card>
                ))}
            </div>

            {/* Chart + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Bar Chart: Last 7 days */}
                <Card className="lg:col-span-2 p-6 bg-white/70">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Foco nos últimos 7 dias</h3>
                            <p className="text-sm text-slate-400 mt-0.5">Minutos de concentração por dia</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-pastel-mint">{formatHm(weekMinutes)}</p>
                            <p className="text-xs text-slate-400">essa semana</p>
                        </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="flex items-end gap-3 h-40">
                        {chartData.map((d, i) => {
                            const heightPct = maxMinutes > 0 ? (d.minutes / maxMinutes) * 100 : 0;
                            const isToday_ = isToday(d.day);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="relative w-full flex-1 flex items-end">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${isToday_ ? 'bg-pastel-mint' : 'bg-slate-100 group-hover:bg-pastel-mint/40'}`}
                                            style={{ height: `${Math.max(heightPct, d.minutes > 0 ? 5 : 0)}%`, minHeight: d.minutes > 0 ? '6px' : '0' }}
                                            title={`${d.minutes}min`}
                                        />
                                    </div>
                                    <span className={`text-[11px] font-semibold capitalize ${isToday_ ? 'text-pastel-mint' : 'text-slate-400'}`}>
                                        {d.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Periodos shortcut */}
                <Card className="p-6 bg-white/70 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Resumo de Foco</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Hoje', sessions: todaySessions.length, minutes: todayMinutes },
                            { label: 'Esta semana', sessions: weekSessions.length, minutes: weekMinutes },
                            { label: 'Este mês', sessions: monthSessions.length, minutes: monthMinutes },
                            { label: 'Total', sessions: focusSessions.length, minutes: totalFocusMinutes },
                        ].map((p, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-600">{p.label}</span>
                                    <span className="text-sm font-bold text-slate-800">{formatHm(p.minutes)}</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-pastel-mint rounded-full transition-all duration-700"
                                        style={{ width: `${totalFocusMinutes > 0 ? (p.minutes / totalFocusMinutes) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">{p.sessions} sessão(ões)</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Tasks Stats + Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Completion */}
                <Card className="p-6 bg-white/70">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-pastel-mint" /> Tarefas
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Concluídas Hoje', value: todayCompleted, color: 'bg-pastel-mint' },
                            { label: 'Concluídas na Semana', value: weekCompleted, color: 'bg-pastel-lavender' },
                            { label: 'Concluídas no Mês', value: monthCompleted, color: 'bg-pastel-peach' },
                            { label: 'Pendentes', value: pendingTasks, color: 'bg-slate-200' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm text-slate-600">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-800">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress donut replacement: circular */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500">Taxa de Conclusão</span>
                            <span className="text-xl font-bold text-slate-800">{completionRate}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pastel-mint to-emerald-400 rounded-full transition-all duration-700"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Categories */}
                <Card className="p-6 bg-white/70">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Star size={20} className="text-pastel-amber" /> Por Categoria
                    </h3>
                    {tagCounts.length === 0 ? (
                        <p className="text-slate-400 text-sm">Nenhuma tarefa cadastrada ainda.</p>
                    ) : (
                        <div className="space-y-4">
                            {tagCounts.map(([tag, count], i) => {
                                const pct = Math.round((count / totalTasks) * 100);
                                return (
                                    <div key={tag}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                                <span className={`w-2.5 h-2.5 rounded-full ${tagColors[i % tagColors.length]}`} />
                                                {tag}
                                            </span>
                                            <span className="text-sm text-slate-500">{count} ({pct}%)</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${tagColors[i % tagColors.length]}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Priority breakdown */}
                <Card className="p-6 bg-white/70">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-pastel-coral" /> Por Prioridade
                    </h3>
                    <div className="space-y-5 mt-2">
                        {[
                            { label: 'Alta', count: highPriority, color: 'bg-red-400', text: 'text-red-500' },
                            { label: 'Média', count: mediumPriority, color: 'bg-orange-400', text: 'text-orange-500' },
                            { label: 'Baixa', count: lowPriority, color: 'bg-emerald-400', text: 'text-emerald-600' },
                        ].map(p => (
                            <div key={p.label}>
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                                        <span className="text-sm font-medium text-slate-700">Prioridade {p.label}</span>
                                    </div>
                                    <span className={`text-base font-bold ${p.text}`}>{p.count}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${p.color}`}
                                        style={{ width: totalTasks > 0 ? `${(p.count / totalTasks) * 100}%` : '0%' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sessions goal progress */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-500">Meta diária de sessões</span>
                            <span className="text-sm font-bold text-slate-700">{todaySessions.length}/{dailyGoalSessions}</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pastel-lavender to-purple-400 rounded-full transition-all duration-700"
                                style={{ width: `${Math.min((todaySessions.length / dailyGoalSessions) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Stats;
