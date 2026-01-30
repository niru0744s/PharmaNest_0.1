import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { authService } from '../services/authService';
import { User, RegisterData } from '../types/user';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginHost: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    // Try to get user profile first
                    const userData = await authService.getProfile();
                    setUser(userData);
                } catch (error: any) {
                    // If user profile fails, try host profile
                    try {
                        const hostData = await authService.getHostProfile();
                        setUser(hostData);
                    } catch (hostError) {
                        console.error('Auth init error:', hostError);
                        localStorage.clear();
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });

            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                setUser(response.user);
                toast.success('Login successful!');
            } else {
                const errorMsg = typeof response.message === 'string' ? response.message : 'Login failed';
                toast.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error: any) {
            const rawMessage = error.response?.data?.message || error.message || 'Login failed';
            const message = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await authService.register(data);

            if (response.success) {
                toast.success('Registration successful! Please check your email to verify your account.');
            } else {
                const errorMsg = typeof response.message === 'string' ? response.message : 'Registration failed';
                toast.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: any }>;
            const rawMessage = err.response?.data?.message || err.message || 'Registration failed';
            const message = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
            toast.error(message);
            throw error;
        }
    };

    const loginHost = async (email: string, password: string) => {
        try {
            const response = await authService.loginHost({ email, password });
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                setUser(response.seller);
                toast.success('Welcome back, Seller!');
            } else {
                const errorMsg = typeof response.message === 'string' ? response.message : 'Login failed';
                toast.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error: any) {
            const rawMessage = error.response?.data?.message || error.message || 'Login failed';
            const message = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            loginHost,
            register,
            logout,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
