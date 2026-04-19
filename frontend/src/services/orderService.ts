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
    } | null;
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

    // Seller: Get order details
    async getSellerOrderDetails(orderId: string): Promise<{ success: number; order: Order }> {
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
    },

    // Get single order details for user
    async getUserOrderDetails(orderId: string): Promise<{ success: number; order: Order }> {
        const response = await api.get(`/user/orders/${orderId}`);
        return response.data;
    },

    // User: Cancel order
    async cancelOrder(orderId: string, reason: string): Promise<{ success: number; message: string }> {
        const response = await api.post(`/user/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    // Download Invoice
    async downloadInvoice(orderId: string): Promise<void> {
        const response = await api.get(`/user/orders/${orderId}/invoice`, {
            responseType: 'blob'
        });

        // Create a link to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${orderId.slice(-6).toUpperCase()}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};
