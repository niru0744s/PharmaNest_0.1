import api from './api';

export interface OrderProduct {
    product: {
        _id: string;
        name: string;
        price: number;
        imageUrl?: { url: string };
    };
    quantity: number;
    price: number;
}

export interface OrderStatusHistory {
    status: string;
    updatedBy: string;
    updatedByModel: string;
    notes?: string;
    timestamp: string;
}

export interface Order {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    products: OrderProduct[];
    totalAmount: number;
    status: 'pending' | 'shipped' | 'on_the_way' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    address: {
        name: string;
        mobileNum: string;
        address: string;
        pincode: string;
        locality?: string;
        city?: string;
        state?: string;
    };
    trackingNumber?: string;
    statusHistory: OrderStatusHistory[];
    createdAt: string;
}

export interface SellerOrdersResponse {
    success: number;
    message: string;
    orders: Order[];
    stats: {
        total: number;
        pending: number;
        shipped: number;
        on_the_way: number;
        delivered: number;
        cancelled: number;
    };
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        total: number;
    };
}

export const orderService = {
    // Get seller's orders
    async getSellerOrders(params?: {
        status?: string;
        paymentStatus?: string;
        page?: number;
        limit?: number;
    }): Promise<SellerOrdersResponse> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await api.get(`/host/orders?${queryParams.toString()}`);
        return response.data;
    },

    // Get order details
    async getOrderDetails(orderId: string): Promise<{ success: number; order: Order }> {
        const response = await api.get(`/host/orders/${orderId}`);
        return response.data;
    },

    // Update order status
    async updateOrderStatus(orderId: string, data: {
        status: string;
        notes?: string;
        trackingNumber?: string;
    }): Promise<{ success: number; message: string; order: Partial<Order> }> {
        const response = await api.post(`/host/orders/${orderId}/status`, data);
        return response.data;
    },

    // Cancel order
    async cancelOrderBySeller(orderId: string, reason: string): Promise<{ success: number; message: string }> {
        const response = await api.post(`/host/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    // Get user's orders
    async getMyOrders(): Promise<{ success: number; orders: Order[] }> {
        const response = await api.get('/user/orders');
        return response.data;
    }
};
