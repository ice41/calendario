import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { LayoutDashboard, User, Lock, AlertCircle, ArrowRight, Loader2, HelpCircle, ShieldCheck, Users } from 'lucide-react';
import { HelpPage } from './HelpPage';

export function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setError('Credenciais inválidas. Verifique o email e o código.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar entrar.');
        } finally {
            setIsLoading(false);
        }
    };
    if (showHelp) {
        return <HelpPage onBack={() => setShowHelp(false)} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up mx-4">
                {/* Brand Header */}
                <div className="pt-10 pb-8 px-8 text-center border-b border-slate-50">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 mb-6">
                        <LayoutDashboard className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Gestão de Férias
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Aceda à sua conta corporativa
                    </p>
                </div>

                {/* Form Section */}
                <div className="p-8 pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="font-medium leading-relaxed">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Email Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 sm:text-sm font-medium"
                                        placeholder="nome@empresa.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Código de Acesso
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 sm:text-sm font-medium"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px]"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 text-blue-200 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-5 w-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
                                )}
                            </span>
                            {isLoading ? 'A verificar...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Quick Demo Access */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                            Acesso Rápido de Demonstração
                        </p>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => { setEmail('ice41'); setPassword('ice41'); }}
                                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4 text-purple-500" />
                                Entrar como Super Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('admin@demo.pt'); setPassword('123456'); }}
                                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                Entrar como Admin de Empresa
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('func@demo.pt'); setPassword('123456'); }}
                                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4 text-emerald-500" />
                                Entrar como Colaborador
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Utilize o seu código de funcionário como senha.
                    </p>
                </div>
            </div>
            {/* Help Button */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={() => setShowHelp(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-all backdrop-blur-sm border border-white/5 text-sm font-medium"
                >
                    <HelpCircle className="w-4 h-4" />
                    Como Funciona?
                </button>
            </div>

            {/* Copyright */}
            <div className="absolute bottom-6 text-slate-500 text-xs font-medium opacity-60">
                &copy; {new Date().getFullYear()} NPED. Todos os direitos reservados. Criado por <a href="https://ice41.pt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">ice41</a>
            </div>
        </div>
    );
}
