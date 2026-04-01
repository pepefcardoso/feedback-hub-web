'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await apiClient<{ data: { user: User } }>('/users/me', {
                    skipRedirect: true,
                });
                if (res.data?.user) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, []);

    const logout = async () => {
        try {
            await apiClient('/users/logout', {
                method: 'POST',
                skipRedirect: true
            });
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};