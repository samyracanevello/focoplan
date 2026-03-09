import { useState, type FormEvent } from 'react';
import { BookOpen, User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

type AuthMode = 'login' | 'signup' | 'local';

const Auth = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localName, setLocalName] = useState('');
    const [name, setNameInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { loginLocal, loginSupabase, signupSupabase } = useUserStore();

    const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL);

    const handleSupabaseLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        setError(''); setLoading(true);

        const result = await loginSupabase(email, password);
        setLoading(false);
        if (result.error) {
            setError(result.error === 'Invalid login credentials'
                ? 'Email ou senha incorretos.'
                : result.error
            );
        } else {
            navigate('/dashboard');
        }
    };

    const handleSupabaseSignup = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !name.trim()) return;
        if (password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }
        setError(''); setLoading(true);

        const result = await signupSupabase(email, password, name);
        setLoading(false);
        if (result.error) {
            setError(result.error.includes('already registered')
                ? 'Este email já está cadastrado. Tente fazer login.'
                : result.error
            );
        } else {
            navigate('/dashboard');
        }
    };

    const handleLocalLogin = (e: FormEvent) => {
        e.preventDefault();
        if (localName.trim() === '') return;
        loginLocal(localName);
        navigate('/dashboard');
    };

    const inputClass = "block w-full pl-11 pr-3 py-3 border border-white/60 rounded-[14px] leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-peach focus:bg-white/90 transition-all duration-300 text-slate-700 shadow-sm";

    return (
        <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pastel-blush/40 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pastel-mint/30 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center z-10">
                {/* Left Side: Brand */}
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

                        <h2 className="text-2xl font-bold text-slate-800 mb-6 hidden md:block">
                            {mode === 'login' && 'Entrar'}
                            {mode === 'signup' && 'Criar Conta'}
                            {mode === 'local' && 'Acesso Local'}
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* ─── Local Mode ─── */}
                        {mode === 'local' && (
                            <form onSubmit={handleLocalLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Como devemos te chamar?</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="text" placeholder="Seu nome ou apelido" value={localName}
                                            onChange={(e) => setLocalName(e.target.value)} required autoFocus className={inputClass} />
                                    </div>
                                </div>
                                <Button type="submit" fullWidth size="lg">Acessar FocoPlan <ArrowRight size={18} className="ml-2" /></Button>
                                {hasSupabase && (
                                    <button type="button" onClick={() => { setMode('login'); setError(''); }}
                                        className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                        Entrar com email
                                    </button>
                                )}
                            </form>
                        )}

                        {/* ─── Login Mode ─── */}
                        {mode === 'login' && hasSupabase && (
                            <form onSubmit={handleSupabaseLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="email" placeholder="seu@email.com" value={email}
                                            onChange={e => setEmail(e.target.value)} required autoFocus className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="password" placeholder="••••••••" value={password}
                                            onChange={e => setPassword(e.target.value)} required className={inputClass} />
                                    </div>
                                </div>

                                <Button type="submit" fullWidth size="lg" disabled={loading}>
                                    {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Entrando...</> : <>Entrar <ArrowRight size={18} className="ml-2" /></>}
                                </Button>

                                <p className="text-center text-sm text-slate-500">
                                    Não tem conta?{' '}
                                    <button type="button" onClick={() => { setMode('signup'); setError(''); }}
                                        className="font-semibold text-pastel-coral hover:underline">Criar conta</button>
                                </p>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">ou</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                <Button variant="outline" fullWidth size="lg" onClick={() => { setMode('local'); setError(''); }}
                                    className="bg-white/50 border-white/80 text-slate-600 hover:bg-slate-50">
                                    Continuar sem conta
                                </Button>
                            </form>
                        )}

                        {/* ─── Signup Mode ─── */}
                        {mode === 'signup' && hasSupabase && (
                            <form onSubmit={handleSupabaseSignup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Nome</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="text" placeholder="Seu nome" value={name}
                                            onChange={e => setNameInput(e.target.value)} required autoFocus className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="email" placeholder="seu@email.com" value={email}
                                            onChange={e => setEmail(e.target.value)} required className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Senha (min. 6 caracteres)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <input type="password" placeholder="••••••••" value={password}
                                            onChange={e => setPassword(e.target.value)} required minLength={6} className={inputClass} />
                                    </div>
                                </div>

                                <Button type="submit" fullWidth size="lg" disabled={loading}>
                                    {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Criando...</> : <>Criar Conta <ArrowRight size={18} className="ml-2" /></>}
                                </Button>

                                <p className="text-center text-sm text-slate-500">
                                    Já tem conta?{' '}
                                    <button type="button" onClick={() => { setMode('login'); setError(''); }}
                                        className="font-semibold text-pastel-coral hover:underline">Entrar</button>
                                </p>
                            </form>
                        )}

                        {/* Fallback when Supabase not configured */}
                        {!hasSupabase && mode !== 'local' && (
                            <>
                                <div className="space-y-4 mb-6 opacity-50 pointer-events-none">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                                            </div>
                                            <input type="email" placeholder="Configure o Supabase para habilitar..." disabled className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                                <Button fullWidth size="lg" className="mb-4 opacity-50 cursor-not-allowed" disabled>
                                    Login com email (Supabase não configurado)
                                </Button>
                                <div className="relative flex items-center py-4">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OU</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>
                                <Button variant="outline" fullWidth size="lg"
                                    className="bg-white/50 border-white/80 group text-pastel-coral hover:bg-pastel-coral hover:text-white hover:border-pastel-coral"
                                    onClick={() => setMode('local')}>
                                    Continuar Localmente <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                                    Modo focado em privacidade. Sem necessidade de conta. Seus dados ficam salvos apenas neste navegador.
                                </p>
                            </>
                        )}

                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Auth;
