export interface Product {
    _id: string;
    name: string;
    brand: string;
    form: string;
    strength: string;
    category: string;
    mainPrice: number;
    price: number;
    description: string;
    imageUrl: {
        url: string;
        filename: string;
    };
    quantity: number;
    sku?: string;
    stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
    lowStockThreshold?: number;
    soldQuantity?: number;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    hostId: string;
    composition?: string;
    benefits?: string[];
    usage?: string;
    sideEffects?: string;
    precautions?: string;
    storage?: string;
    manufacturer?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
    UserId: string;
}

export interface WishlistItem {
    _id: string;
    product: Product;
}
