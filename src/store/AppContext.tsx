import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import type { Employee, VacationRequest, CustomRole, Department } from '../types';
import { format, parseISO, addDays, subDays, differenceInDays } from 'date-fns';
import * as api from '../lib/api';

interface AppContextType {
    employees: Employee[];
    vacations: VacationRequest[];
    isLoading: boolean;
    error: string | null;
    addEmployee: (employee: Employee) => Promise<void>;
    updateEmployee: (employee: Employee) => Promise<void>;
    deleteEmployee: (id: string) => Promise<void>;
    addVacation: (vacation: VacationRequest) => Promise<void>;
    addMultipleVacations: (vacations: VacationRequest[]) => Promise<void>;
    updateVacation: (vacation: VacationRequest) => Promise<void>;
    deleteVacation: (id: string) => Promise<void>;
    removeDayFromVacation: (vacationId: string, dayToRemove: Date) => Promise<void>;
    roles: CustomRole[];
    departments: Department[];
    addRole: (role: Omit<CustomRole, 'id' | 'companyId'>) => Promise<void>;
    deleteRole: (id: string) => Promise<void>;
    addDepartment: (department: Omit<Department, 'id' | 'companyId'>) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const [roles, setRoles] = useState<CustomRole[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [employeesData, vacationsData, rolesData, deptsData] = await Promise.all([
                    api.fetchEmployees(),
                    api.fetchVacations(),
                    api.fetchRoles(),
                    api.fetchDepartments()
                ]);
                setEmployees(employeesData);
                setVacations(vacationsData);
                setRoles(rolesData);
                setDepartments(deptsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data from server');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const addRole = async (role: Omit<CustomRole, 'id' | 'companyId'>) => {
        try {
            const newRole = await api.createRole(role as Omit<CustomRole, 'id'>);
            setRoles((prev) => [...prev, newRole]);
        } catch (err) {
            console.error('Error adding role:', err);
            throw err;
        }
    };

    const deleteRole = async (id: string) => {
        try {
            await api.deleteRole(id);
            setRoles((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error deleting role:', err);
            throw err;
        }
    };

    const addDepartment = async (department: Omit<Department, 'id' | 'companyId'>) => {
        try {
            const newDept = await api.createDepartment(department as Omit<Department, 'id'>);
            setDepartments((prev) => [...prev, newDept]);
        } catch (err) {
            console.error('Error adding department:', err);
            throw err;
        }
    };

    const deleteDepartment = async (id: string) => {
        try {
            await api.deleteDepartment(id);
            setDepartments((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            console.error('Error deleting department:', err);
            throw err;
        }
    };

    const addEmployee = async (employee: Employee) => {
        try {
            const newEmployee = await api.createEmployee(employee);
            setEmployees((prev) => [...prev, newEmployee]);
        } catch (err) {
            console.error('Error adding employee:', err);
            throw err;
        }
    };

    const updateEmployee = async (employee: Employee) => {
        try {
            const updated = await api.updateEmployee(employee);
            setEmployees((prev) => prev.map((e) => (e.id === employee.id ? updated : e)));
        } catch (err) {
            console.error('Error updating employee:', err);
            throw err;
        }
    };

    const deleteEmployee = async (id: string) => {
        try {
            await api.deleteEmployee(id);
            setEmployees((prev) => prev.filter((e) => e.id !== id));
            setVacations((prev) => prev.filter((v) => v.employeeId !== id));
        } catch (err) {
            console.error('Error deleting employee:', err);
            throw err;
        }
    };

    const addVacation = async (vacation: VacationRequest) => {
        try {
            const newVacation = await api.createVacation(vacation);
            setVacations((prev) => [...prev, newVacation]);
        } catch (err) {
            console.error('Error adding vacation:', err);
            throw err;
        }
    };

    const addMultipleVacations = async (newVacations: VacationRequest[]) => {
        try {
            await api.createVacationsBatch(newVacations);
            // We could fetch all vacations again to be safe, or just append locally
            // Appending locally is faster
            setVacations((prev) => [...prev, ...newVacations]);
        } catch (err) {
            console.error('Error adding multiple vacations:', err);
            throw err;
        }
    };

    const updateVacation = async (vacation: VacationRequest) => {
        try {
            const updated = await api.updateVacation(vacation);
            setVacations((prev) => prev.map((v) => (v.id === vacation.id ? updated : v)));
        } catch (err) {
            console.error('Error updating vacation:', err);
            throw err;
        }
    };

    const deleteVacation = async (id: string) => {
        try {
            await api.deleteVacation(id);
            setVacations((prev) => prev.filter((v) => v.id !== id));
        } catch (err) {
            console.error('Error deleting vacation:', err);
            throw err;
        }
    };

    const removeDayFromVacation = async (vacationId: string, dayToRemove: Date) => {
        const vacation = vacations.find(v => v.id === vacationId);
        if (!vacation) return;

        const start = parseISO(vacation.startDate);
        const end = parseISO(vacation.endDate);
        const dayToRemoveStr = format(dayToRemove, 'yyyy-MM-dd');

        // Calculate total days in vacation
        const totalDays = differenceInDays(end, start) + 1;

        try {
            // If only one day, delete the entire vacation
            if (totalDays === 1) {
                await deleteVacation(vacationId);
                return;
            }

            // If removing the first day, adjust start date
            if (format(start, 'yyyy-MM-dd') === dayToRemoveStr) {
                const updatedVacation = { ...vacation, startDate: format(addDays(start, 1), 'yyyy-MM-dd') };
                await updateVacation(updatedVacation);
                return;
            }

            // If removing the last day, adjust end date
            if (format(end, 'yyyy-MM-dd') === dayToRemoveStr) {
                const updatedVacation = { ...vacation, endDate: format(subDays(end, 1), 'yyyy-MM-dd') };
                await updateVacation(updatedVacation);
                return;
            }

            // If removing a middle day, split into two vacations
            const newEndFirstPart = format(subDays(dayToRemove, 1), 'yyyy-MM-dd');
            const newStartSecondPart = format(addDays(dayToRemove, 1), 'yyyy-MM-dd');

            // 1. Delete original
            await api.deleteVacation(vacationId);

            // 2. Create two new parts
            const firstPart: VacationRequest = {
                id: crypto.randomUUID(),
                companyId: vacation.companyId,
                employeeId: vacation.employeeId,
                startDate: vacation.startDate,
                endDate: newEndFirstPart,
                status: vacation.status,
                notes: vacation.notes,
            };

            const secondPart: VacationRequest = {
                id: crypto.randomUUID(),
                companyId: vacation.companyId,
                employeeId: vacation.employeeId,
                startDate: newStartSecondPart,
                endDate: vacation.endDate,
                status: vacation.status,
                notes: vacation.notes,
            };

            await api.createVacationsBatch([firstPart, secondPart]);

            // Update local state
            setVacations((prev) => {
                const filtered = prev.filter(v => v.id !== vacationId);
                return [...filtered, firstPart, secondPart];
            });

        } catch (err) {
            console.error('Error removing day from vacation:', err);
            throw err;
        }
    };

    return (
        <AppContext.Provider
            value={{
                employees,
                vacations,
                roles,
                departments,
                isLoading,
                error,
                addEmployee,
                updateEmployee,
                deleteEmployee,
                addVacation,
                addMultipleVacations,
                updateVacation,
                deleteVacation,
                removeDayFromVacation,
                addRole,
                deleteRole,
                addDepartment,
                deleteDepartment,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
