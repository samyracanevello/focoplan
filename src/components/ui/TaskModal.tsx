import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckSquare } from 'lucide-react';
import Button from './Button';
import { useTaskStore, Task, TaskPriority } from '../../store/useTaskStore';
import { useSubjectsStore } from '../../store/useSubjectsStore';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    editTask?: Task | null;
}

const tagColors = [
    { value: 'bg-pastel-lavender text-slate-700', label: 'Lavanda' },
    { value: 'bg-pastel-mint text-slate-700', label: 'Mint' },
    { value: 'bg-pastel-peach text-slate-700', label: 'Pêssego' },
    { value: 'bg-pastel-sky text-slate-700', label: 'Azul' },
    { value: 'bg-pastel-coral/20 text-red-600', label: 'Coral' },
    { value: 'bg-pastel-amber/20 text-amber-700', label: 'Âmbar' },
];

const TaskModal = ({ isOpen, onClose, editTask }: TaskModalProps) => {
    const { addTask, updateTask } = useTaskStore();
    const subjects = useSubjectsStore(state => state.subjects);
    const isEditing = Boolean(editTask);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [tag, setTag] = useState('');
    const [tagColor, setTagColor] = useState(tagColors[0].value);
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');

    // Pre-fill when editing
    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description || '');
            setSubjectId(editTask.subjectId || '');
            setTag(editTask.tag === 'Geral' ? '' : editTask.tag);
            setTagColor(editTask.tagColor);
            setPriority(editTask.priority);
            setDate(editTask.date || '');
            setDuration(editTask.durationMinutes ? String(editTask.durationMinutes) : '');
        } else {
            setTitle(''); setDescription(''); setSubjectId(''); setTag(''); setDate(''); setDuration('');
            setTagColor(tagColors[0].value); setPriority('medium');
        }
    }, [editTask, isOpen]);

    // When a subject is selected, auto-fill tag and tagColor
    const handleSubjectChange = (id: string) => {
        setSubjectId(id);
        if (id) {
            const subject = subjects.find(s => s.id === id);
            if (subject) {
                setTag(subject.name);
                // Map subject color to closest tagColor class
                setTagColor(tagColors[0].value);
            }
        } else {
            setTag('');
            setTagColor(tagColors[0].value);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const payload = {
            title: title.trim(),
            description: description.trim() || undefined,
            subjectId: subjectId || undefined,
            tag: subjectId ? (subjects.find(s => s.id === subjectId)?.name || tag.trim() || 'Geral') : (tag.trim() || 'Geral'),
            tagColor,
            priority,
            date: date || null,
            durationMinutes: duration ? parseInt(duration) : null,
        };

        if (isEditing && editTask) {
            updateTask(editTask.id, payload);
        } else {
            addTask(payload);
        }
        onClose();
    };

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(80,60,50,0.25)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 animate-scale-in">
                <div className="card p-7 bg-white/95 shadow-float relative">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Fechar modal"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl gradient-peach flex items-center justify-center shadow-sm">
                            <CheckSquare size={18} className="text-white" strokeWidth={2} />
                        </div>
                        <h2 id="task-modal-title" className="text-xl font-bold text-slate-800">
                            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Título da Tarefa *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="input w-full h-11 text-sm"
                                placeholder="Ex: Estudar Matemática Discreta..."
                                required
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Notas / Descrição
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="input w-full text-sm min-h-[70px] py-2.5 resize-y"
                                placeholder="Detalhes, links, anotações..."
                                rows={2}
                            />
                        </div>

                        {/* Subject selector + Tag fallback */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Matéria</label>
                                <select
                                    value={subjectId}
                                    onChange={e => handleSubjectChange(e.target.value)}
                                    className="input w-full h-11 text-sm"
                                >
                                    <option value="">Sem matéria</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.icon} {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Cor da Tag</label>
                                <div className="flex gap-2 items-center h-11">
                                    {tagColors.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            title={c.label}
                                            onClick={() => setTagColor(c.value)}
                                            className={`w-7 h-7 rounded-full cursor-pointer transition-all ${c.value.split(' ')[0]} ${tagColor === c.value ? 'ring-4 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Date + Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Data</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="input w-full h-11 text-sm text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Duração (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="480"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    className="input w-full h-11 text-sm"
                                    placeholder="Ex: 60"
                                />
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Prioridade</label>
                            <div className="grid grid-cols-3 gap-2">
                                {([
                                    { v: 'low', label: 'Baixa', on: 'bg-emerald-50 border-emerald-300 text-emerald-700', off: 'text-slate-500' },
                                    { v: 'medium', label: 'Média', on: 'bg-amber-50 border-amber-300 text-amber-700', off: 'text-slate-500' },
                                    { v: 'high', label: 'Alta', on: 'bg-red-50 border-red-300 text-red-700', off: 'text-slate-500' },
                                ] as const).map(p => (
                                    <button
                                        key={p.v}
                                        type="button"
                                        onClick={() => setPriority(p.v)}
                                        className={`py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${priority === p.v ? p.on : `border-pastel-border bg-white ${p.off} hover:border-slate-300`}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
