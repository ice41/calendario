import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import * as api from '../lib/api';
import type { Company } from '../types';

export function SuperAdminDashboard() {
    const { logout } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [newCompName, setNewCompName] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminCode, setAdminCode] = useState('');

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setIsLoading(true);
            const data = await api.fetchCompanies();
            setCompanies(data);
        } catch (err) {
            setError('Falha ao carregar empresas.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create company
            const newCompany = await api.createCompany({ name: newCompName });
            const companyId = newCompany.id;

            // 2. Create the first admin for this company
            // To do this, we need to temporarily trick the API call by passing the new companyId 
            // since the superadmin doesn't have a default companyId.
            // But api.ts gets 'X-Company-Id' from localStorage's 'auth_user'.
            // For a superadmin, creating an employee requires sending the companyId explicitly.
            await fetch('api.php?r=employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Company-Id': companyId
                },
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    companyId: companyId,
                    name: adminName,
                    email: adminEmail,
                    role: 'Diretor',
                    department: 'Direção',
                    color: '#3b82f6',
                    employeeCode: adminCode,
                    isAdmin: true
                })
            });

            await loadCompanies();
            setNewCompName('');
            setAdminName('');
            setAdminEmail('');
            setAdminCode('');
        } catch (err) {
            alert('Falha ao criar empresa. Tente novamente.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('ATENÇÃO! Isto irá apagar TODOS os funcionários e férias desta empresa permanentemente. Continuar?')) {
            try {
                await api.deleteCompany(id);
                setCompanies(companies.filter(c => c.id !== id));
            } catch (err) {
                alert('Falha ao remover empresa.');
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center font-medium">Carregando painel Mestre...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
                            <AlertTriangle className="w-6 h-6" />
                            Painel de Controlo Master
                        </h1>
                        <p className="text-slate-500 mt-1">Gestão global de Clientes (Empresas)</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                    >
                        Terminar Sessão
                    </button>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-200">{error}</div>}

                {/* Create Company Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Criar Nova Empresa
                        </h2>
                    </div>

                    <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                            <input type="text" required value={newCompName} onChange={e => setNewCompName(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="EX:Nome da Empresa" />
                        </div>

                        <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-200">
                            <h3 className="text-sm font-bold text-slate-600 mb-4 tracking-wider uppercase">Dados do 1º Administrador dessa empresa</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nome do Gestor</label>
                            <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Ex: Carlos Silva" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email (Login)</label>
                            <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Ex: gerencia@lusocargo.pt" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Senha de Acesso (Employee Code)</label>
                            <input type="text" required value={adminCode} onChange={e => setAdminCode(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Ex: Admin123!" />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm">
                                Criar Empresa e Conta Admin
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Companies */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-slate-500" />
                            Empresas Ativas no Sistema
                        </h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {companies.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 font-medium">Nenhuma empresa criada...</div>
                        ) : (
                            companies.map(c => (
                                <div key={c.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                                        <p className="text-sm text-slate-500 font-mono mt-1">ID: {c.id}</p>
                                        <p className="text-sm font-medium text-blue-600 mt-2">
                                            {c.employeeCount !== undefined ? c.employeeCount : 0} Funcionários • {c.vacationCount !== undefined ? c.vacationCount : 0} Férias Marcadas
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Apagar empresa inteira (Perigo!)"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
