import { useState, useMemo, useCallback } from 'react';
import {
    Layers, Plus, Trash2, X, RotateCcw,
    ChevronRight, BookOpen, Clock, Check, Brain, Zap
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useFlashcardsStore, Flashcard, ReviewQuality } from '../store/useFlashcardsStore';
import { useSubjectsStore, Subject } from '../store/useSubjectsStore';
import { fireConfetti } from '../utils/confetti';

// ─── Card Form ───────────────────────────────────────────────────────────────

interface CardFormProps {
    onClose: () => void;
    subjectId: string;
    initial?: Flashcard;
}

const CardForm = ({ onClose, subjectId, initial }: CardFormProps) => {
    const { addFlashcard, updateFlashcard } = useFlashcardsStore();
    const isEditing = Boolean(initial);

    const [front, setFront] = useState(initial?.front || '');
    const [back, setBack] = useState(initial?.back || '');

    const handleSubmit = () => {
        if (!front.trim() || !back.trim()) return;
        if (isEditing && initial) {
            updateFlashcard(initial.id, { front: front.trim(), back: back.trim() });
        } else {
            addFlashcard({ subjectId, front: front.trim(), back: back.trim() });
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

                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-pastel-lavender/20 flex items-center justify-center">
                            <Layers size={18} className="text-pastel-lavender" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {isEditing ? 'Editar Card' : 'Novo Flashcard'}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Frente (pergunta) *
                            </label>
                            <textarea
                                value={front}
                                onChange={e => setFront(e.target.value)}
                                className="input w-full text-sm min-h-[80px] py-2.5 resize-y"
                                placeholder="Ex: O que é o princípio da legalidade?"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                                Verso (resposta) *
                            </label>
                            <textarea
                                value={back}
                                onChange={e => setBack(e.target.value)}
                                className="input w-full text-sm min-h-[80px] py-2.5 resize-y"
                                placeholder="Ex: Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei (art. 5º, II, CF)."
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-1">
                            <Button variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button onClick={handleSubmit} disabled={!front.trim() || !back.trim()}>
                                {isEditing ? 'Salvar' : 'Criar Card'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Study Mode ──────────────────────────────────────────────────────────────

interface StudyModeProps {
    cards: Flashcard[];
    subject: Subject;
    onFinish: () => void;
}

const QUALITY_BUTTONS: { quality: ReviewQuality; label: string; desc: string; color: string }[] = [
    { quality: 0, label: 'Esqueci', desc: 'Não lembrei nada', color: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' },
    { quality: 3, label: 'Difícil', desc: 'Lembrei com esforço', color: 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' },
    { quality: 4, label: 'Bom', desc: 'Hesitei um pouco', color: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' },
    { quality: 5, label: 'Fácil', desc: 'Resposta imediata', color: 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' },
];

const StudyMode = ({ cards, subject, onFinish }: StudyModeProps) => {
    const { reviewFlashcard } = useFlashcardsStore();
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [reviewed, setReviewed] = useState(0);

    const current = cards[index];
    if (!current) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Sessão concluída! 🎉</h2>
                <p className="text-sm text-slate-500 mb-5">{reviewed} card{reviewed !== 1 ? 's' : ''} revisado{reviewed !== 1 ? 's' : ''}.</p>
                <Button onClick={onFinish}>Voltar aos Decks</Button>
            </div>
        );
    }

    const handleReview = (quality: ReviewQuality) => {
        reviewFlashcard(current.id, quality);
        setReviewed(r => r + 1);
        setFlipped(false);
        if (quality >= 4) fireConfetti();
        if (index + 1 >= cards.length) {
            // Show completion screen
            setIndex(index + 1);
        } else {
            setIndex(index + 1);
        }
    };

    const progress = Math.round(((index) / cards.length) * 100);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{subject.icon}</span>
                    <span className="text-sm font-semibold text-slate-600">{subject.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 tabular-nums">{index + 1}/{cards.length}</span>
                    <Button variant="ghost" size="sm" onClick={onFinish}>
                        <X size={14} className="mr-1" /> Sair
                    </Button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 mb-8 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: subject.color }}
                />
            </div>

            {/* Card */}
            <div
                onClick={() => !flipped && setFlipped(true)}
                className={`card p-8 min-h-[280px] flex flex-col items-center justify-center text-center transition-all duration-300 ${
                    !flipped ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''
                }`}
                style={{ borderTop: `3px solid ${subject.color}` }}
            >
                {!flipped ? (
                    <>
                        <div className="w-10 h-10 rounded-xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center mb-4">
                            <Brain size={20} />
                        </div>
                        <p className="text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {current.front}
                        </p>
                        <p className="text-xs text-slate-400 mt-6 flex items-center gap-1">
                            <RotateCcw size={11} /> Clique para ver a resposta
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-xl bg-pastel-mint/10 text-pastel-mint flex items-center justify-center mb-4">
                            <Zap size={20} />
                        </div>
                        <p className="text-lg font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {current.back}
                        </p>
                    </>
                )}
            </div>

            {/* Quality buttons */}
            {flipped && (
                <div className="grid grid-cols-4 gap-2 mt-5 animate-scale-in">
                    {QUALITY_BUTTONS.map(q => (
                        <button
                            key={q.quality}
                            onClick={() => handleReview(q.quality)}
                            className={`py-3 px-2 rounded-xl border-2 transition-all text-center ${q.color}`}
                        >
                            <span className="block text-sm font-bold">{q.label}</span>
                            <span className="block text-[10px] mt-0.5 opacity-70">{q.desc}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

type ViewMode = 'decks' | 'study' | 'list';

const Flashcards = () => {
    const { flashcards, deleteFlashcard } = useFlashcardsStore();
    const getDueCards = useFlashcardsStore(state => state.getDueCards);
    const subjects = useSubjectsStore(state => state.subjects);

    const [viewMode, setViewMode] = useState<ViewMode>('decks');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formSubjectId, setFormSubjectId] = useState('');

    // Group flashcards by subject
    const deckStats = useMemo(() => {
        return subjects.map(subj => {
            const cards = flashcards.filter(f => f.subjectId === subj.id);
            const due = getDueCards(subj.id).length;
            return { subject: subj, total: cards.length, due };
        }).filter(d => d.total > 0 || d.due > 0);
    }, [subjects, flashcards, getDueCards]);

    const totalDue = useMemo(() => getDueCards().length, [getDueCards, flashcards]);

    const openAddForm = useCallback((subjectId: string) => {
        setFormSubjectId(subjectId);
        setShowForm(true);
    }, []);

    const startStudy = useCallback((subjectId: string) => {
        setSelectedSubjectId(subjectId);
        setViewMode('study');
    }, []);

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const dueCardsForStudy = selectedSubjectId ? getDueCards(selectedSubjectId) : [];

    // List view — all cards for a subject
    const showList = (subjectId: string) => {
        setSelectedSubjectId(subjectId);
        setViewMode('list');
    };

    if (viewMode === 'study' && selectedSubject) {
        return (
            <div className="p-6 max-w-6xl mx-auto w-full">
                <StudyMode
                    cards={dueCardsForStudy}
                    subject={selectedSubject}
                    onFinish={() => setViewMode('decks')}
                />
            </div>
        );
    }

    if (viewMode === 'list' && selectedSubjectId) {
        const listCards = flashcards.filter(f => f.subjectId === selectedSubjectId);
        const subj = subjects.find(s => s.id === selectedSubjectId);
        return (
            <div className="p-6 max-w-6xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{subj?.icon}</span>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Cards: {subj?.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setViewMode('decks')}>Voltar</Button>
                        <Button onClick={() => openAddForm(selectedSubjectId)}>
                            <Plus size={16} className="mr-1" /> Novo Card
                        </Button>
                    </div>
                </div>

                {listCards.length > 0 ? (
                    <div className="space-y-2">
                        {listCards.map(card => (
                            <Card key={card.id} className="p-4 bg-white/70 group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 mb-1">{card.front}</p>
                                        <p className="text-sm text-slate-500">{card.back}</p>
                                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} /> Revisão: {card.nextReview}
                                            </span>
                                            <span>EF: {card.easeFactor.toFixed(1)}</span>
                                            <span>Rep: {card.repetition}×</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { if (window.confirm('Excluir este flashcard?')) deleteFlashcard(card.id); }}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center bg-white/50">
                        <p className="text-sm text-slate-400">Nenhum card nesta matéria.</p>
                    </Card>
                )}

                {showForm && (
                    <CardForm
                        subjectId={formSubjectId}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </div>
        );
    }

    // ─── Deck View (default) ─────────────────────────────────────────────────

    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <Layers size={24} className="text-pastel-lavender" />
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Flashcards
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                        Estude com repetição espaçada (SM-2) para memorização eficiente.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center">
                        <Layers size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{flashcards.length}</p>
                        <p className="text-xs text-slate-400">total de cards</p>
                    </div>
                </Card>
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${totalDue > 0 ? 'bg-pastel-coral/10 text-pastel-coral' : 'bg-pastel-mint/10 text-pastel-mint'}`}>
                        {totalDue > 0 ? <Clock size={18} /> : <Check size={18} />}
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{totalDue}</p>
                        <p className="text-xs text-slate-400">{totalDue > 0 ? 'cards para revisar hoje' : 'tudo em dia!'}</p>
                    </div>
                </Card>
                <Card className="flex-1 p-4 bg-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pastel-sky/10 text-pastel-sky flex items-center justify-center">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{deckStats.length}</p>
                        <p className="text-xs text-slate-400">deck{deckStats.length !== 1 ? 's' : ''} ativo{deckStats.length !== 1 ? 's' : ''}</p>
                    </div>
                </Card>
            </div>

            {/* Quick study all */}
            {totalDue > 0 && (
                <Card className="p-4 bg-gradient-to-r from-pastel-lavender/5 to-pastel-mint/5 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center">
                            <Brain size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">
                                Você tem {totalDue} card{totalDue !== 1 ? 's' : ''} para revisar
                            </p>
                            <p className="text-xs text-slate-400">Revise agora para manter sua streak de memorização!</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Decks grid */}
            {deckStats.length > 0 || subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map(subj => {
                        const cards = flashcards.filter(f => f.subjectId === subj.id);
                        const due = getDueCards(subj.id).length;
                        return (
                            <Card key={subj.id} className="p-0 overflow-hidden bg-white/70 hover:shadow-lg transition-all duration-300">
                                <div style={{ borderTop: `3px solid ${subj.color}` }}>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl">{subj.icon}</span>
                                                <h3 className="font-bold text-slate-800 text-sm">{subj.name}</h3>
                                            </div>
                                            <span className="text-xs text-slate-400 tabular-nums">{cards.length} cards</span>
                                        </div>

                                        {due > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs text-pastel-coral font-semibold mb-3">
                                                <Clock size={11} />
                                                {due} para revisar
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            {due > 0 && (
                                                <Button size="sm" onClick={() => startStudy(subj.id)} className="flex-1">
                                                    <Brain size={13} className="mr-1" /> Estudar
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" onClick={() => showList(subj.id)} className="flex-1">
                                                <BookOpen size={13} className="mr-1" /> Ver Cards
                                            </Button>
                                            <button
                                                onClick={() => openAddForm(subj.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-pastel-lavender hover:bg-pastel-lavender/10 transition-colors"
                                                title="Adicionar card"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="p-12 bg-white/50 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-pastel-lavender/10 text-pastel-lavender flex items-center justify-center mx-auto mb-4">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhum deck de flashcards</h3>
                    <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto">
                        Cadastre matérias primeiro para criar decks de flashcards organizados.
                    </p>
                    <Button onClick={() => window.location.href = '/subjects'}>
                        <ChevronRight size={16} className="mr-1" /> Ir para Matérias
                    </Button>
                </Card>
            )}

            {/* Card Form */}
            {showForm && (
                <CardForm
                    subjectId={formSubjectId}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default Flashcards;
