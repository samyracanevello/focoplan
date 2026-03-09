import { useState, type ChangeEvent } from 'react';
import {
    Settings, Clock, Bell, Palette, Trash2, User, ShieldCheck,
    RotateCcw, Download, Upload,
    LogOut, Moon, Sun, Monitor, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUserStore } from '../store/useUserStore';
import { useTaskStore } from '../store/useTaskStore';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useGoalsStore } from '../store/useGoalsStore';
import { useSubjectsStore } from '../store/useSubjectsStore';
import { useTopicsStore } from '../store/useTopicsStore';
import { useFlashcardsStore } from '../store/useFlashcardsStore';

// ─── Helpers ────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-pastel-mint' : 'bg-slate-200'}`}
    >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const Slider = ({ value, min, max, step = 1, onChange }: {
    value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) => (
    <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-pastel-mint bg-slate-200"
    />
);

const SettingsRow = ({
    label, sub, children, border = true
}: { label: string; sub?: string; children: JSX.Element | JSX.Element[]; border?: boolean }) => (
    <div className={`flex items-center justify-between py-4 gap-4 ${border ? 'border-b border-slate-100 last:border-0' : ''}`}>
        <div>
            <p className="text-sm font-semibold text-slate-700">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const SectionTitle = ({ icon, title }: { icon: JSX.Element; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center">
            {icon}
        </div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

type Tab = 'pomodoro' | 'notificacoes' | 'aparencia' | 'conta' | 'dados';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('pomodoro');
    const { pomodoro, notifications, appearance, updatePomodoro, updateNotifications, updateAppearance, resetToDefaults } = useSettingsStore();
    const { name, setName, logout } = useUserStore();
    const tasks = useTaskStore(state => state.tasks);
    const sessions = usePomodoroStore(state => state.sessions);
    const goals = useGoalsStore(state => state.goals);
    const subjects = useSubjectsStore(state => state.subjects);
    const topicsList = useTopicsStore(state => state.topics);
    const flashcardsList = useFlashcardsStore(state => state.flashcards);

    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(name || '');

    const tabs: { value: Tab; label: string; icon: JSX.Element }[] = [
        { value: 'pomodoro', label: 'Pomodoro', icon: <Clock size={16} /> },
        { value: 'notificacoes', label: 'Notificações', icon: <Bell size={16} /> },
        { value: 'aparencia', label: 'Aparência', icon: <Palette size={16} /> },
        { value: 'conta', label: 'Conta', icon: <User size={16} /> },
        { value: 'dados', label: 'Dados', icon: <ShieldCheck size={16} /> },
    ];

    const accentColors: { value: 'mint' | 'lavender' | 'peach' | 'coral' | 'amber'; label: string; class: string }[] = [
        { value: 'mint', label: 'Verde', class: 'bg-pastel-mint' },
        { value: 'lavender', label: 'Lavanda', class: 'bg-pastel-lavender' },
        { value: 'peach', label: 'Pêssego', class: 'bg-pastel-peach' },
        { value: 'coral', label: 'Coral', class: 'bg-pastel-coral' },
        { value: 'amber', label: 'Âmbar', class: 'bg-pastel-amber' },
    ];

    const handleExport = () => {
        const data = {
            tasks,
            sessions,
            goals,
            subjects,
            topics: topicsList,
            flashcards: flashcardsList,
            exportedAt: new Date().toISOString(),
            version: '1.3',
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focoplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        if (window.confirm('Tem certeza? Todos os dados (tarefas, sessões, metas) serão removidos permanentemente.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (!data.tasks && !data.sessions && !data.goals && !data.subjects) {
                    alert('Arquivo inválido. Certifique-se de que é um backup do FocoPlan.');
                    return;
                }
                if (!window.confirm(
                    `Importar ${data.tasks?.length ?? 0} tarefas, ${data.sessions?.length ?? 0} sessões, ${data.goals?.length ?? 0} metas e ${data.subjects?.length ?? 0} matérias?\n\nIsso substituirá todos os dados atuais.`
                )) return;
                if (data.tasks) useTaskStore.getState().setTasks(data.tasks);
                if (data.sessions) usePomodoroStore.getState().setSessions(data.sessions);
                if (data.goals) useGoalsStore.getState().setGoals(data.goals);
                if (data.subjects) useSubjectsStore.getState().setSubjects(data.subjects);
                if (data.topics) useTopicsStore.getState().setTopics(data.topics);
                if (data.flashcards) useFlashcardsStore.getState().setFlashcards(data.flashcards);
                alert('✅ Dados importados com sucesso!');
            } catch {
                alert('Erro ao ler o arquivo. Verifique se é um JSON válido.');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // reset input
    };

    const requestBrowserNotifications = async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            updateNotifications({ browserNotifications: true });
        } else {
            alert('Permissão negada pelo navegador. Altere nas configurações do browser.');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                    <Settings size={36} className="text-slate-600" />
                    Configurações
                </h1>
                <p className="text-lg text-slate-500">Personalize o FocoPlan de acordo com suas preferências.</p>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
                {/* Side tabs */}
                <div className="lg:w-52 flex-shrink-0">
                    <Card className="p-2 bg-white/70">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.value
                                        ? 'bg-pastel-mint/10 text-pastel-mint'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Content Panel */}
                <div className="flex-1">
                    {/* ── Pomodoro ── */}
                    {activeTab === 'pomodoro' && (
                        <Card className="p-6 bg-white/70">
                            <SectionTitle icon={<Clock size={18} />} title="Configurações do Pomodoro" />
                            <div className="space-y-0">
                                <SettingsRow label="Tempo de foco" sub={`${pomodoro.focusDuration} minutos`}>
                                    <Slider value={pomodoro.focusDuration} min={5} max={60} step={5} onChange={v => updatePomodoro({ focusDuration: v })} />
                                </SettingsRow>
                                <SettingsRow label="Pausa curta" sub={`${pomodoro.shortBreakDuration} minutos`}>
                                    <Slider value={pomodoro.shortBreakDuration} min={1} max={15} step={1} onChange={v => updatePomodoro({ shortBreakDuration: v })} />
                                </SettingsRow>
                                <SettingsRow label="Pausa longa" sub={`${pomodoro.longBreakDuration} minutos`}>
                                    <Slider value={pomodoro.longBreakDuration} min={10} max={30} step={5} onChange={v => updatePomodoro({ longBreakDuration: v })} />
                                </SettingsRow>
                                <SettingsRow label="Sessões antes da pausa longa" sub={`${pomodoro.sessionsBeforeLongBreak} sessões`}>
                                    <Slider value={pomodoro.sessionsBeforeLongBreak} min={2} max={8} step={1} onChange={v => updatePomodoro({ sessionsBeforeLongBreak: v })} />
                                </SettingsRow>
                                <SettingsRow label="Iniciar pausa automaticamente" sub="Passa para a pausa ao terminar um foco">
                                    <Toggle checked={pomodoro.autoStartBreaks} onChange={v => updatePomodoro({ autoStartBreaks: v })} />
                                </SettingsRow>
                                <SettingsRow label="Iniciar foco automaticamente" sub="Reinicia o foco ao terminar a pausa">
                                    <Toggle checked={pomodoro.autoStartFocus} onChange={v => updatePomodoro({ autoStartFocus: v })} />
                                </SettingsRow>
                                <SettingsRow label="Efeito sonoro ao finalizar">
                                    <Toggle checked={pomodoro.soundEnabled} onChange={v => updatePomodoro({ soundEnabled: v })} />
                                </SettingsRow>
                                {pomodoro.soundEnabled && (
                                    <SettingsRow label="Volume do som" sub={`${pomodoro.soundVolume}%`}>
                                        <Slider value={pomodoro.soundVolume} min={0} max={100} step={10} onChange={v => updatePomodoro({ soundVolume: v })} />
                                    </SettingsRow>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* ── Notificações ── */}
                    {activeTab === 'notificacoes' && (
                        <Card className="p-6 bg-white/70">
                            <SectionTitle icon={<Bell size={18} />} title="Notificações" />
                            <div className="space-y-0">
                                <SettingsRow
                                    label="Notificações do navegador"
                                    sub={notifications.browserNotifications ? 'Ativadas — você receberá alertas do sistema' : 'Desativadas'}
                                >
                                    {notifications.browserNotifications ? (
                                        <Toggle checked={true} onChange={v => updateNotifications({ browserNotifications: v })} />
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={requestBrowserNotifications}>
                                            Ativar
                                        </Button>
                                    )}
                                </SettingsRow>
                                <SettingsRow label="Alerta ao finalizar sessão" sub="Som e notificação ao completar um Pomodoro">
                                    <Toggle checked={notifications.sessionCompleteAlert} onChange={v => updateNotifications({ sessionCompleteAlert: v })} />
                                </SettingsRow>
                                <SettingsRow label="Lembrete diário" sub="Receba um push no horário escolhido">
                                    <Toggle checked={notifications.dailyReminderEnabled} onChange={v => updateNotifications({ dailyReminderEnabled: v })} />
                                </SettingsRow>
                                {notifications.dailyReminderEnabled && (
                                    <SettingsRow label="Horário do lembrete">
                                        <input
                                            type="time"
                                            value={notifications.dailyReminderTime}
                                            onChange={e => updateNotifications({ dailyReminderTime: e.target.value })}
                                            className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint text-slate-700"
                                        />
                                    </SettingsRow>
                                )}
                                <SettingsRow label="Relatório semanal" sub="Receba um resumo dos seus Pomodoros toda segunda-feira">
                                    <Toggle checked={notifications.weeklyReportEnabled} onChange={v => updateNotifications({ weeklyReportEnabled: v })} />
                                </SettingsRow>
                            </div>
                        </Card>
                    )}

                    {/* ── Aparência ── */}
                    {activeTab === 'aparencia' && (
                        <Card className="p-6 bg-white/70">
                            <SectionTitle icon={<Palette size={18} />} title="Aparência" />

                            {/* Theme */}
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-700 mb-3">Tema</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { value: 'claro', icon: <Sun size={18} />, label: 'Claro' },
                                        { value: 'escuro', icon: <Moon size={18} />, label: 'Escuro' },
                                        { value: 'automatico', icon: <Monitor size={18} />, label: 'Auto' },
                                    ] as const).map(t => (
                                        <button
                                            key={t.value}
                                            onClick={() => updateAppearance({ theme: t.value })}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${appearance.theme === t.value
                                                ? 'border-pastel-mint bg-pastel-mint/5 text-pastel-mint'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {t.icon}
                                            <span className="text-xs font-semibold">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accent color */}
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-700 mb-3">Cor de destaque</p>
                                <div className="flex gap-3 flex-wrap">
                                    {accentColors.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => updateAppearance({ accentColor: c.value })}
                                            title={c.label}
                                            className={`w-10 h-10 rounded-full ${c.class} flex items-center justify-center transition-all ${appearance.accentColor === c.value ? 'ring-4 ring-offset-2 ring-pastel-mint scale-110' : 'hover:scale-105'
                                                }`}
                                        >
                                            {appearance.accentColor === c.value && <Check size={16} className="text-white" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Other toggles */}
                            <div className="space-y-0 border-t border-slate-100 pt-4">
                                <SettingsRow label="Modo compacto" sub="Interface mais densa para telas menores">
                                    <Toggle checked={appearance.compactMode} onChange={v => updateAppearance({ compactMode: v })} />
                                </SettingsRow>
                                <SettingsRow label="Frases motivacionais" sub="Exibir citações inspiradoras no Dashboard">
                                    <Toggle checked={appearance.showMotivationalQuotes} onChange={v => updateAppearance({ showMotivationalQuotes: v })} />
                                </SettingsRow>
                            </div>
                        </Card>
                    )}

                    {/* ── Conta ── */}
                    {activeTab === 'conta' && (
                        <Card className="p-6 bg-white/70">
                            <SectionTitle icon={<User size={18} />} title="Sua Conta" />

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastel-mint to-pastel-lavender flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                    {(name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800">{name}</p>
                                    <p className="text-sm text-slate-400">Conta local — dados salvos no seu navegador</p>
                                </div>
                            </div>

                            {editingName ? (
                                <div className="flex gap-3 mb-6">
                                    <input
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pastel-mint focus:ring-2 focus:ring-pastel-mint/20"
                                        placeholder="Seu nome"
                                    />
                                    <Button onClick={() => { setName(nameInput); setEditingName(false); }}>Salvar</Button>
                                    <Button variant="outline" onClick={() => setEditingName(false)}>Cancelar</Button>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setEditingName(true)} className="mb-6">
                                    Alterar nome de exibição
                                </Button>
                            )}

                            <div className="border-t border-slate-100 pt-4">
                                <Button
                                    variant="ghost"
                                    className="w-full text-red-400 hover:text-red-500 hover:bg-red-50 justify-start"
                                    onClick={() => { logout(); navigate('/auth'); }}
                                >
                                    <LogOut size={18} className="mr-2" /> Sair da conta
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* ── Dados ── */}
                    {activeTab === 'dados' && (
                        <div className="space-y-4">
                            <Card className="p-6 bg-white/70">
                                <SectionTitle icon={<Download size={18} />} title="Exportar Dados" />
                                <p className="text-sm text-slate-500 mb-5">
                                    Baixe um arquivo JSON com todas as suas tarefas, sessões Pomodoro e metas. Use como backup ou para migrar para outro dispositivo.
                                </p>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-4">
                                    <div className="text-sm">
                                        <p className="font-semibold text-slate-700">Resumo dos dados</p>
                                        <p className="text-slate-400 mt-1">{tasks.length} tarefas · {sessions.length} sessões · {goals.length} metas · {subjects.length} matérias · {flashcardsList.length} flashcards</p>
                                    </div>
                                    <Button onClick={handleExport}>
                                        <Download size={16} className="mr-2" /> Baixar JSON
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-6 bg-white/70">
                                <SectionTitle icon={<Upload size={18} />} title="Importar Dados" />
                                <p className="text-sm text-slate-500 mb-5">
                                    Restaure um backup anterior (.json) exportado pelo FocoPlan. Isso substituirá todos os dados atuais.
                                </p>
                                <label className="cursor-pointer">
                                    <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                                    <span className="btn btn-primary text-white inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold">
                                        <Upload size={16} /> Selecionar arquivo JSON
                                    </span>
                                </label>
                            </Card>

                            <Card className="p-6 bg-white/70">
                                <SectionTitle icon={<RotateCcw size={18} />} title="Redefinir Configurações" />
                                <p className="text-sm text-slate-500 mb-4">
                                    Restaura todas as configurações para os valores padrão do FocoPlan. Seus dados (tarefas, metas) não serão afetados.
                                </p>
                                <Button variant="outline" onClick={() => { if (window.confirm('Redefinir todas as configurações?')) resetToDefaults(); }}>
                                    <RotateCcw size={16} className="mr-2" /> Restaurar padrões
                                </Button>
                            </Card>

                            <Card className="p-6 bg-white/70 border-2 border-red-100">
                                <SectionTitle icon={<Trash2 size={18} />} title="Zona de Perigo" />
                                <p className="text-sm text-slate-500 mb-4">
                                    Esta ação remove <strong>permanentemente</strong> todos os seus dados do navegador: tarefas, sessões, metas e configurações.
                                    <span className="text-red-500 font-semibold"> Não é possível desfazer.</span>
                                </p>
                                <Button
                                    variant="ghost"
                                    className="text-red-500 border border-red-200 hover:bg-red-50"
                                    onClick={handleClearData}
                                >
                                    <Trash2 size={16} className="mr-2" /> Apagar todos os dados
                                </Button>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
