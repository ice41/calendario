export type Role =
    | 'Departamento Financeiro'
    | 'Importação'
    | 'Exportação'
    | 'Departamento Aereo'
    | 'Departamento Maritimo'
    | 'Armazém'
    | 'Departamento Nacional'
    | 'Motoristas'
    | 'Outro';

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: Role;
    department: string;
    avatar?: string;
    color: string;
    employeeCode: string;
    isAdmin?: boolean;
}

export type VacationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface VacationRequest {
    id: string;
    employeeId: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    status: VacationStatus;
    notes?: string;
}

export interface Department {
    id: string;
    name: string;
}

export type UserRole = 'admin' | 'employee';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    employeeId?: string; // Linked employee record if role is employee
}
