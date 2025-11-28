import React, { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Modal } from './ui/Modal';
import { isHoliday } from '../lib/holidays';
import type { VacationRequest, VacationStatus } from '../types';

interface VacationRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: Omit<VacationRequest, 'id'>) => void;
    initialData?: VacationRequest;
}

export function VacationRequestForm({ isOpen, onClose, onSubmit, initialData }: VacationRequestFormProps) {
    const { employees, vacations } = useApp();
    const { user, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        employeeId: initialData?.employeeId || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        notes: initialData?.notes || '',
    });

    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                employeeId: initialData.employeeId,
                startDate: initialData.startDate,
                endDate: initialData.endDate,
                notes: initialData.notes || '',
            });
        } else {
            // For non-admin users, auto-select their own employee ID
            const defaultEmployeeId = !isAdmin && user?.employeeId ? user.employeeId : '';
            setFormData({
                employeeId: defaultEmployeeId,
                startDate: '',
                endDate: '',
                notes: '',
            });
        }
    }, [initialData, isAdmin, user]);

    const selectedEmployee = employees.find(e => e.id === formData.employeeId);

    // Check for overlaps and calculate business days
    const getOverlaps = () => {
        if (!formData.startDate || !formData.endDate || !selectedEmployee) return { overlaps: [], excludedDays: 0, totalDays: 0 };

        const start = parseISO(formData.startDate);
        const end = parseISO(formData.endDate);

        // Check for weekends and holidays
        const days = eachDayOfInterval({ start, end });
        const totalDays = days.length;

        const excludedDays = days.filter(day => {
            const dayOfWeek = day.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isHolidayDay = isHoliday(day);
            return isWeekend || isHolidayDay;
        }).length;

        const overlaps = vacations.filter(v => {
            if (v.id === initialData?.id) return false; // Ignore self when editing
            if (v.status === 'Rejected') return false;

            const vStart = parseISO(v.startDate);
            const vEnd = parseISO(v.endDate);

            // Check if ranges overlap
            const overlap = (start <= vEnd && end >= vStart);

            if (!overlap) return false;

            // Check if same role (for warning)
            const employee = employees.find(e => e.id === v.employeeId);
            return employee?.role === selectedEmployee.role;
        });

        return { overlaps, excludedDays, totalDays };
    };

    const { overlaps, excludedDays, totalDays } = getOverlaps();
    const businessDays = totalDays - excludedDays;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            ...formData,
            status: (initialData?.status || 'Pending') as VacationStatus,
        });
        onClose();
        if (!initialData) {
            setFormData({ employeeId: '', startDate: '', endDate: '', notes: '' });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Férias' : 'Marcar Férias'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Funcionário</label>
                    {initialData || !isAdmin ? (
                        <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-medium">
                            {employees.find(e => e.id === formData.employeeId)?.name || 'Funcionário não encontrado'}
                        </div>
                    ) : (
                        <select
                            required
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="">Selecione um funcionário</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name} ({employee.role})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                        <input
                            type="date"
                            required
                            value={formData.endDate}
                            min={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {excludedDays > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-blue-700 text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Informação sobre o período selecionado:</p>
                            <p className="mt-1">
                                De {totalDays} {totalDays === 1 ? 'dia' : 'dias'} selecionados, <strong>{businessDays} {businessDays === 1 ? 'dia útil será marcado' : 'dias úteis serão marcados'}</strong> como férias.
                            </p>
                            <p className="text-xs mt-1 text-blue-600">
                                {excludedDays} {excludedDays === 1 ? 'dia' : 'dias'} (fins de semana e feriados) serão automaticamente excluídos.
                            </p>
                        </div>
                    </div>
                )}

                {overlaps.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2 text-amber-800">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium">Atenção: Sobreposição detectada</p>
                                <p className="mt-1 text-amber-700">
                                    Existem {overlaps.length} funcionário(s) do mesmo cargo com férias neste período:
                                </p>
                                <ul className="mt-1 list-disc list-inside">
                                    {overlaps.map(v => {
                                        const emp = employees.find(e => e.id === v.employeeId);
                                        return (
                                            <li key={v.id}>
                                                {emp?.name} ({format(parseISO(v.startDate), 'dd/MM')} - {format(parseISO(v.endDate), 'dd/MM')})
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                    <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Opcional..."
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                    >
                        {initialData ? 'Salvar Alterações' : 'Marcar Férias'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
