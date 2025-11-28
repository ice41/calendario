import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Users, Mail, Briefcase, Building2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { EmployeeForm } from './EmployeeForm';
import type { Employee } from '../types';

export function EmployeeList() {
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = async (data: Omit<Employee, 'id'>) => {
        await addEmployee({
            ...data,
            id: crypto.randomUUID(),
        });
    };

    const handleEdit = async (data: Omit<Employee, 'id'>) => {
        if (editingEmployee) {
            await updateEmployee({
                ...data,
                id: editingEmployee.id,
            });
            setEditingEmployee(undefined);
        }
    };

    const openEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja remover este funcionário?')) {
            deleteEmployee(id);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Funcionários</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Gerencie a equipa, cargos e departamentos.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingEmployee(undefined);
                        setIsFormOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium hover:translate-y-[-1px]"
                >
                    <Plus className="w-5 h-5" />
                    Novo Funcionário
                </button>
            </div>

            {/* Search and List Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou departamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-[40%]">Funcionário</th>
                                <th className="px-6 py-4 w-[20%]">Cargo</th>
                                <th className="px-6 py-4 w-[20%]">Departamento</th>
                                <th className="px-6 py-4 w-[20%] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-900 font-medium">Nenhum funcionário encontrado</p>
                                        <p className="text-slate-500 text-sm mt-1">Tente buscar por outro termo ou adicione um novo funcionário.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white"
                                                    style={{ backgroundColor: employee.color }}
                                                >
                                                    {employee.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{employee.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="text-xs">{employee.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Briefcase className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium">{employee.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    <Building2 className="w-3 h-3" />
                                                    {employee.department}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(employee)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EmployeeForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingEmployee(undefined);
                }}
                onSubmit={editingEmployee ? handleEdit : handleAdd}
                initialData={editingEmployee}
            />
        </div>
    );
}
