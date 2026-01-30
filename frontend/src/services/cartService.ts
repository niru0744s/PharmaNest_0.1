import api from './api';

export interface CartItemResponse {
    _id: string;
    UserId: string;
    products: any;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface SyncCartItem {
    product: string;
    quantity: number;
}

export const cartService = {
    async fetchCart() {
        const response = await api.get('/user/fetchCart');
        return response.data;
    },

    async addToCart(productId: string, quantity: number = 1) {
        const response = await api.post(`/user/addCart/${productId}`, { quantity });
        return response.data;
    },

    async updateCart(productId: string, quantity: number) {
        const response = await api.patch(`/user/updateCart/${productId}`, { quantity });
        return response.data;
    },

    async removeFromCart(productId: string) {
        const response = await api.delete(`/user/deleteCart/${productId}`);
        return response.data;
    },

    async syncCart(items: SyncCartItem[]) {
        const response = await api.post('/user/syncCart', { items });
        return response.data;
    }
};
