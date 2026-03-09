import { useState } from 'react';
import {
    Bell, CheckCircle2, Clock, Target, Trophy,
    Trash2, CheckCheck, Inbox
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore, AppNotification, NotificationType } from '../store/useNotificationsStore';

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    pomodoro: {
        icon: <Clock size={16} />,
        color: 'text-pastel-mint',
        bg: 'bg-emerald-50',
        label: 'Pomodoro',
    },
    tarefa: {
        icon: <CheckCircle2 size={16} />,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        label: 'Tarefa',
    },
    meta: {
        icon: <Target size={16} />,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        label: 'Meta',
    },
    sistema: {
        icon: <Bell size={16} />,
        color: 'text-slate-500',
        bg: 'bg-slate-50',
        label: 'Sistema',
    },
    conquista: {
        icon: <Trophy size={16} />,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        label: 'Conquista',
    },
};

type FilterType = 'todas' | NotificationType;

const NotificationCard = ({ notif, onMarkRead, onDelete }: {
    notif: AppNotification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    const navigate = useNavigate();
    const config = typeConfig[notif.type];
    const timeAgo = formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR });

    return (
        <div
            className={`relative group flex gap-4 p-5 rounded-2xl border transition-all duration-200 ${notif.read
                ? 'bg-white/40 border-slate-100/50'
                : 'bg-white border-pastel-mint/20 shadow-sm'
                }`}
        >
            {/* Unread dot */}
            {!notif.read && (
                <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-pastel-mint animate-pulse" />
            )}

            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center mt-0.5`}>
                {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${config.bg} ${config.color}`}>
                            {config.label}
                        </span>
                        <h4 className={`text-sm font-semibold ${notif.read ? 'text-slate-500' : 'text-slate-800'}`}>
                            {notif.title}
                        </h4>
                    </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{notif.message}</p>

                <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-400">{timeAgo}</span>
                    {notif.actionLabel && notif.actionPath && (
                        <button
                            onClick={() => { onMarkRead(notif.id); navigate(notif.actionPath!); }}
                            className="text-xs font-semibold text-pastel-mint hover:text-emerald-600 transition-colors"
                        >
                            {notif.actionLabel} →
                        </button>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.read && (
                    <button
                        onClick={() => onMarkRead(notif.id)}
                        title="Marcar como lida"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pastel-mint hover:bg-emerald-50 transition-colors"
                    >
                        <CheckCircle2 size={15} />
                    </button>
                )}
                <button
                    onClick={() => onDelete(notif.id)}
                    title="Remover"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
};

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationsStore();
    const [filter, setFilter] = useState<FilterType>('todas');

    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = filter === 'todas'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const filters: { value: FilterType; label: string }[] = [
        { value: 'todas', label: 'Todas' },
        { value: 'sistema', label: 'Sistema' },
        { value: 'tarefa', label: 'Tarefa' },
        { value: 'pomodoro', label: 'Pomodoro' },
        { value: 'meta', label: 'Meta' },
        { value: 'conquista', label: 'Conquista' },
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                        <Bell size={36} className="text-pastel-lavender" />
                        Notificações
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-bold bg-pastel-coral text-white rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-lg text-slate-500">Fique por dentro das suas atividades e avisos do sistema.</p>
                </div>
                {notifications.length > 0 && (
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button variant="outline" size="sm" onClick={markAllAsRead}>
                                <CheckCheck size={15} className="mr-1.5" /> Marcar tudo como lido
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 size={15} className="mr-1.5" /> Limpar tudo
                        </Button>
                    </div>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {filters.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${filter === f.value
                            ? 'bg-white shadow-sm text-pastel-mint border border-white/60'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                            }`}
                    >
                        {f.label}
                        {f.value === 'todas' && unreadCount > 0 && (
                            <span className="ml-1.5 text-xs bg-pastel-coral text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications list */}
            {filtered.length === 0 ? (
                <Card className="p-16 text-center bg-white/50">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <Inbox size={48} strokeWidth={1} />
                        <div>
                            <p className="text-lg font-semibold text-slate-600">Nenhuma notificação</p>
                            <p className="text-sm mt-1">Você está em dia com tudo! ✨</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map(notif => (
                        <NotificationCard
                            key={notif.id}
                            notif={notif}
                            onMarkRead={markAsRead}
                            onDelete={deleteNotification}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
