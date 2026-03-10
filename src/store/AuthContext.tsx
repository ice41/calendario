import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import * as api from '../lib/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, code: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Check for persisted session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, code: string): Promise<boolean> => {
        try {
            const userData = await api.login(email, code);
            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            return false; // Login failed
        }
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
            isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
            isSuperAdmin: user?.role === 'superadmin'
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
