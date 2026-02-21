import React from 'react';
import { BookOpen, Check, ArrowRight, Star } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    return (
        <div className="min-h-screen bg-pastel-cream overflow-x-hidden selection:bg-pastel-mint selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glassmorphism bg-white/40 border-b border-white/30 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-blush-mint flex items-center justify-center text-white shadow-sm">
                            <BookOpen size={24} strokeWidth={1.5} />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800">FocoPlan</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-pastel-coral transition-colors">Funcionalidades</a>
                        <a href="#how" className="hover:text-pastel-coral transition-colors">Como Funciona</a>
                        <a href="#pricing" className="hover:text-pastel-coral transition-colors">Preços</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden md:flex">Entrar</Button>
                        <Button>Começar Agora</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative">
                <div className="absolute inset-0 bg-gradient-blush-lavender opacity-30 -z-10 rounded-b-[100px]"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism text-sm font-medium text-pastel-coral mb-8">
                        <Star size={16} fill="currentColor" /> Nova abordagem para produtividade
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
                        Planeje seus estudos com <span className="text-gradient">calma e foco</span>.
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        O FocoPlan une gestão de tarefas, calendário e técnica Pomodoro em um ambiente visualmente tranquilo para maximizar seu rendimento sem causar estresse.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="text-lg px-8 h-14">
                            Experimente Grátis <ArrowRight className="ml-2" size={20} />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 h-14 bg-white/50 border-white/60">
                            Ver Demonstração
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">Sem necessidade de cartão de crédito. Foco total em privacidade.</p>
                </div>
            </section>

            {/* Mockup Preview Section */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-card p-2 md:p-4 rounded-[32px] shadow-2xl bg-white/40 ring-1 ring-white/50">
                        <div className="bg-slate-800 rounded-[24px] overflow-hidden aspect-[16/10] md:aspect-video relative shadow-inner">
                            <div className="absolute inset-0 flex items-center justify-center flex-col text-white/50 bg-slate-900">
                                <BookOpen size={64} className="mb-4 text-pastel-mint" />
                                <p className="text-xl font-medium">[Mockup do Dashboard do FocoPlan]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">Menos atrito, mais estudo.</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Tudo que você precisa em uma única tela, projetado para reduzir a carga cognitiva.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Gestão Descomplicada', desc: 'Organize tarefas por matéria, prioridade e prazos com uma interface limpa e intuitiva.', color: 'bg-pastel-blush' },
                            { title: 'Foco no Momento', desc: 'Timer Pomodoro integrado diretamente na sua lista de tarefas para facilitar o flow de estudo.', color: 'bg-pastel-mint' },
                            { title: 'Visão Semanal Clara', desc: 'Calendário visual em blocos (Timeblocking) para você saber exatamente o que fazer e quando.', color: 'bg-pastel-peach' }
                        ].map((feat, i) => (
                            <div key={i} className="glass-card hover:-translate-y-2 transition-transform duration-300">
                                <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center mb-6 shadow-sm`}>
                                    <Check className="text-white" size={28} strokeWidth={3} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/40 glassmorphism relative z-10">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© 2024 FocoPlan. Calm Productivity Tool. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
