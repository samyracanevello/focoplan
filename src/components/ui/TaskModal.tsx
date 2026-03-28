import { useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from './Button';
import { useTaskStore, Task } from '../../store/useTaskStore';
import { useSubjectsStore } from '../../store/useSubjectsStore';

// --- Zod Schema ---
const taskSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório.'),
    description: z.string().optional(),
    subjectId: z.string().optional(),
    tag: z.string().optional(),
    tagColor: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    date: z.string().optional().nullable(),
    durationMinutes: z.string().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

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

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '', description: '', subjectId: '', tag: '', tagColor: tagColors[0].value, priority: 'medium', date: '', durationMinutes: null
        }
    });

    const watchSubjectId = watch('subjectId');
    const watchTagColor = watch('tagColor');
    const watchPriority = watch('priority');

    // Pre-fill when editing or reset when opening
    useEffect(() => {
        if (isOpen) {
            if (editTask) {
                reset({
                    title: editTask.title,
                    description: editTask.description || '',
                    subjectId: editTask.subjectId || '',
                    tag: editTask.tag === 'Geral' ? '' : editTask.tag,
                    tagColor: editTask.tagColor,
                    priority: editTask.priority,
                    date: editTask.date || '',
                    durationMinutes: editTask.durationMinutes ? String(editTask.durationMinutes) : '',
                });
            } else {
                reset({ title: '', description: '', subjectId: '', tag: '', tagColor: tagColors[0].value, priority: 'medium', date: '', durationMinutes: '' });
            }
        }
    }, [editTask, isOpen, reset]);

    // When a subject is selected, auto-fill base tagColor (we leave 'tag' blank so we use subject name as fallback on submit, or user can override)
    useEffect(() => {
        if (watchSubjectId) {
            setValue('tagColor', tagColors[0].value);
        }
    }, [watchSubjectId, setValue]);

    const onSubmitForm = (data: TaskFormData) => {
        const payload = {
            title: data.title.trim(),
            description: data.description?.trim() || undefined,
            subjectId: data.subjectId || undefined,
            tag: data.subjectId ? (subjects.find(s => s.id === data.subjectId)?.name || data.tag?.trim() || 'Geral') : (data.tag?.trim() || 'Geral'),
            tagColor: data.tagColor,
            priority: data.priority,
            date: data.date || null,
            durationMinutes: data.durationMinutes ? parseInt(data.durationMinutes, 10) : null,
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

                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Título da Tarefa *
                            </label>
                            <input
                                type="text"
                                className="input w-full h-11 text-sm"
                                placeholder="Ex: Estudar Matemática Discreta..."
                                autoFocus
                                {...register('title')}
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Notas / Descrição
                            </label>
                            <textarea
                                className="input w-full text-sm min-h-[70px] py-2.5 resize-y"
                                placeholder="Detalhes, links, anotações..."
                                rows={2}
                                {...register('description')}
                            />
                        </div>

                        {/* Subject selector + Tag fallback */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Matéria</label>
                                <select
                                    className="input w-full h-11 text-sm"
                                    {...register('subjectId')}
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
                                            onClick={() => setValue('tagColor', c.value)}
                                            className={`w-7 h-7 rounded-full cursor-pointer transition-all ${c.value.split(' ')[0]} ${watchTagColor === c.value ? 'ring-4 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-110'}`}
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
                                    className="input w-full h-11 text-sm text-slate-600"
                                    {...register('date')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Duração (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="480"
                                    className="input w-full h-11 text-sm"
                                    placeholder="Ex: 60"
                                    {...register('durationMinutes')}
                                />
                                {errors.durationMinutes && <p className="mt-1 text-xs text-red-500">{errors.durationMinutes.message}</p>}
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
                                        onClick={() => setValue('priority', p.v)}
                                        className={`py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${watchPriority === p.v ? p.on : `border-pastel-border bg-white ${p.off} hover:border-slate-300`}`}
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
