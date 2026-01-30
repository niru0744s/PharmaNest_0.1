export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: 'user' | 'host' | 'doctor';
    isEmailVerified: boolean;
    isVerified?: boolean;
    profileImage?: {
        url: string;
        publicId: string;
    };
    createdAt: string;
}

export interface Seller extends User {
    businessName: string;
    businessAddress: string;
    description?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: 'user' | 'host' | 'doctor';
}

export interface AuthResponse {
    success: number;
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface HostAuthResponse {
    success: number;
    message: string;
    seller: Seller;
    accessToken: string;
    refreshToken: string;
}

export interface Address {
    _id: string;
    name: string;
    mobileNum: string;
    address: string;
    pincode: string;
    userId: string;
}
