import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { format, addDays, startOfWeek, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/ui/Button';
import EventModal from '../components/ui/EventModal';
import { useEventsStore, CalendarEvent } from '../store/useEventsStore';
import { useTaskStore } from '../store/useTaskStore';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7h–21h
const HOUR_PX = 72; // pixels per hour

const COLOR_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    mint: { bg: '#8FC4B010', text: '#4A8070', border: '#8FC4B0' },
    coral: { bg: '#EE909010', text: '#A04040', border: '#EE9090' },
    peach: { bg: '#F8C9A010', text: '#A07040', border: '#F8C9A0' },
    lavender: { bg: '#C9C0DE10', text: '#6060A0', border: '#C9C0DE' },
    sky: { bg: '#A8CEDD10', text: '#3070A0', border: '#A8CEDD' },
    amber: { bg: '#F5C77110', text: '#906020', border: '#F5C771' },
};

const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
    const [defaultDate, setDefaultDate] = useState('');


    const { events, deleteEvent } = useEventsStore();
    const tasks = useTaskStore(s => s.tasks);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    const weekDays = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const prevWeek = () => setCurrentDate(d => addDays(d, -7));
    const nextWeek = () => setCurrentDate(d => addDays(d, 7));
    const goToday = () => setCurrentDate(new Date());

    const openCreate = (date?: string) => {
        setEditEvent(null);
        setDefaultDate(date || '');
        setModalOpen(true);
    };
    const openEdit = (ev: CalendarEvent) => {
        setEditEvent(ev);
        setDefaultDate('');
        setModalOpen(true);
    };
    const closeModal = () => { setModalOpen(false); setEditEvent(null); };

    return (
        <div className="p-4 md:p-6 flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800 capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h1>
                    <div className="card flex items-center p-1 gap-0.5">
                        <button onClick={prevWeek} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-700 transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={goToday} className="px-3 h-7 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white transition-colors">
                            Hoje
                        </button>
                        <button onClick={nextWeek} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-700 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <Button onClick={() => openCreate()} size="sm">
                    <Plus size={15} className="mr-1" /> Novo Evento
                </Button>
            </div>

            {/* Calendar grid */}
            <div className="card flex-1 overflow-hidden flex flex-col min-h-[500px]" style={{ padding: 0 }}>
                {/* Day headers */}
                <div className="grid border-b border-pastel-border/40" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
                    <div className="p-2 border-r border-pastel-border/30">
                        <span className="text-[10px] text-pastel-muted">GMT-3</span>
                    </div>
                    {weekDays.map(day => {
                        const today_ = isToday(day);
                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => openCreate(format(day, 'yyyy-MM-dd'))}
                                className={`p-3 text-center border-r border-pastel-border/30 last:border-0 cursor-pointer hover:bg-white/40 transition-colors ${today_ ? 'bg-pastel-mint/5' : ''}`}
                            >
                                <div className="text-[11px] font-semibold text-pastel-muted uppercase tracking-wider">
                                    {format(day, 'EEE', { locale: ptBR })}
                                </div>
                                <div className={`text-lg font-bold mt-0.5 ${today_ ? 'text-white' : 'text-slate-700'}`}>
                                    {today_ ? (
                                        <span className="w-8 h-8 rounded-full gradient-mint inline-flex items-center justify-center text-sm shadow-sm">
                                            {format(day, 'd')}
                                        </span>
                                    ) : format(day, 'd')}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="relative" style={{ gridTemplateColumns: '56px repeat(7, 1fr)', display: 'grid' }}>
                        {/* Time labels */}
                        <div className="border-r border-pastel-border/30 bg-white/20">
                            {HOURS.map(h => (
                                <div key={h} style={{ height: HOUR_PX }} className="border-b border-pastel-border/20 relative">
                                    <span className="absolute -top-2.5 right-2 text-[10px] text-pastel-muted font-medium">
                                        {h}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {weekDays.map(day => {
                            const dayStr = format(day, 'yyyy-MM-dd');
                            const dayEvents = events.filter(e => e.date === dayStr);
                            const dayTasks = tasks.filter(t => t.date === dayStr && t.status === 'pending');
                            const today_ = isToday(day);

                            return (
                                <div
                                    key={dayStr}
                                    className={`relative border-r border-pastel-border/30 last:border-0 ${today_ ? 'bg-pastel-mint/3' : ''}`}
                                >
                                    {/* Hour grid lines */}
                                    {HOURS.map(h => (
                                        <div
                                            key={h}
                                            style={{ height: HOUR_PX }}
                                            className="border-b border-pastel-border/20 border-dashed hover:bg-white/30 transition-colors cursor-pointer"
                                            onClick={() => openCreate(dayStr)}
                                        />
                                    ))}

                                    {/* Task chips (no time — shown at top) */}
                                    {dayTasks.slice(0, 2).map((t, i) => (
                                        <div
                                            key={t.id}
                                            className="absolute left-1 right-1 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold truncate"
                                            style={{ top: 4 + i * 18, background: '#F5F1EC', color: '#8A8080', border: '1px solid #EDE8E2', zIndex: 5 }}
                                        >
                                            📋 {t.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 2 && (
                                        <div className="absolute left-1 right-1 text-[10px] text-pastel-muted font-medium" style={{ top: 4 + 2 * 18 }}>
                                            +{dayTasks.length - 2} tarefas
                                        </div>
                                    )}

                                    {/* Calendar events */}
                                    {dayEvents.map(ev => {
                                        const startMin = timeToMinutes(ev.startTime) - 7 * 60;
                                        const endMin = timeToMinutes(ev.endTime || ev.startTime) - 7 * 60;
                                        const top = (startMin / 60) * HOUR_PX;
                                        const height = Math.max(((endMin - startMin) / 60) * HOUR_PX, 28);
                                        const cs = COLOR_STYLES[ev.color] || COLOR_STYLES.mint;

                                        return (
                                            <div
                                                key={ev.id}
                                                className="absolute left-1 right-1 rounded-xl px-2 py-1 cursor-pointer hover:brightness-95 transition-all shadow-sm group"
                                                style={{
                                                    top,
                                                    height,
                                                    background: cs.bg,
                                                    borderLeft: `3px solid ${cs.border}`,
                                                    zIndex: 10,
                                                    border: `1px solid ${cs.border}40`,
                                                    borderLeftColor: cs.border,
                                                    borderLeftWidth: 3,
                                                }}
                                                onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                                            >
                                                <p className="text-[11px] font-bold leading-tight truncate" style={{ color: cs.text }}>
                                                    {ev.title}
                                                </p>
                                                {height > 36 && (
                                                    <p className="text-[10px] leading-tight opacity-75" style={{ color: cs.text }}>
                                                        {ev.startTime} – {ev.endTime}
                                                    </p>
                                                )}
                                                {height > 52 && ev.description && (
                                                    <p className="text-[10px] mt-0.5 opacity-60 truncate" style={{ color: cs.text }}>
                                                        {ev.description}
                                                    </p>
                                                )}
                                                <button
                                                    className="absolute top-1 right-1 w-4 h-4 rounded opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center hover:opacity-100"
                                                    style={{ background: cs.border + '40', color: cs.text }}
                                                    onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }}
                                                    title="Excluir evento"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Event stats footer */}
            {(() => {
                const weekDayStrs = weekDays.map(d => format(d, 'yyyy-MM-dd'));
                const weekEventCount = events.filter(e => weekDayStrs.includes(e.date)).length;
                return weekEventCount > 0 ? (
                    <p className="text-xs text-pastel-muted text-center mt-2">
                        {weekEventCount} evento{weekEventCount !== 1 ? 's' : ''} nesta semana
                    </p>
                ) : null;
            })()}

            <EventModal
                isOpen={modalOpen}
                onClose={closeModal}
                editEvent={editEvent}
                defaultDate={defaultDate}
            />
        </div>
    );
};

export default CalendarView;
