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
    orderId?: string;
    helpful: {
        count: number;
        users: string[];
    };
    reported: {
        count: number;
        users: string[];
    };
    sellerResponse?: {
        comment: string;
        respondedBy: {
            firstName: string;
            lastName: string;
        };
        respondedAt: string;
    };
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}
