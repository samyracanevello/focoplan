import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, Plus, Trash2, Edit3, Clock,
    X, Check, BookOpen, ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSubjectsStore, Subject } from '../store/useSubjectsStore';
import { useTopicsStore } from '../store/useTopicsStore';

// --- Zod Schema ---
const subjectSchema = z.object({
    name: z.string().min(1, 'O nome da matéria é obrigatório.'),
    icon: z.string().min(1),
    color: z.string().min(1),
    weeklyGoalHours: z.string().or(z.number())
});

type SubjectFormData = z.infer<typeof subjectSchema>;

// ─── Constants ───────────────────────────────────────────────────────────────

const SUBJECT_COLORS = [
    '#4F46E5', // indigo
    '#7C3AED', // violet
    '#EC4899', // pink
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#3B82F6', // blue
];

const SUBJECT_EMOJIS = [
    '📐', '📚', '⚖️', '🧬', '🎨', '💻', '🌍', '📊',
    '🎵', '🏋️', '🧮', '📝', '🔬', '🏛️', '💼', '🩺',
    '📖', '🧪', '🎯', '🗣️',
];

// ─── Subject Form ────────────────────────────────────────────────────────────

interface SubjectFormProps {
    onClose: () => void;
    initial?: Subject;
}

const SubjectForm = ({ onClose, initial }: SubjectFormProps) => {
    const { addSubject, updateSubject } = useSubjectsStore();
    const isEditing = Boolean(initial);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SubjectFormData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: initial?.name || '',
            icon: initial?.icon || '📚',
            color: initial?.color || SUBJECT_COLORS[0],
            weeklyGoalHours: initial?.weeklyGoalHours || 10
        }
    });

    const watchIcon = watch('icon');
    const watchColor = watch('color');
    const watchWeeklyGoalHours = watch('weeklyGoalHours');

    const onSubmitForm = (data: SubjectFormData) => {
        const payload = {
            name: data.name.trim(),
            icon: data.icon,
            color: data.color,
            weeklyGoalHours: typeof data.weeklyGoalHours === 'string' ? parseInt(data.weeklyGoalHours, 10) : data.weeklyGoalHours,
        };

        if (isEditing && initial) {
            updateSubject(initial.id, payload);
        } else {
            addSubject(payload);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50" role="dialog">
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(80,60,50,0.25)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 animate-scale-in">
                <div className="card p-6 bg-white/95 shadow-float relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: watchColor + '20' }}>
                            <span className="text-lg">{watchIcon}</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {isEditing ? 'Editar Matéria' : 'Nova Matéria'}
                        </h2>
                    </div>

                    {/* Form wrapper */}
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Nome da Matéria *
                            </label>
                            <input
                                type="text"
                                className="input w-full h-11 text-sm"
                                placeholder="Ex: Matemática, Direito Constitucional..."
                                autoFocus
                                {...register('name')}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                    {/* Emoji picker */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Ícone
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {SUBJECT_EMOJIS.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setValue('icon', e)}
                                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${watchIcon === e
                                        ? 'bg-slate-100 ring-2 ring-slate-300 scale-110'
                                        : 'hover:bg-slate-50'
                                        }`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Cor
                        </label>
                        <div className="flex gap-2">
                            {SUBJECT_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setValue('color', c)}
                                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${watchColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c }}
                                >
                                    {watchColor === c && <Check size={14} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Weekly goal */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Meta Semanal (horas)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={1}
                                max={40}
                                step={1}
                                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                                {...register('weeklyGoalHours')}
                            />
                            <span className="text-sm font-bold text-slate-700 w-12 text-center bg-slate-50 rounded-lg py-1">
                                {watchWeeklyGoalHours}h
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar' : 'Criar Matéria'}
                        </Button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
};

// ─── Subject Card ────────────────────────────────────────────────────────────

const SubjectCard = ({
    subject,
    onEdit,
    onDelete,
    onClick,
    topicStats,
}: {
    subject: Subject;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
    topicStats: { total: number; completed: number; pct: number };
}) => (
    <Card className="p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white/70 cursor-pointer" onClick={onClick}>
        <div className="flex">
            {/* Color bar */}
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: subject.color }} />

            <div className="flex-1 p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                            style={{ backgroundColor: subject.color + '15' }}
                        >
                            {subject.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">{subject.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <Clock size={11} />
                                <span>Meta: {subject.weeklyGoalHours}h/semana</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={onEdit}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Editar"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Topic progress bar */}
                <div className="mt-2">
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                backgroundColor: subject.color,
                                width: `${topicStats.pct}%`,
                                opacity: 0.7,
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-slate-400">
                            {topicStats.total > 0
                                ? `${topicStats.completed}/${topicStats.total} tópicos concluídos`
                                : 'Nenhum tópico cadastrado'
                            }
                        </p>
                        <ChevronRight size={12} className="text-slate-300" />
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const Subjects = () => {
    const { subjects, deleteSubject } = useSubjectsStore();
    const allTopics = useTopicsStore(state => state.topics);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const openNew = () => { setEditingSubject(null); setShowForm(true); };
    const openEdit = (s: Subject) => { setEditingSubject(s); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditingSubject(null); };

    const handleDelete = (s: Subject) => {
        if (window.confirm(`Excluir a matéria "${s.name}"? Isso não apaga tarefas associadas.`)) {
            deleteSubject(s.id);
        }
    };

    const getTopicStats = (subjectId: string) => {
        const st = allTopics.filter(t => t.subjectId === subjectId);
        const completed = st.filter(t => t.completed).length;
        const total = st.length;
        return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    const totalWeeklyHours = subjects.reduce((a, b) => a + b.weeklyGoalHours, 0);

    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <GraduationCap size={24} className="text-pastel-mint" />
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Matérias
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                        Gerencie suas disciplinas de estudo e metas semanais.
                    </p>
                </div>
                <Button onClick={openNew}>
                    <Plus size={16} className="mr-1.5" /> Nova Matéria
                </Button>
            </div>

            {/* Stats banner */}
            {subjects.length > 0 && (
                <div className="flex gap-4 mb-6">
                    <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800">{subjects.length}</p>
                            <p className="text-xs text-slate-400">matéria{subjects.length !== 1 ? 's' : ''}</p>
                        </div>
                    </Card>
                    <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800">{totalWeeklyHours}h</p>
                            <p className="text-xs text-slate-400">meta semanal total</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Grid */}
            {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((s, idx) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                            <SubjectCard
                                subject={s}
                                onEdit={() => openEdit(s)}
                                onDelete={() => handleDelete(s)}
                                onClick={() => navigate(`/subjects/${s.id}`)}
                                topicStats={getTopicStats(s.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card className="p-12 bg-white/50 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center mx-auto mb-4">
                        <GraduationCap size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhuma matéria cadastrada</h3>
                    <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto">
                        Comece adicionando suas disciplinas para organizar seus estudos e acompanhar o progresso por matéria.
                    </p>
                    <Button onClick={openNew}>
                        <Plus size={16} className="mr-1.5" /> Criar primeira matéria
                    </Button>
                </Card>
            )}

            {/* Form Modal */}
            {showForm && (
                <SubjectForm
                    onClose={closeForm}
                    initial={editingSubject || undefined}
                />
            )}
        </div>
    );
};

export default Subjects;
