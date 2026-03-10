import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useApp } from '../store/AppContext';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

interface DepartmentManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DepartmentManager({ isOpen, onClose }: DepartmentManagerProps) {
    const { departments, addDepartment, deleteDepartment, employees } = useApp();
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDepartmentName.trim()) return;

        setIsSubmitting(true);
        try {
            await addDepartment({ name: newDepartmentName.trim() });
            setNewDepartmentName('');
        } catch (error) {
            alert('Erro ao criar departamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const isInUse = employees.some(e => e.department === name);
        if (isInUse) {
            alert('Não é possível apagar este departamento pois existem funcionários associados a ele. Altere o departamento dos funcionários primeiro.');
            return;
        }

        if (confirm(`Tem certeza que deseja apagar o departamento "${name}"?`)) {
            try {
                await deleteDepartment(id);
            } catch (error) {
                alert('Erro ao apagar departamento.');
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerir Departamentos">
            <div className="space-y-6">
                <form onSubmit={handleAddDepartment} className="flex gap-2">
                    <input
                        type="text"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        placeholder="Nome do novo Departamento..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newDepartmentName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar
                    </button>
                </form>

                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    {departments.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            Nenhum departamento personalizado criado.
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto">
                            {departments.map(dept => {
                                const count = employees.filter(e => e.department === dept.name).length;
                                return (
                                    <li key={dept.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="font-semibold text-slate-900">{dept.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {count} {count === 1 ? 'funcionário' : 'funcionários'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(dept.id, dept.name)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={count > 0 ? 'Não é possível apagar departamento em uso' : 'Apagar departamento'}
                                        >
                                            {count > 0 ? <ShieldAlert className="w-5 h-5 text-orange-400" /> : <Trash2 className="w-5 h-5" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
                    <strong>Nota:</strong> Os departamentos são geridos de forma independente para cada empresa.
                </div>
            </div>
        </Modal>
    );
}
