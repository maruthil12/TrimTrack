'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('trimtrack_user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                try {
                    // Validate against DB
                    const res = await fetch('/api/auth/me', {
                        headers: { 'x-user-id': parsedUser.id }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                        localStorage.setItem('trimtrack_user', JSON.stringify(data.user));
                    } else {
                        localStorage.removeItem('trimtrack_user');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth validation error', error);
                    setUser(parsedUser);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                localStorage.setItem('trimtrack_user', JSON.stringify(data.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        return { success: false, error: 'Google Sign-In is disabled in this version.' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('trimtrack_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
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
