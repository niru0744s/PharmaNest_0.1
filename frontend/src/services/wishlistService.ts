import api from './api';

export interface WishlistResponse {
    success: number;
    message: string;
    wishlist: any[];
}

export const wishlistService = {
    // Get user's wishlist
    getWishlist: async (): Promise<WishlistResponse> => {
        const response = await api.get('/user/fetchWishlist');
        return response.data;
    },

    // Add product to wishlist
    addToWishlist: async (productId: string): Promise<WishlistResponse> => {
        const response = await api.post(`/user/addWishlist/${productId}`);
        return response.data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId: string): Promise<WishlistResponse> => {
        const response = await api.delete(`/user/deleteWishlist/${productId}`);
        return response.data;
    }
};
