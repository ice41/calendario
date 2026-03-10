import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useApp } from '../store/AppContext';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

interface RoleManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RoleManager({ isOpen, onClose }: RoleManagerProps) {
    const { roles, addRole, deleteRole, employees } = useApp();
    const [newRoleName, setNewRoleName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;

        setIsSubmitting(true);
        try {
            await addRole({ name: newRoleName.trim() });
            setNewRoleName('');
        } catch (error) {
            alert('Erro ao criar cargo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const isInUse = employees.some(e => e.role === name);
        if (isInUse) {
            alert('Não é possível apagar este cargo pois existem funcionários associados a ele. Altere o cargo dos funcionários primeiro.');
            return;
        }

        if (confirm(`Tem certeza que deseja apagar o cargo "${name}"?`)) {
            try {
                await deleteRole(id);
            } catch (error) {
                alert('Erro ao apagar cargo.');
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerir Cargos (Setores)">
            <div className="space-y-6">
                {/* Form to add new role */}
                <form onSubmit={handleAddRole} className="flex gap-2">
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Nome do novo Cargo..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newRoleName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar
                    </button>
                </form>

                {/* List of roles */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    {roles.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            Nenhum cargo personalizado criado.
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto">
                            {roles.map(role => {
                                const count = employees.filter(e => e.role === role.name).length;
                                return (
                                    <li key={role.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="font-semibold text-slate-900">{role.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {count} {count === 1 ? 'funcionário' : 'funcionários'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(role.id, role.name)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={count > 0 ? 'Não é possível apagar cargo em uso' : 'Apagar cargo'}
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
                    <strong>Nota:</strong> Os cargos são geridos de forma independente para cada empresa.
                </div>
            </div>
        </Modal>
    );
}
