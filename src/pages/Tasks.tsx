import { useState } from 'react';
import { Plus, Edit3, Check, Clock, Trash2, Calendar, CheckSquare, Search, Star, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { useTaskStore, Task } from '../store/useTaskStore';
import { useSubjectsStore } from '../store/useSubjectsStore';
import TaskModal from '../components/ui/TaskModal';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fireConfetti } from '../utils/confetti';

type FilterType = 'all' | 'pending' | 'completed' | 'pinned';

const Tasks = () => {
    const { tasks, toggleTaskStatus, deleteTask, updateTask } = useTaskStore();
    const subjects = useSubjectsStore(state => state.subjects);
    const [filter, setFilter] = useState<FilterType>('all');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openEdit = (task: Task) => { setEditingTask(task); setIsModalOpen(true); };
    const openNew = () => { setEditingTask(null); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingTask(null); };

    const togglePin = (task: Task) => updateTask(task.id, { pinned: !task.pinned });

    const filtered = tasks
        .filter(t => {
            if (filter === 'pending') return t.status === 'pending';
            if (filter === 'completed') return t.status === 'completed';
            if (filter === 'pinned') return t.pinned === true;
            return true;
        })
        .filter(t => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return t.title.toLowerCase().includes(q) || (t.tag || '').toLowerCase().includes(q);
        })
        .sort((a, b) => {
            // Pinned tasks float to top
            const ap = a.pinned ? 1 : 0;
            const bp = b.pinned ? 1 : 0;
            if (bp !== ap) return bp - ap;
            return b.createdAt - a.createdAt;
        });

    const getPriorityBadge = (priority: string) => {
        const map: Record<string, string> = {
            high: 'bg-red-50 text-red-600 border border-red-100',
            medium: 'bg-amber-50 text-amber-600 border border-amber-100',
            low: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        };
        const labels: Record<string, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${map[priority] || map.low}`}>{labels[priority] || 'Baixa'}</span>;
    };

    const counts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pinned: tasks.filter(t => t.pinned).length,
    };

    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Minhas Tarefas</h1>
                    <p className="text-slate-500 mt-1 text-sm">Gerencie e organize suas atividades.</p>
                </div>
                <Button onClick={openNew} size="md">
                    <Plus size={16} className="mr-1.5" /> Nova Tarefa
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-muted pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por título ou tag..."
                        className="input w-full h-9 pl-9 text-sm"
                    />
                </div>

                {/* Filter pills */}
                <div className="card px-2 py-1.5 flex gap-1 w-fit">
                    {([
                        { v: 'all', label: 'Todas', count: counts.all },
                        { v: 'pending', label: 'Pendentes', count: counts.pending },
                        { v: 'completed', label: 'Concluídas', count: counts.completed },
                        { v: 'pinned', label: 'Fixadas', count: counts.pinned },
                    ] as const).map(f => (
                        <button
                            key={f.v}
                            onClick={() => setFilter(f.v)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${filter === f.v ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {f.label}
                            {f.count > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.v ? 'bg-pastel-coral/10 text-pastel-coral' : 'bg-pastel-border text-pastel-muted'
                                    }`}>{f.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Table */}
            <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-14 text-center">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-pastel-border">
                            <CheckSquare size={22} className="text-pastel-mint" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-700 mb-1">
                            {search ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa aqui'}
                        </h3>
                        <p className="text-sm text-slate-400 mb-5">
                            {search ? `Sem resultados para "${search}"` : 'Comece criando sua primeira tarefa!'}
                        </p>
                        <Button variant="outline" size="sm" onClick={openNew}>
                            <Plus size={15} className="mr-1" /> Criar tarefa
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-pastel-border/50">
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-10" />
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tarefa</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tag</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Prioridade</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(task => (
                                    <tr
                                        key={task.id}
                                        className="border-b border-pastel-border/30 last:border-0 hover:bg-white/60 transition-colors group"
                                    >
                                        {/* Checkbox */}
                                        <td className="py-3.5 px-5">
                                            <button
                                                onClick={() => {
                                                    if (task.status === 'pending') fireConfetti();
                                                    toggleTaskStatus(task.id);
                                                }}
                                                aria-label={task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'}
                                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.status === 'completed'
                                                    ? 'bg-pastel-mint border-pastel-mint text-white'
                                                    : 'border-slate-300 hover:border-pastel-mint bg-white'
                                                    }`}
                                            >
                                                {task.status === 'completed' && <Check size={12} strokeWidth={3} />}
                                            </button>
                                        </td>

                                        {/* Title */}
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2">
                                                {task.pinned && (
                                                    <Star size={13} className="text-pastel-amber fill-pastel-amber flex-shrink-0" />
                                                )}
                                                <span className={`font-medium text-sm ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            {task.durationMinutes && (
                                                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                                                    <Clock size={11} />
                                                    {task.durationMinutes}min
                                                </div>
                                            )}
                                            {task.description && (
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
                                                    <FileText size={10} className="flex-shrink-0" />
                                                    {task.description}
                                                </p>
                                            )}
                                        </td>

                                        {/* Tag / Subject */}
                                        <td className="py-3.5 px-5">
                                            {(() => {
                                                const subj = task.subjectId ? subjects.find(s => s.id === task.subjectId) : null;
                                                if (subj) {
                                                    return (
                                                        <span
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-white/50"
                                                            style={{ backgroundColor: subj.color + '15', color: subj.color }}
                                                        >
                                                            <span>{subj.icon}</span>
                                                            {subj.name}
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${task.tagColor} border border-white/50`}>
                                                        {task.tag}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        {/* Priority */}
                                        <td className="py-3.5 px-5">{getPriorityBadge(task.priority)}</td>

                                        {/* Date */}
                                        <td className="py-3.5 px-5 text-sm text-slate-500">
                                            {task.date ? (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-pastel-coral" />
                                                    {format(parseISO(task.date), 'd MMM', { locale: ptBR })}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-5 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => togglePin(task)}
                                                    className={`p-1.5 rounded-lg transition-colors ${task.pinned
                                                        ? 'text-pastel-amber bg-amber-50'
                                                        : 'text-slate-400 hover:text-pastel-amber hover:bg-amber-50'
                                                        }`}
                                                    title={task.pinned ? 'Desafixar' : 'Fixar tarefa'}
                                                >
                                                    <Star size={15} className={task.pinned ? 'fill-pastel-amber' : ''} />
                                                </button>
                                                <button
                                                    onClick={() => openEdit(task)}
                                                    className="p-1.5 text-slate-400 hover:text-pastel-mint hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Editar tarefa"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir tarefa"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {filtered.length > 0 && (
                <p className="text-xs text-slate-400 mt-3 text-center">
                    {filtered.length} tarefa{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
                    {search && ` · busca: "${search}"`}
                </p>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={closeModal}
                editTask={editingTask}
            />
        </div>
    );
};

export default Tasks;
