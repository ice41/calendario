import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, Employee } from '../types';
import { useApp } from './AppContext';

interface AuthContextType {
    user: User | null;
    login: (email: string, code: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const { employees } = useApp();

    // Check for persisted session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, code: string): Promise<boolean> => {
        // 1. Check for default admin account
        if (email === 'admin' && code === 'admin123') {
            const adminUser: User = {
                id: 'admin-default',
                name: 'Administrador',
                email: 'admin',
                role: 'admin'
            };
            setUser(adminUser);
            localStorage.setItem('auth_user', JSON.stringify(adminUser));
            return true;
        }

        // 2. Check for employee login (email + employee code as password)
        const employee = employees.find(e => 
            e.email.toLowerCase() === email.toLowerCase() && 
            e.employeeCode === code
        );

        if (employee) {
            const employeeUser: User = {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.isAdmin ? 'admin' : 'employee',
                employeeId: employee.id
            };
            setUser(employeeUser);
            localStorage.setItem('auth_user', JSON.stringify(employeeUser));
            return true;
        }

        // Login failed
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
