import { useState } from 'react';
import { Users, Calendar, Clock, CheckCircle, XCircle, Eye, Pencil, RotateCcw, ArrowUpRight, AlertCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal } from './ui/Modal';
import { VacationRequestForm } from './VacationRequestForm';
import type { VacationRequest } from '../types';

export function Dashboard({ onNavigate }: { onNavigate?: (tab: 'dashboard' | 'employees' | 'calendar') => void }) {
    const { employees, vacations, updateVacation } = useApp();
    const { user, isAdmin } = useAuth();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editingVacation, setEditingVacation] = useState<VacationRequest | undefined>(undefined);

    const pendingVacations = vacations.filter(v => v.status === 'Pending');

    // Filter pending vacations for employee view
    const myPendingVacations = isAdmin
        ? pendingVacations
        : pendingVacations.filter(v => v.employeeId === user?.employeeId);

    // Calculate employees on vacation today (unique employees)
    const today = new Date();
    const vacationsToday = vacations.filter(v => {
        if (v.status !== 'Approved') return false;
        const start = parseISO(v.startDate);
        const end = parseISO(v.endDate);
        return isWithinInterval(today, { start: startOfDay(start), end: endOfDay(end) });
    });

    // Count unique employees on vacation today
    const uniqueEmployeesOnVacation = new Set(vacationsToday.map(v => v.employeeId)).size;

    // Calculate vacation days for employee
    const myApprovedVacations = vacations.filter(v =>
        v.employeeId === user?.employeeId && v.status === 'Approved'
    );

    const calculateVacationDays = (vacation: VacationRequest) => {
        const start = parseISO(vacation.startDate);
        const end = parseISO(vacation.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        return diffDays;
    };

    const totalVacationDaysUsed = myApprovedVacations.reduce((total, v) =>
        total + calculateVacationDays(v), 0
    );

    const TOTAL_VACATION_DAYS = 23;
    const remainingVacationDays = TOTAL_VACATION_DAYS - totalVacationDaysUsed;

    const handleApprove = (id: string) => {
        const vacation = vacations.find(v => v.id === id);
        if (vacation) {
            updateVacation({ ...vacation, status: 'Approved' });
        }
    };

    const handleReject = (id: string) => {
        const vacation = vacations.find(v => v.id === id);
        if (vacation) {
            updateVacation({ ...vacation, status: 'Rejected' });
        }
    };

    const handleRevoke = (id: string) => {
        if (confirm('Tem certeza que deseja revogar estas férias aprovadas?')) {
            const vacation = vacations.find(v => v.id === id);
            if (vacation) {
                updateVacation({ ...vacation, status: 'Rejected' });
            }
        }
    };

    const handleEdit = (vacation: VacationRequest) => {
        setEditingVacation(vacation);
        setIsEditFormOpen(true);
    };

    const handleEditSubmit = (data: Omit<VacationRequest, 'id'>) => {
        if (editingVacation) {
            updateVacation({
                ...data,
                id: editingVacation.id,
            });
            setEditingVacation(undefined);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const StatCard = ({ title, value, icon: Icon, colorClass, subtext, action }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                {action && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {action}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</h3>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                {subtext && <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {getGreeting()}, <span className="text-blue-600">{user?.name.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Aqui está o resumo das atividades de hoje.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isAdmin ? (
                    <>
                        <StatCard
                            title="Total de Funcionários"
                            value={employees.length}
                            icon={Users}
                            colorClass="bg-blue-600 text-blue-600"
                        />
                        <StatCard
                            title="Solicitações Pendentes"
                            value={pendingVacations.length}
                            icon={Clock}
                            colorClass="bg-orange-500 text-orange-600"
                            subtext="Aguardando aprovação"
                        />
                        <StatCard
                            title="Em Férias Hoje"
                            value={uniqueEmployeesOnVacation}
                            icon={Calendar}
                            colorClass="bg-emerald-500 text-emerald-600"
                            action={uniqueEmployeesOnVacation > 0 && (
                                <button
                                    onClick={() => setIsDetailsOpen(true)}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                    title="Ver detalhes"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            )}
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Dias Utilizados"
                            value={totalVacationDaysUsed}
                            icon={CheckCircle}
                            colorClass="bg-blue-600 text-blue-600"
                            subtext={`de ${TOTAL_VACATION_DAYS} dias disponíveis`}
                        />
                        <StatCard
                            title="Dias Restantes"
                            value={remainingVacationDays}
                            icon={Clock}
                            colorClass={`
                                ${remainingVacationDays < 5 ? 'bg-red-500 text-red-600' :
                                    remainingVacationDays < 10 ? 'bg-orange-500 text-orange-600' :
                                        'bg-emerald-500 text-emerald-600'}
                            `}
                            subtext="Disponíveis para marcar"
                        />
                    </>
                )}
            </div>

            {/* Pending Vacations Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        {isAdmin ? 'Solicitações Pendentes' : 'Minhas Solicitações'}
                    </h3>
                    {myPendingVacations.length > 0 && (
                        <span className="px-3 py-1 bg-white text-orange-600 text-xs font-bold rounded-full border border-orange-100 shadow-sm">
                            {myPendingVacations.length}
                        </span>
                    )}
                </div>

                <div className="divide-y divide-slate-50">
                    {myPendingVacations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-900 font-medium">Tudo atualizado!</p>
                            <p className="text-slate-500 text-sm mt-1">Nenhuma solicitação pendente no momento.</p>
                        </div>
                    ) : (
                        myPendingVacations.map(vacation => {
                            const employee = employees.find(e => e.id === vacation.employeeId);
                            if (!employee) return null;

                            return (
                                <div key={vacation.id} className="group p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white"
                                            style={{ backgroundColor: employee.color }}
                                        >
                                            {employee.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{employee.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                                                    {format(parseISO(vacation.startDate), "d MMM", { locale: ptBR })} - {format(parseISO(vacation.endDate), "d MMM", { locale: ptBR })}
                                                </span>
                                                {vacation.notes && (
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Nota
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isAdmin ? (
                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(vacation)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                            <button
                                                onClick={() => handleApprove(vacation.id)}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                onClick={() => handleReject(vacation.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Rejeitar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-medium border border-orange-100">
                                            <Clock className="w-3 h-3" />
                                            Em Análise
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Approved Vacations Section (Admin Only) */}
            {isAdmin && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            Últimas Aprovações
                        </h3>
                        <button
                            onClick={() => onNavigate?.('calendar')}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                        >
                            Ver todas <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="p-6">
                        {vacations.filter(v => v.status === 'Approved').length === 0 ? (
                            <p className="text-slate-500 text-sm italic text-center py-4">Nenhuma férias aprovada recentemente.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vacations.filter(v => v.status === 'Approved').slice(0, 6).map(vacation => {
                                    const employee = employees.find(e => e.id === vacation.employeeId);
                                    if (!employee) return null;

                                    return (
                                        <div key={vacation.id} className="flex items-start justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                                        style={{ backgroundColor: employee.color }}
                                                    >
                                                        {employee.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900">{employee.name}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{employee.role}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                                    <p className="text-xs font-medium text-slate-600 flex items-center gap-2">
                                                        <Calendar className="w-3 h-3 text-slate-400" />
                                                        {format(parseISO(vacation.startDate), "d MMM", { locale: ptBR })} - {format(parseISO(vacation.endDate), "d MMM", { locale: ptBR })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(vacation)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleRevoke(vacation.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Revogar"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Who is on vacation today */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Funcionários em Férias Hoje"
            >
                <div className="space-y-3">
                    {vacationsToday.map(vacation => {
                        const employee = employees.find(e => e.id === vacation.employeeId);
                        if (!employee) return null;

                        return (
                            <div key={vacation.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-slate-50"
                                        style={{ backgroundColor: employee.color }}
                                    >
                                        {employee.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{employee.name}</p>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">{employee.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-medium mb-0.5">Retorna em</p>
                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        {format(parseISO(vacation.endDate), "d 'de' MMM", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>

            {/* Edit Vacation Form */}
            <VacationRequestForm
                isOpen={isEditFormOpen}
                onClose={() => {
                    setIsEditFormOpen(false);
                    setEditingVacation(undefined);
                }}
                onSubmit={handleEditSubmit}
                initialData={editingVacation}
            />
        </div>
    );
}
