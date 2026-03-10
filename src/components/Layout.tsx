import React from 'react';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../store/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'employees' | 'calendar';
    onTabChange: (tab: 'dashboard' | 'employees' | 'calendar') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    const { user, logout, isAdmin } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Funcionários', icon: Users, hidden: !isAdmin },
        { id: 'calendar', label: 'Calendário', icon: Calendar },
    ].filter(item => !item.hidden);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Gestão de Férias
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                activeTab === item.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-100 font-bold uppercase">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">
                                {user?.role === 'admin' ? 'Administrador' : 'Funcionário'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
