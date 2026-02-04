import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, HostAuthResponse, User } from '../types/user';

export const authService = {
    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post('/user/auth/login', credentials);
        return response.data;
    },

    // Host Login
    async loginHost(credentials: LoginCredentials): Promise<HostAuthResponse> {
        const response = await api.post('/host/auth/login', credentials);
        return response.data;
    },

    // Register
    async register(data: RegisterData): Promise<AuthResponse | HostAuthResponse> {
        const endpoint = data.role === 'host' ? '/host/auth/register' : '/user/auth/register';
        const response = await api.post(endpoint, data);
        return response.data;
    },

    // Get current user profile
    async getProfile(): Promise<User> {
        const response = await api.get('/user/auth/profile');
        return response.data.user;
    },

    // Get current host profile
    async getHostProfile(): Promise<User> {
        const response = await api.get('/host/auth/profile');
        return response.data.seller;
    },

    // Update user profile
    async updateProfile(data: { firstName: string; lastName: string; phoneNumber: string }): Promise<{ success: number; message: string; user: User }> {
        const response = await api.put('/user/auth/update-profile', data);
        return response.data;
    },

    // Update user profile image
    async updateProfileImage(formData: FormData): Promise<{ success: number; message: string; user: User }> {
        const response = await api.put('/user/auth/update-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.clear();
    },

    // Verify email
    async verifyEmail(token: string): Promise<{ success: number; message: string }> {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    },

    // Resend verification email
    async resendVerification(email: string, userModel: 'User' | 'Host' = 'User'): Promise<{ success: number; message: string }> {
        const response = await api.post('/auth/resend-verification', { email, userModel });
        return response.data;
    },

    // Request password reset
    async forgotPassword(email: string, role: 'user' | 'host'): Promise<{ success: number; message: string; usr?: any }> {
        const endpoint = role === 'host' ? '/host/auth/forgetPass' : '/user/auth/forgetPass';
        const response = await api.post(endpoint, { email });
        return response.data;
    },

    // Verify OTP
    async verifyOTP(id: string, otp: string, role: 'user' | 'host'): Promise<{ success: number; message: string }> {
        const endpoint = role === 'host' ? '/host/auth/otpVerify' : '/user/auth/otpVerify';
        const response = await api.post(`${endpoint}?id=${id}`, { otp });
        return response.data;
    },

    // Reset password with OTP
    async resetPassword(id: string, otp: string, pass: string, role: 'user' | 'host'): Promise<{ success: number; message: string }> {
        const endpoint = role === 'host' ? '/host/auth/changePass' : '/user/auth/changePass';
        const response = await api.post(`${endpoint}?id=${id}`, { otp, pass });
        return response.data;
    },

    // Delete user account
    async deleteAccount(password: string): Promise<{ success: number; message: string }> {
        const response = await api.delete('/user/auth/delete-account', { data: { password } });
        return response.data;
    }
};
