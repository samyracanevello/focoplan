import { BookOpen, Check, ArrowRight, Star, Timer, Brain, Target, BarChart3, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6 },
};

const stagger = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

const features = [
    {
        icon: <Check size={24} strokeWidth={2.5} />,
        title: 'Gestão de Tarefas',
        desc: 'Organize por matéria, prioridade e prazo. Marque como concluído com um clique.',
        color: 'bg-pastel-mint',
    },
    {
        icon: <Timer size={24} strokeWidth={2.5} />,
        title: 'Pomodoro Integrado',
        desc: 'Timer inteligente acoplado às suas tarefas. Foque no que importa, descanse quando preciso.',
        color: 'bg-pastel-coral',
    },
    {
        icon: <Brain size={24} strokeWidth={2.5} />,
        title: 'Flashcards com Repetição Espaçada',
        desc: 'Algoritmo de memorização que revisa na hora certa, sem desperdício de tempo.',
        color: 'bg-pastel-lavender',
    },
    {
        icon: <Target size={24} strokeWidth={2.5} />,
        title: 'Metas de Estudo',
        desc: 'Defina objetivos semanais e mensais. Acompanhe seu progresso real com barras visuais.',
        color: 'bg-pastel-peach',
    },
    {
        icon: <BarChart3 size={24} strokeWidth={2.5} />,
        title: 'Analytics por Matéria',
        desc: 'Veja onde você está investindo seu tempo. Gráficos de produtividade por disciplina.',
        color: 'bg-pastel-blush',
    },
    {
        icon: <Shield size={24} strokeWidth={2.5} />,
        title: 'Dados na Nuvem',
        desc: 'Sincronização segura via Supabase. Seus dados sempre acessíveis, em qualquer dispositivo.',
        color: 'bg-pastel-amber',
    },
];

const steps = [
    { num: '01', title: 'Crie sua conta grátis', desc: 'Em segundos, sem cartão de crédito. Use seu e-mail ou acesse localmente.' },
    { num: '02', title: 'Adicione suas matérias', desc: 'Organize suas disciplinas com ícone e cores. O FocoPlan se adapta ao seu curso.' },
    { num: '03', title: 'Estude com foco', desc: 'Use o Pomodoro, crie flashcards e acompanhe seu progresso dia após dia.' },
];

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-pastel-cream overflow-x-hidden selection:bg-pastel-mint selection:text-white">

            {/* ─── Navbar ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-blush-mint flex items-center justify-center text-white shadow-sm">
                            <BookOpen size={20} strokeWidth={1.5} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">FocoPlan</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                        <a href="#features" className="hover:text-slate-800 transition-colors">Funcionalidades</a>
                        <a href="#how" className="hover:text-slate-800 transition-colors">Como Funciona</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Entrar</Button>
                        <Button size="sm" onClick={() => navigate('/auth')}>Começar Grátis</Button>
                    </div>
                </div>
            </nav>

            {/* ─── Hero ────────────────────────────────────────────────── */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pastel-blush/30 via-pastel-lavender/20 to-pastel-mint/30 -z-10" />
                <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full bg-pastel-mint/20 blur-3xl -z-10" />
                <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-pastel-blush/20 blur-3xl -z-10" />

                <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 text-sm font-medium text-pastel-coral mb-8 shadow-sm">
                        <Zap size={14} fill="currentColor" /> Produtividade Calma para Estudantes
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight leading-[1.1]">
                        Planeje seus estudos com{' '}
                        <span className="text-gradient">
                            calma e foco
                        </span>.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        O FocoPlan une tarefas, Pomodoro, flashcards e analytics em uma interface bonita e sem atrito — para você estudar melhor, não mais.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="text-lg px-8 h-14 shadow-lg shadow-pastel-mint/30" onClick={() => navigate('/auth')}>
                            Começar Grátis <ArrowRight className="ml-2" size={20} />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 h-14 bg-white/50 border-white/60" onClick={() => {
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Ver Funcionalidades
                        </Button>
                    </div>
                    <p className="mt-5 text-sm text-slate-400">Sem cartão de crédito • 100% grátis • Seus dados protegidos</p>
                </motion.div>
            </section>

            {/* ─── Dashboard Preview ──────────────────────────────────── */}
            <motion.section {...fadeUp} className="pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="p-2 md:p-3 rounded-[28px] bg-white/50 border border-white/40 shadow-2xl shadow-slate-200/50 backdrop-blur-sm">
                        <div className="rounded-[20px] overflow-hidden aspect-[16/10] relative bg-slate-100 flex items-center justify-center">
                            <img 
                                src="/dashboard-app.png" 
                                alt="Dashboard do FocoPlan" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ─── Features Grid ──────────────────────────────────────── */}
            <section id="features" className="py-24 px-6 bg-white/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
                            Tudo que você precisa,{' '}
                            <span className="text-gradient">
                                nada que não precisa
                            </span>.
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Projetado para reduzir a carga cognitiva. Sem distrações, sem complexidade desnecessária.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, i) => (
                            <motion.div
                                key={i}
                                {...stagger}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-5 text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                    {feat.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ───────────────────────────────────────── */}
            <section id="how" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
                            Comece em <span className="text-pastel-coral">3 passos</span>.
                        </h2>
                    </motion.div>

                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                {...stagger}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="flex items-start gap-6 p-6 rounded-2xl bg-white/50 border border-white/40 backdrop-blur-sm"
                            >
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-blush-mint flex items-center justify-center text-white font-black text-lg shadow-sm">
                                    {step.num}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Final ──────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-br from-pastel-mint/30 via-pastel-lavender/20 to-pastel-blush/30 border border-white/40 backdrop-blur-sm">
                        <Star size={40} className="text-pastel-amber mx-auto mb-6" fill="currentColor" />
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
                            Pronto para estudar com mais foco e menos estresse?
                        </h2>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                            Junte-se a estudantes que estão transformando sua rotina de estudos com o FocoPlan.
                        </p>
                        <Button size="lg" className="text-lg px-10 h-14 shadow-lg shadow-pastel-mint/30" onClick={() => navigate('/auth')}>
                            Criar Conta Grátis <ArrowRight className="ml-2" size={20} />
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* ─── Footer ─────────────────────────────────────────────── */}
            <footer className="py-10 border-t border-slate-200/40 bg-white/30">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-blush-mint flex items-center justify-center text-white">
                            <BookOpen size={14} />
                        </div>
                        <span className="font-semibold text-slate-600">FocoPlan</span>
                    </div>
                    <p>© {new Date().getFullYear()} FocoPlan. Feito com 💚 para estudantes.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
