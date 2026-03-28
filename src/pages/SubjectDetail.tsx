import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Plus, Trash2, Check, ChevronRight,
    ChevronDown, GraduationCap, Clock, BarChart3
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSubjectsStore } from '../store/useSubjectsStore';
import { useTopicsStore, Topic } from '../store/useTopicsStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- Zod Schema ---
const topicSchema = z.object({
    title: z.string().min(1, 'O nome do tópico é obrigatório.')
});

type TopicFormData = z.infer<typeof topicSchema>;

// ─── Topic Item (recursive) ──────────────────────────────────────────────────

interface TopicItemProps {
    topic: Topic;
    allTopics: Topic[];
    depth: number;
}

const TopicItem = ({ topic, allTopics, depth }: TopicItemProps) => {
    const { toggleTopic, addTopic, deleteTopic } = useTopicsStore();
    const [expanded, setExpanded] = useState(true);
    const [adding, setAdding] = useState(false);

    const { register, handleSubmit, reset } = useForm<TopicFormData>({
        resolver: zodResolver(topicSchema),
        defaultValues: { title: '' }
    });

    const children = allTopics
        .filter(t => t.parentId === topic.id)
        .sort((a, b) => a.order - b.order);

    const hasChildren = children.length > 0;

    const childrenCompleted = children.filter(c => c.completed).length;
    const childrenTotal = children.length;

    const handleAdd = (data: TopicFormData) => {
        addTopic({ subjectId: topic.subjectId, parentId: topic.id, title: data.title.trim(), order: 0, completed: false });
        reset();
        setAdding(false);
        setExpanded(true);
    };

    const handleDelete = () => {
        if (window.confirm(`Excluir "${topic.title}" e todos os subtópicos?`)) {
            deleteTopic(topic.id);
        }
    };

    return (
        <div>
            <div
                className={`group flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-slate-50/80 transition-colors ${depth > 0 ? 'ml-6' : ''
                    }`}
            >
                {/* Expand/collapse toggle */}
                <button
                    onClick={() => hasChildren && setExpanded(!expanded)}
                    className={`w-5 h-5 flex items-center justify-center text-slate-400 flex-shrink-0 ${hasChildren ? 'hover:text-slate-600 cursor-pointer' : 'invisible'
                        }`}
                >
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {/* Checkbox */}
                <button
                    onClick={() => toggleTopic(topic.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${topic.completed
                            ? 'bg-pastel-mint border-pastel-mint text-white'
                            : 'border-slate-300 hover:border-pastel-mint bg-white'
                        }`}
                >
                    {topic.completed && <Check size={12} strokeWidth={3} />}
                </button>

                {/* Title */}
                <span
                    className={`flex-1 text-sm ${topic.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 font-medium'
                        }`}
                >
                    {topic.title}
                </span>

                {/* Child count */}
                {hasChildren && (
                    <span className="text-[11px] text-slate-400 tabular-nums">
                        {childrenCompleted}/{childrenTotal}
                    </span>
                )}

                {/* Actions (show on hover) */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setAdding(!adding)}
                        className="p-1 rounded-md text-slate-400 hover:text-pastel-mint hover:bg-pastel-mint/10 transition-colors"
                        title="Adicionar subtópico"
                    >
                        <Plus size={13} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Excluir"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {/* Inline add form */}
            {adding && (
                <form onSubmit={handleSubmit(handleAdd)} className={`flex items-center gap-2 py-1.5 px-3 ${depth > 0 ? 'ml-12' : 'ml-6'}`}>
                    <input
                        type="text"
                        className="flex-1 input h-8 text-sm"
                        placeholder="Nome do subtópico..."
                        autoFocus
                        {...register('title')}
                        onKeyDown={e => { if (e.key === 'Escape') setAdding(false); }}
                    />
                    <button type="submit" className="px-2.5 py-1 text-xs font-semibold bg-pastel-mint/10 text-pastel-mint rounded-lg hover:bg-pastel-mint/20 transition-colors">
                        OK
                    </button>
                    <button type="button" onClick={() => setAdding(false)} className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </form>
            )}

            {/* Children */}
            {expanded && children.map(child => (
                <TopicItem
                    key={child.id}
                    topic={child}
                    allTopics={allTopics}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const SubjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const subject = useSubjectsStore(state => state.subjects.find(s => s.id === id));
    const allTopics = useTopicsStore(state => state.topics.filter(t => t.subjectId === id));
    const { addTopic } = useTopicsStore();

    const { register, handleSubmit, reset } = useForm<TopicFormData>({
        resolver: zodResolver(topicSchema),
        defaultValues: { title: '' }
    });

    // Redirect if subject not found
    if (!subject) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <Card className="p-12 bg-white/50">
                    <h2 className="text-lg font-bold text-slate-700 mb-2">Matéria não encontrada</h2>
                    <p className="text-sm text-slate-400 mb-4">Essa matéria pode ter sido excluída.</p>
                    <Link to="/subjects">
                        <Button><ArrowLeft size={16} className="mr-1.5" /> Voltar para Matérias</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const rootTopics = allTopics
        .filter(t => t.parentId === null)
        .sort((a, b) => a.order - b.order);

    const stats = useMemo(() => {
        const total = allTopics.length;
        const completed = allTopics.filter(t => t.completed).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pct };
    }, [allTopics]);

    const handleAddRoot = (data: TopicFormData) => {
        addTopic({ subjectId: subject.id, parentId: null, title: data.title.trim(), order: 0, completed: false });
        reset();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <Link to="/subjects" className="hover:text-slate-600 transition-colors flex items-center gap-1">
                    <GraduationCap size={14} /> Matérias
                </Link>
                <ChevronRight size={14} />
                <span className="text-slate-700 font-medium">{subject.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: subject.color + '15' }}
                >
                    {subject.icon}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        {subject.name}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Edital · Checklist de tópicos de estudo
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/subjects')}>
                    <ArrowLeft size={16} className="mr-1.5" /> Voltar
                </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: subject.color + '15', color: subject.color }}>
                        <BarChart3 size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.pct}%</p>
                        <p className="text-xs text-slate-400">concluído</p>
                    </div>
                </Card>
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center">
                        <Check size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.completed}<span className="text-base font-normal text-slate-400">/{stats.total}</span></p>
                        <p className="text-xs text-slate-400">tópicos</p>
                    </div>
                </Card>
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{subject.weeklyGoalHours}h</p>
                        <p className="text-xs text-slate-400">meta/semana</p>
                    </div>
                </Card>
            </div>

            {/* Progress bar */}
            {stats.total > 0 && (
                <div className="mb-6">
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${stats.pct}%`, backgroundColor: subject.color }}
                        />
                    </div>
                </div>
            )}

            {/* Topics checklist */}
            <Card className="p-5 bg-white/70">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-700">Tópicos do Edital</h2>
                </div>

                {/* Add root topic */}
                <form onSubmit={handleSubmit(handleAddRoot)} className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="flex-1 input h-9 text-sm"
                        placeholder="Adicionar tópico principal..."
                        {...register('title')}
                    />
                    <Button type="submit" size="sm">
                        <Plus size={14} className="mr-1" /> Adicionar
                    </Button>
                </form>

                {/* Topic tree */}
                {rootTopics.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {rootTopics.map(topic => (
                            <TopicItem
                                key={topic.id}
                                topic={topic}
                                allTopics={allTopics}
                                depth={0}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">Nenhum tópico adicionado.</p>
                        <p className="text-xs mt-1">Cole os tópicos do edital ou adicione um por um acima.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SubjectDetail;
