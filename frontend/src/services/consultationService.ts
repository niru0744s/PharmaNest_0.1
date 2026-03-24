import api from './api';

export interface Doctor {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    specialization: string;
    experience: number;
    qualifications: string[];
    licenseNumber: string;
    consultationFees: number;
    rating: number;
    bio: string;
    availability: any[];
    profileImage?: {
        url: string;
    };
    isOnline: boolean;
}

export interface Consultation {
    _id: string;
    doctorId: any;
    userId: any;
    type: 'chat' | 'voice' | 'video';
    status: string;
    reason?: string;
    scheduledDate: string;
    slot: {
        start: string;
        end: string;
    };
    roomName: string;
    createdAt?: string;
    updatedAt?: string;
    prescription?: {
        _id: string;
        diagnosis?: string;
        advice?: string;
        followUpDate?: string;
        pdfUrl?: {
            url: string;
            public_id: string;
        };
    };
}

export const consultationService = {
    getDoctors: async () => {
        const response = await api.get('/consultations/doctors');
        return response.data;
    },

    bookConsultation: async (data: any) => {
        const response = await api.post('/consultations/book', data);
        return response.data;
    },

    instantBooking: async (data: any) => {
        const response = await api.post('/consultations/instant', data);
        return response.data;
    },

    getMyConsultations: async () => {
        const response = await api.get('/consultations/my-consultations');
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/consultations/${id}/status`, { status });
        return response.data;
    },

    createPrescription: async (id: string, data: any) => {
        const response = await api.post(`/consultations/${id}/prescription`, data);
        return response.data;
    },

    submitFeedback: async (data: any) => {
        const response = await api.post('/consultations/review', data);
        return response.data;
    },

    registerDoctor: async (data: any) => {
        const response = await api.post('/consultations/register-doctor', data);
        return response.data;
    }
};
