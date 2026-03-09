import { useState } from 'react';
import {
    Target, Plus, Trophy, Clock, Trash2, Edit3,
    Flag, Star, Flame, ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useGoalsStore, Goal, GoalCategory, GoalStatus, GoalPriority } from '../store/useGoalsStore';
import { fireConfetti } from '../utils/confetti';

// ─── Helpers ────────────────────────────────────────────────────────────────

const categoryConfig: Record<GoalCategory, { label: string; color: string; bg: string }> = {
    estudo: { label: 'Estudo', color: 'text-blue-600', bg: 'bg-blue-50' },
    saude: { label: 'Saúde', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    habito: { label: 'Hábito', color: 'text-purple-600', bg: 'bg-purple-50' },
    projeto: { label: 'Projeto', color: 'text-orange-600', bg: 'bg-orange-50' },
    outro: { label: 'Outro', color: 'text-slate-600', bg: 'bg-slate-50' },
};

const statusConfig: Record<GoalStatus, { label: string; color: string; dot: string }> = {
    em_progresso: { label: 'Em progresso', color: 'text-blue-600', dot: 'bg-blue-400' },
    concluida: { label: 'Concluída', color: 'text-emerald-600', dot: 'bg-emerald-400' },
    pausada: { label: 'Pausada', color: 'text-slate-400', dot: 'bg-slate-300' },
};

const priorityConfig: Record<GoalPriority, { label: string; color: string }> = {
    alta: { label: 'Alta', color: 'text-red-500' },
    media: { label: 'Média', color: 'text-orange-500' },
    baixa: { label: 'Baixa', color: 'text-emerald-600' },
};

// ─── Goal Form Modal ────────────────────────────────────────────────────────

interface GoalFormProps {
    onClose: () => void;
    initial?: Partial<Goal>;
    onSave: (data: Omit<Goal, 'id' | 'createdAt'>) => void;
}

const GoalForm = ({ onClose, initial, onSave }: GoalFormProps) => {
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [category, setCategory] = useState<GoalCategory>(initial?.category || 'estudo');
    const [priority, setPriority] = useState<GoalPriority>(initial?.priority || 'media');
    const [status, setStatus] = useState<GoalStatus>(initial?.status || 'em_progresso');
    const [targetDate, setTargetDate] = useState(initial?.targetDate || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            status,
            targetDate: targetDate || null,
            progress: initial?.progress || 0,
            milestones: initial?.milestones || [],
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{initial ? 'Editar Meta' : 'Nova Meta'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Título *</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Passar no concurso público"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint focus:ring-2 focus:ring-pastel-mint/20 text-slate-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Descrição</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Descreva sua meta com mais detalhes..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint focus:ring-2 focus:ring-pastel-mint/20 text-slate-800 resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Categoria</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as GoalCategory)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint bg-white text-slate-800"
                            >
                                {Object.entries(categoryConfig).map(([v, c]) => (
                                    <option key={v} value={v}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Prioridade</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as GoalPriority)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint bg-white text-slate-800"
                            >
                                <option value="alta">Alta</option>
                                <option value="media">Média</option>
                                <option value="baixa">Baixa</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as GoalStatus)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint bg-white text-slate-800"
                            >
                                <option value="em_progresso">Em progresso</option>
                                <option value="concluida">Concluída</option>
                                <option value="pausada">Pausada</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Prazo</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={e => setTargetDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="flex-1">Salvar Meta</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Goal Card ──────────────────────────────────────────────────────────────

const GoalCard = ({ goal }: { goal: Goal }) => {
    const { deleteGoal, updateGoal, updateProgress, toggleMilestone, addMilestone } = useGoalsStore();
    const [expanded, setExpanded] = useState(false);
    const [newMilestone, setNewMilestone] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingProgress, setEditingProgress] = useState(false);
    const [progressDraft, setProgressDraft] = useState(goal.progress);

    const cat = categoryConfig[goal.category];
    const sta = statusConfig[goal.status];
    const pri = priorityConfig[goal.priority];

    const handleAddMilestone = () => {
        if (!newMilestone.trim()) return;
        addMilestone(goal.id, newMilestone.trim());
        setNewMilestone('');
    };

    return (
        <>
            {editing && (
                <GoalForm
                    initial={goal}
                    onClose={() => setEditing(false)}
                    onSave={(data) => { updateGoal(goal.id, data); setEditing(false); }}
                />
            )}
            <Card className={`p-6 bg-white/80 transition-all duration-200 ${goal.status === 'concluida' ? 'opacity-75' : ''}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.bg} ${cat.color}`}>{cat.label}</span>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${sta.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                                {sta.label}
                            </span>
                            <span className={`text-xs font-semibold ${pri.color}`}>
                                <Flag size={11} className="inline mr-0.5" />{pri.label}
                            </span>
                        </div>
                        <h3 className={`text-lg font-bold ${goal.status === 'concluida' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {goal.title}
                        </h3>
                        {goal.description && (
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{goal.description}</p>
                        )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => setEditing(true)} className="p-2 rounded-xl text-slate-400 hover:text-pastel-mint hover:bg-emerald-50 transition-colors">
                            <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteGoal(goal.id)} className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-500">Progresso</span>
                        <span className="text-sm font-bold text-slate-700">{goal.progress}%</span>
                    </div>
                    {editingProgress ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={0} max={100} step={5}
                                value={progressDraft}
                                onChange={e => setProgressDraft(Number(e.target.value))}
                                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-700 w-8 text-right">{progressDraft}%</span>
                            <button
                                onClick={() => { updateProgress(goal.id, progressDraft); setEditingProgress(false); if (progressDraft >= 100) fireConfetti(); }}
                                className="px-2 py-1 text-xs font-semibold bg-pastel-mint/10 text-pastel-mint rounded-lg hover:bg-pastel-mint/20 transition-colors"
                            >OK</button>
                            <button
                                onClick={() => { setProgressDraft(goal.progress); setEditingProgress(false); }}
                                className="px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                            >✕</button>
                        </div>
                    ) : (
                        <div
                            className="h-2.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer group relative"
                            title="Clique para ajustar o progresso"
                            onClick={() => { setProgressDraft(goal.progress); setEditingProgress(true); }}
                        >
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${goal.progress >= 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-pastel-mint to-emerald-400'}`}
                                style={{ width: `${goal.progress}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/0 group-hover:text-white/80 transition-colors select-none">editar</span>
                        </div>
                    )}
                </div>

                {/* Milestones count + target date */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    {goal.milestones.length > 0 && (
                        <span>
                            {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} marcos
                        </span>
                    )}
                    {goal.targetDate && (
                        <span className="ml-auto flex items-center gap-1">
                            <Clock size={11} />
                            Prazo: {format(new Date(goal.targetDate), 'd MMM yyyy', { locale: ptBR })}
                        </span>
                    )}
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-1 pt-2 border-t border-slate-100 text-xs font-medium text-slate-400 hover:text-pastel-mint transition-colors"
                >
                    {expanded ? <><ChevronUp size={14} /> Recolher marcos</> : <><ChevronDown size={14} /> Ver marcos e detalhes</>}
                </button>

                {/* Milestones */}
                {expanded && (
                    <div className="mt-4 space-y-2">
                        {goal.milestones.length > 0 ? (
                            goal.milestones.map(m => (
                                <div
                                    key={m.id}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={() => toggleMilestone(goal.id, m.id)}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${m.completed ? 'bg-pastel-mint border-pastel-mint' : 'border-slate-300'
                                        }`}>
                                        {m.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-sm ${m.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                        {m.title}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-2">Nenhum marco adicionado ainda.</p>
                        )}

                        {/* Add milestone input */}
                        <div className="flex gap-2 mt-3">
                            <input
                                value={newMilestone}
                                onChange={e => setNewMilestone(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddMilestone()}
                                placeholder="Adicionar marco..."
                                className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint focus:ring-2 focus:ring-pastel-mint/20"
                            />
                            <button
                                onClick={handleAddMilestone}
                                className="px-3 py-2 bg-pastel-mint/10 text-pastel-mint rounded-xl hover:bg-pastel-mint/20 transition-colors font-semibold text-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
};

// ─── Main Page ──────────────────────────────────────────────────────────────

type FilterGoal = 'todas' | GoalStatus | GoalCategory;

const Goals = () => {
    const goals = useGoalsStore(state => state.goals);
    const addGoal = useGoalsStore(state => state.addGoal);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<FilterGoal>('todas');

    const filtered = filter === 'todas'
        ? goals
        : goals.filter(g => g.status === filter || g.category === filter);

    const total = goals.length;
    const completed = goals.filter(g => g.status === 'concluida').length;
    const inProgress = goals.filter(g => g.status === 'em_progresso').length;
    const avgProgress = total > 0 ? Math.round(goals.reduce((a, b) => a + b.progress, 0) / total) : 0;

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                        <Target size={36} className="text-pastel-lavender" />
                        Minhas Metas
                    </h1>
                    <p className="text-lg text-slate-500">Defina objetivos claros e acompanhe sua evolução passo a passo.</p>
                </div>
                <Button onClick={() => setShowForm(true)} size="lg" className="flex-shrink-0">
                    <Plus size={20} className="mr-2" /> Nova Meta
                </Button>
            </div>

            {/* Summary cards */}
            {total > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <Target size={20} />, label: 'Total', value: total, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { icon: <Flame size={20} />, label: 'Em andamento', value: inProgress, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: <Trophy size={20} />, label: 'Concluídas', value: completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { icon: <Star size={20} />, label: 'Progresso médio', value: `${avgProgress}%`, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((s, i) => (
                        <Card key={i} className="p-5 bg-white/70 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { value: 'todas', label: 'Todas' },
                    { value: 'em_progresso', label: 'Em progresso' },
                    { value: 'concluida', label: 'Concluídas' },
                    { value: 'pausada', label: 'Pausadas' },
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value as FilterGoal)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${filter === f.value
                            ? 'bg-white shadow-sm text-pastel-mint border border-white/60'
                            : 'text-slate-500 hover:bg-white/60'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Goal list or empty state */}
            {filtered.length === 0 ? (
                <Card className="p-16 text-center bg-white/50">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <Target size={56} strokeWidth={1} className="text-pastel-lavender/50" />
                        <div>
                            <p className="text-xl font-semibold text-slate-600">
                                {filter === 'todas' ? 'Nenhuma meta ainda!' : 'Nenhuma meta com esse filtro.'}
                            </p>
                            <p className="text-sm mt-1">
                                {filter === 'todas' ? 'Clique em "Nova Meta" para começar a planejar seus objetivos.' : 'Tente um filtro diferente.'}
                            </p>
                        </div>
                        {filter === 'todas' && (
                            <Button onClick={() => setShowForm(true)}>
                                <Plus size={18} className="mr-2" /> Criar primeira meta
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filtered.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </div>
            )}

            {showForm && (
                <GoalForm
                    onClose={() => setShowForm(false)}
                    onSave={(data) => addGoal(data)}
                />
            )}
        </div>
    );
};

export default Goals;
