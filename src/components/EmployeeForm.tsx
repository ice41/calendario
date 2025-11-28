import React, { useState, useEffect } from 'react';
import type { Employee, Role } from '../types';
import { Modal } from './ui/Modal';
import { cn } from '../lib/utils';
import { useApp } from '../store/AppContext';

interface EmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (employee: Omit<Employee, 'id'>) => Promise<void>;
    initialData?: Employee;
}

const ROLES: Role[] = [
    'Departamento Financeiro',
    'Importação',
    'Exportação',
    'Departamento Aereo',
    'Departamento Maritimo',
    'Armazém',
    'Departamento Nacional',
    'Motoristas',
    'Outro'
];

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e',
    '#b91c1c', '#c2410c', '#b45309', '#4d7c0f', '#15803d', '#0e7490', '#1d4ed8', '#4338ca', '#6d28d9', '#be185d', '#be123c',
    '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a',
    '#78716c', '#57534e', '#44403c', '#292524', '#1c1917',
    '#000000'
];

export function EmployeeForm({ isOpen, onClose, onSubmit, initialData }: EmployeeFormProps) {
    const { employees } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Motoristas' as Role,
        department: '',
        color: COLORS[0],
        employeeCode: '',
        isAdmin: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
                department: initialData.department,
                color: initialData.color,
                employeeCode: initialData.employeeCode || '',
                isAdmin: initialData.isAdmin || false,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Motoristas',
                department: '',
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                employeeCode: '',
                isAdmin: false,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Erro ao salvar funcionário. Verifique o console para mais detalhes.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Funcionário' : 'Novo Funcionário'}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="employee-form"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            initialData ? 'Salvar Alterações' : 'Adicionar Funcionário'
                        )}
                    </button>
                </>
            }
        >
            <form id="employee-form" onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="João Silva"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="joao@empresa.com"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            disabled={isSubmitting}
                        >
                            {ROLES.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                        <input
                            type="text"
                            required
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Engenharia"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Código de Funcionário (Senha)</label>
                    <input
                        type="text"
                        required
                        value={formData.employeeCode}
                        onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                        placeholder="EMP001"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isAdmin"
                        checked={formData.isAdmin}
                        onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                        className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                        disabled={isSubmitting}
                    />
                    <label htmlFor="isAdmin" className="text-sm font-medium text-slate-700">
                        Conceder acesso de Administrador
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cor de Identificação</label>
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => {
                            const isUsed = employees.some(e =>
                                e.role === formData.role &&
                                e.color === color &&
                                e.id !== initialData?.id
                            );

                            return (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={cn(
                                        "w-8 h-8 rounded-full transition-transform focus:outline-none ring-2 ring-offset-2 relative",
                                        formData.color === color ? "ring-slate-400 scale-110" : "ring-transparent hover:scale-110",
                                        isUsed && formData.color !== color && "opacity-30 cursor-not-allowed"
                                    )}
                                    style={{ backgroundColor: color }}
                                    disabled={(isUsed && formData.color !== color) || isSubmitting}
                                    title={isUsed ? "Cor já usada neste cargo" : undefined}
                                >
                                    {isUsed && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-1 h-full bg-white/50 rotate-45" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
