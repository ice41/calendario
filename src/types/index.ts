export interface CustomRole {
    id: string;
    companyId: string;
    name: string;
}

export interface Company {
    id: string;
    name: string;
    createdAt?: string;
    employeeCount?: number;
    vacationCount?: number;
}

export interface Employee {
    id: string;
    companyId: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
    color: string;
    employeeCode: string;
    isAdmin?: boolean;
}

export type VacationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface VacationRequest {
    id: string;
    companyId: string;
    employeeId: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    status: VacationStatus;
    notes?: string;
}

export interface Department {
    id: string;
    companyId: string;
    name: string;
}

export type UserRole = 'superadmin' | 'admin' | 'employee';

export interface User {
    id: string;
    companyId?: string; // superadmin has no specific company
    name: string;
    email: string;
    role: UserRole;
    employeeId?: string;
}
