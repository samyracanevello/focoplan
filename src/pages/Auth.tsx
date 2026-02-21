import React from 'react';
import { BookOpen, User, Lock, Mail, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Auth = () => {
    return (
        <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pastel-blush/40 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pastel-mint/30 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center z-10">
                {/* Left Side: Illustration / Brand */}
                <div className="flex-1 text-center md:text-left hidden md:block pl-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-blush-mint flex items-center justify-center text-white shadow-lg mb-8">
                        <BookOpen size={36} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                        Seu espaço de estudo, <br /><span className="text-gradient">livre de distrações.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-md">
                        Crie sua conta no FocoPlan e comece a organizar sua rotina acadêmica com o design mais focado do mercado.
                    </p>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full max-w-md">
                    <Card className="p-8 md:p-10 shadow-xl bg-white/70 border-white/60">
                        <div className="text-center mb-8 md:hidden">
                            <div className="w-12 h-12 rounded-xl bg-gradient-blush-mint flex items-center justify-center text-white shadow-sm mx-auto mb-4">
                                <BookOpen size={28} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Bem-vindo ao FocoPlan</h2>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mb-6 hidden md:block">Entrar / Criar Conta</h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="block w-full pl-11 pr-3 py-3 border border-white/60 rounded-[14px] leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-peach focus:bg-white/90 transition-all duration-300 text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Senha</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-11 pr-3 py-3 border border-white/60 rounded-[14px] leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-peach focus:bg-white/90 transition-all duration-300 text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-pastel-coral focus:ring-pastel-coral" />
                                    <span className="text-slate-600">Lembrar de mim</span>
                                </label>
                                <a href="#" className="font-medium text-pastel-coral hover:text-red-400 transition-colors">Esqueceu a senha?</a>
                            </div>
                        </div>

                        <Button fullWidth size="lg" className="mb-4">Entrar na Conta</Button>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OU</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <Button variant="outline" fullWidth size="lg" className="bg-white/50 border-white/80 group">
                            Continuar sem conta (Local) <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <p className="text-center text-xs text-slate-500 mt-4">
                            Modo focado em privacidade. Seus dados ficam no seu navegador.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Auth;
