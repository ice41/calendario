import { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
    isWithinInterval,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    differenceInDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Filter, Download, Printer } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { VacationRequestForm } from './VacationRequestForm';
import { cn } from '../lib/utils';
import type { VacationRequest, Role } from '../types';
import { isHoliday } from '../lib/holidays';

function getSmartInitials(name: string, allNames: string[]): string {
    const parts = name.trim().split(/\s+/);
    let initials = '';

    if (parts.length === 1) {
        initials = parts[0].substring(0, 2).toUpperCase();
    } else {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    const duplicates = allNames.filter(n => {
        const p = n.trim().split(/\s+/);
        let i = '';
        if (p.length === 1) i = p[0].substring(0, 2).toUpperCase();
        else i = (p[0][0] + p[p.length - 1][0]).toUpperCase();
        return i === initials;
    });

    if (duplicates.length > 1) {
        if (parts.length > 2) {
            initials = (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
        } else {
            initials = (parts[0].substring(0, 2) + parts[parts.length - 1][0]).toUpperCase();
        }
    }

    return initials;
}

export function CalendarView() {
    const { employees, vacations, addVacation, addMultipleVacations, updateVacation, removeDayFromVacation } = useApp();
    const { isAdmin } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVacation, setEditingVacation] = useState<VacationRequest | undefined>(undefined);
    const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
    const [filterEmployee, setFilterEmployee] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'Month' | 'Year'>('Month');

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startDay = monthStart.getDay();
    const paddingDays = Array.from({ length: startDay });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleSubmit = (data: Omit<VacationRequest, 'id'>) => {
        if (editingVacation) {
            updateVacation({
                ...data,
                id: editingVacation.id,
            });
        } else {
            const start = parseISO(data.startDate);
            const end = parseISO(data.endDate);
            const allDays = eachDayOfInterval({ start, end });

            const businessDays = allDays.filter(day => {
                const dayOfWeek = day.getDay();
                const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;
                const isHolidayDay = isHoliday(day);
                return !isWeekendDay && !isHolidayDay;
            });

            if (businessDays.length === 0) {
                alert('Não há dias úteis no período selecionado.');
                return;
            }

            const groups: Date[][] = [];
            let currentGroup: Date[] = [];

            businessDays.forEach((day, index) => {
                if (currentGroup.length === 0) {
                    currentGroup.push(day);
                } else {
                    const lastDay = currentGroup[currentGroup.length - 1];
                    const diffDays = differenceInDays(day, lastDay);

                    if (diffDays === 1) {
                        currentGroup.push(day);
                    } else {
                        groups.push(currentGroup);
                        currentGroup = [day];
                    }
                }

                if (index === businessDays.length - 1) {
                    groups.push(currentGroup);
                }
            });

            const newVacations = groups.map(group => ({
                id: crypto.randomUUID(),
                employeeId: data.employeeId,
                startDate: format(group[0], 'yyyy-MM-dd'),
                endDate: format(group[group.length - 1], 'yyyy-MM-dd'),
                status: data.status,
                notes: data.notes,
            }));

            addMultipleVacations(newVacations);
        }
        setEditingVacation(undefined);
    };

    const handleVacationClick = (vacation: VacationRequest) => {
        if (isAdmin) {
            setEditingVacation(vacation);
            setIsFormOpen(true);
        }
    };

    const handleDeleteVacation = (vacation: VacationRequest, day: Date, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAdmin) {
            const employee = employees.find(emp => emp.id === vacation.employeeId);
            const dayStr = format(day, "d 'de' MMMM", { locale: ptBR });
            if (confirm(`Tem certeza que deseja remover o dia ${dayStr} das férias de ${employee?.name}?`)) {
                removeDayFromVacation(vacation.id, day);
            }
        }
    };

    const filteredVacations = useMemo(() => {
        return vacations.filter(v => {
            const emp = employees.find(e => e.id === v.employeeId);
            if (!emp) return false;
            if (filterRole !== 'All' && emp.role !== filterRole) return false;
            if (filterEmployee !== 'All' && emp.id !== filterEmployee) return false;
            return true;
        });
    }, [vacations, employees, filterRole, filterEmployee]);

    const getVacationsForDay = (day: Date) => {
        return filteredVacations.filter(v => {
            const start = parseISO(v.startDate);
            const end = parseISO(v.endDate);
            return isWithinInterval(day, { start, end });
        });
    };

    const roles = Array.from(new Set(employees.map(e => e.role)));

    const employeesInView = useMemo(() => {
        const visibleVacations = filteredVacations.filter(v => {
            const start = parseISO(v.startDate);
            const end = parseISO(v.endDate);
            if (viewMode === 'Month') {
                return (start <= monthEnd && end >= monthStart);
            } else {
                const yearStart = startOfYear(currentDate);
                const yearEnd = endOfYear(currentDate);
                return (start <= yearEnd && end >= yearStart);
            }
        });

        const empIds = new Set(visibleVacations.map(v => v.employeeId));
        return employees.filter(e => empIds.has(e.id));
    }, [filteredVacations, monthStart, monthEnd, currentDate, viewMode, employees]);

    const handlePrint = () => {
        window.print();
    };

    if (viewMode === 'Year') {
        const months = eachMonthOfInterval({
            start: startOfYear(currentDate),
            end: endOfYear(currentDate)
        });

        return (
            <div className="space-y-6 print:space-y-4">
                <div className="flex items-center justify-between print:hidden">
                    <h2 className="text-2xl font-bold text-slate-900">Relatório Anual - {format(currentDate, 'yyyy')}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('Month')}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Voltar ao Mês
                        </button>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimir / PDF
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 hidden print:block">Relatório Anual - {format(currentDate, 'yyyy')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
                    {months.map(month => {
                        const mStart = startOfMonth(month);
                        const mEnd = endOfMonth(month);
                        const days = eachDayOfInterval({ start: mStart, end: mEnd });
                        const mStartDay = mStart.getDay();
                        const mPadding = Array.from({ length: mStartDay });

                        return (
                            <div key={month.toISOString()} className="bg-white rounded-lg border border-slate-200 p-4 break-inside-avoid">
                                <h3 className="text-center font-semibold mb-2 capitalize">
                                    {format(month, 'MMMM', { locale: ptBR })}
                                </h3>
                                <div className="grid grid-cols-7 text-xs gap-1">
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                        <div key={i} className="text-center text-slate-400">{d}</div>
                                    ))}
                                    {mPadding.map((_, i) => <div key={`p-${i}`} />)}
                                    {days.map(day => {
                                        const dayVacs = getVacationsForDay(day);
                                        const hasVacation = dayVacs.length > 0;
                                        const holiday = isHoliday(day);

                                        return (
                                            <div
                                                key={day.toISOString()}
                                                className={cn(
                                                    "aspect-square relative border border-transparent hover:border-slate-200 rounded-md transition-colors",
                                                    hasVacation ? "bg-blue-50" : holiday ? "bg-red-50/50" : "bg-transparent"
                                                )}
                                                title={holiday?.name}
                                            >
                                                <span className={cn(
                                                    "absolute top-0.5 left-1 text-[10px]",
                                                    hasVacation ? "font-bold text-blue-700" : holiday ? "text-red-500 font-medium" : "text-slate-500"
                                                )}>
                                                    {format(day, 'd')}
                                                </span>

                                                {hasVacation && (
                                                    <div className="absolute inset-0 flex items-center justify-center pt-3">
                                                        <div className="flex flex-wrap justify-center gap-0.5 px-0.5">
                                                            {dayVacs.map(v => {
                                                                const emp = employees.find(e => e.id === v.employeeId);
                                                                if (!emp) return null;
                                                                const initials = getSmartInitials(emp.name, employees.map(e => e.name));
                                                                return (
                                                                    <span
                                                                        key={v.id}
                                                                        className="text-[8px] font-bold px-0.5 rounded text-white leading-tight"
                                                                        style={{ backgroundColor: emp.color }}
                                                                    >
                                                                        {initials}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 break-inside-avoid">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Legenda (Funcionários com férias neste ano)</h3>
                    <div className="flex flex-wrap gap-4">
                        {employeesInView.map(emp => (
                            <div key={emp.id} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: emp.color }}
                                />
                                <span className="text-sm text-slate-600">{emp.name} ({emp.role})</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" />
                            <span className="text-sm text-slate-600">Feriados</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <h2 className="text-2xl font-bold text-slate-900">Calendário de Férias</h2>
                <div className="flex gap-2">
                    {isAdmin && (
                        <button
                            onClick={() => setViewMode('Year')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
                        >
                            <Download className="w-5 h-5" />
                            Relatório Anual
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingVacation(undefined);
                            setIsFormOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Marcar Férias
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 hidden print:block">Calendário de Férias</h2>

            {isAdmin && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center print:hidden">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filtrar por:</span>
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as Role | 'All')}
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="All">Todos os Cargos</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>

                    <select
                        value={filterEmployee}
                        onChange={(e) => setFilterEmployee(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="All">Todos os Funcionários</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h3>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="aspect-square" />
                        ))}

                        {daysInMonth.map((day) => {
                            const dayVacations = getVacationsForDay(day);
                            const isToday = isSameDay(day, new Date());
                            const holiday = isHoliday(day);
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={cn(
                                        "min-h-[120px] p-2 border-b border-r border-slate-100 transition-colors hover:bg-slate-50",
                                        isToday && "bg-blue-50/30",
                                        holiday && "bg-red-50/50",
                                        !holiday && isWeekend && "bg-blue-50/50"
                                    )}
                                    title={holiday?.name}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                            isToday ? "bg-primary text-white" : holiday ? "text-red-600" : "text-slate-700"
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                        {holiday && (
                                            <span className="text-[10px] font-medium text-red-500 truncate max-w-[80px]" title={holiday.name}>
                                                {holiday.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        {dayVacations.map(vacation => {
                                            const employee = employees.find(e => e.id === vacation.employeeId);
                                            if (!employee) return null;

                                            const initials = getSmartInitials(employee.name, employees.map(e => e.name));

                                            return (
                                                <div
                                                    key={vacation.id}
                                                    onClick={() => handleVacationClick(vacation)}
                                                    className={cn(
                                                        "text-xs px-2 py-1 rounded-md truncate text-white shadow-sm font-medium flex items-center justify-between group",
                                                        isAdmin && "cursor-pointer hover:opacity-80 transition-opacity"
                                                    )}
                                                    style={{ backgroundColor: employee.color }}
                                                    title={isAdmin ? `${employee.name} (${vacation.status}) - Clique para editar` : `${employee.name} (${vacation.status})`}
                                                >
                                                    <span>{initials}</span>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={(e) => handleDeleteVacation(vacation, day, e)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:scale-110"
                                                            title="Remover este dia"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Legenda</h4>
                    <div className="flex flex-wrap gap-4">
                        {employeesInView.map(emp => (
                            <div key={emp.id} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: emp.color }}
                                />
                                <span className="text-xs text-slate-600">{emp.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <VacationRequestForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingVacation(undefined);
                }}
                onSubmit={handleSubmit}
                initialData={editingVacation}
            />
        </div>
    );
}
