import api from './api';

export interface CheckoutResponse {
    success: number;
    message: string;
    order: {
        _id: string;
        totalAmount: number;
        status: string;
        paymentStatus: string;
    };
    razorpayOrder: {
        id: string;
        amount: number;
        currency: string;
        key: string;
    };
}

export const paymentService = {
    // Phase 1: Create local order and get Razorpay order details
    checkout: async (data: {
        products: { product: string; quantity: number }[];
        addressId: string;
        totalAmount: number;
    }): Promise<CheckoutResponse> => {
        const response = await api.post('/user/checkout', data);
        return response.data;
    },

    // Phase 2: Verify payment after Razorpay modal completes
    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        orderId: string;
    }) => {
        const response = await api.post('/payment/verify-payment', paymentData);
        return response.data;
    }
};
