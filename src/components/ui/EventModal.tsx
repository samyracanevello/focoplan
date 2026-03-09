import { useState, useEffect, type FormEvent } from 'react';
import { X, Calendar, Clock, Palette, Trash2, AlertCircle } from 'lucide-react';
import Button from './Button';
import { useEventsStore, CalendarEvent } from '../../store/useEventsStore';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    editEvent?: CalendarEvent | null;
    defaultDate?: string; // pre-fill date when clicking on a day
}

const EVENT_COLORS = [
    { key: 'mint', bg: '#8FC4B0', label: 'Verde' },
    { key: 'coral', bg: '#EE9090', label: 'Coral' },
    { key: 'peach', bg: '#F8C9A0', label: 'Pêssego' },
    { key: 'lavender', bg: '#C9C0DE', label: 'Lavanda' },
    { key: 'sky', bg: '#A8CEDD', label: 'Azul' },
    { key: 'amber', bg: '#F5C771', label: 'Âmbar' },
];

const EventModal = ({ isOpen, onClose, editEvent, defaultDate }: EventModalProps) => {
    const { addEvent, updateEvent, deleteEvent } = useEventsStore();
    const isEditing = Boolean(editEvent);

    // Evaluated at call-time (not module-load-time) so it's always today's date
    const todayStr = () => new Date().toISOString().slice(0, 10);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(todayStr);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [color, setColor] = useState('mint');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editEvent) {
                setTitle(editEvent.title);
                setDate(editEvent.date);
                setStartTime(editEvent.startTime);
                setEndTime(editEvent.endTime);
                setColor(editEvent.color);
                setDescription(editEvent.description || '');
            } else {
                setTitle('');
                setDate(defaultDate || todayStr());
                setStartTime('09:00');
                setEndTime('10:00');
                setColor('mint');
                setDescription('');
            }
            setError('');
        }
    }, [isOpen, editEvent, defaultDate]);

    const validate = (): boolean => {
        if (!title.trim()) { setError('O título do evento é obrigatório.'); return false; }
        if (!date) { setError('A data é obrigatória.'); return false; }
        if (!startTime) { setError('O horário de início é obrigatório.'); return false; }
        if (endTime && endTime <= startTime) {
            setError('O horário de término deve ser após o início.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate async (localStorage is sync, but this gives visual feedback)
        await new Promise(r => setTimeout(r, 150));

        const payload = {
            title: title.trim(),
            date,
            startTime,
            endTime: endTime || startTime,
            color,
            description: description.trim() || undefined,
        };

        if (isEditing && editEvent) {
            updateEvent(editEvent.id, payload);
        } else {
            addEvent(payload);
        }

        setLoading(false);
        onClose();
    };

    const handleDelete = () => {
        if (editEvent && window.confirm(`Excluir "${editEvent.title}"?`)) {
            deleteEvent(editEvent.id);
            onClose();
        }
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
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(60,40,30,0.30)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
                <div className="card p-7 shadow-float relative bg-white/97" style={{ background: 'rgba(255,255,255,0.97)' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl gradient-mint flex items-center justify-center shadow-sm">
                                <Calendar size={18} className="text-white" />
                            </div>
                            <h2 id="event-modal-title" className="text-xl font-bold text-slate-800">
                                {isEditing ? 'Editar Evento' : 'Novo Evento'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 text-sm text-red-600">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Título *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => { setTitle(e.target.value); setError(''); }}
                                className="input w-full h-11 text-sm"
                                placeholder="Ex: Prova de Cálculo, Apresentação TCC..."
                                autoFocus
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <Calendar size={14} /> Data *
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => { setDate(e.target.value); setError(''); }}
                                className="input w-full h-11 text-sm"
                                required
                            />
                        </div>

                        {/* Time row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                    <Clock size={14} /> Início *
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => { setStartTime(e.target.value); setError(''); }}
                                    className="input w-full h-11 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Término</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => { setEndTime(e.target.value); setError(''); }}
                                    className="input w-full h-11 text-sm"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Descrição (opcional)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="input w-full text-sm resize-none"
                                rows={2}
                                placeholder="Notas adicionais..."
                            />
                        </div>

                        {/* Color picker */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                                <Palette size={14} /> Cor do evento
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {EVENT_COLORS.map(c => (
                                    <button
                                        key={c.key}
                                        type="button"
                                        title={c.label}
                                        onClick={() => setColor(c.key)}
                                        className={`w-8 h-8 rounded-full transition-all ${color === c.key ? 'ring-4 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                        style={{ background: c.bg }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex justify-between items-center">
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={15} /> Excluir
                                </button>
                            ) : <div />}
                            <div className="flex gap-2">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                                <Button type="submit" loading={loading} variant="mint">
                                    {isEditing ? 'Salvar' : 'Criar Evento'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
