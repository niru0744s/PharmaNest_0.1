import api from './api';

export interface Review {
    _id: string;
    comment: string;
    rating: number;
    author: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    productId: string;
    verifiedPurchase: boolean;
    helpful: {
        count: number;
        users: string[];
    };
    createdAt: string;
    updatedAt: string;
    sellerResponse?: {
        comment: string;
        respondedBy: string;
        respondedAt: string;
    };
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: number]: number;
    };
}

export interface ReviewsResponse {
    success: number;
    message: string;
    reviews: Review[];
    stats: ReviewStats;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        total: number;
    };
}

export const reviewService = {
    // Get product reviews
    getProductReviews: async (productId: string, params: { page?: number; limit?: number; sort?: string } = {}): Promise<ReviewsResponse> => {
        const response = await api.get(`/products/${productId}/reviews`, { params });
        return response.data;
    },

    // Add review
    addReview: async (productId: string, data: { rating: number; comment: string }): Promise<{ success: number; message: string; review: Review }> => {
        const response = await api.post(`/products/${productId}/reviews`, data);
        return response.data;
    },

    // Update review
    updateReview: async (reviewId: string, data: { rating?: number; comment?: string }): Promise<{ success: number; message: string; review: Review }> => {
        const response = await api.put(`/reviews/${reviewId}`, data);
        return response.data;
    },

    // Delete review
    deleteReview: async (reviewId: string): Promise<{ success: number; message: string }> => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    // Mark helpful
    markHelpful: async (reviewId: string): Promise<{ success: number; message: string; helpful: number }> => {
        const response = await api.post(`/reviews/${reviewId}/helpful`);
        return response.data;
    },

    // Report review
    reportReview: async (reviewId: string, reason: string): Promise<{ success: number; message: string; reported: number }> => {
        const response = await api.post(`/reviews/${reviewId}/report`, { reason });
        return response.data;
    }
};
