import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { removeToken, setToken as setApiToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    balance: number;
    is_admin?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refreshUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token: string, newUser: User) => {
        setApiToken(token);
        setUser(newUser);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
