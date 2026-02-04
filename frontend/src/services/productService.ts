import api from './api';
import { Product } from '../types/product';

interface ProductsResponse {
    success: number;
    message: string;
    products: Product[];
    totalCount?: number;
}

export interface DashboardStats {
    revenue: number;
    orders: number;
    activeProducts: number;
    lowStockAlerts: number;
    averageRating: number;
    totalReviews: number;
}

export interface SalesTrend {
    date: string;
    revenue: number;
}

export interface TopProduct extends Product {
    soldQuantity: number;
    revenue: number;
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export const productService = {
    // Get all products with filters
    async getProducts(params?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
        page?: number;
        limit?: number;
    }): Promise<ProductsResponse> {
        const queryParams = new URLSearchParams();

        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await api.get(`/products?${queryParams.toString()}`);

        // Normalize response: backend might return categoryWise array
        let products: Product[] = [];
        if (response.data.categoryWise && Array.isArray(response.data.categoryWise)) {
            // Flatten the categoryWise products into a single array
            products = response.data.categoryWise.reduce((acc: Product[], current: { products?: Product[] }) => {
                return acc.concat(current.products || []);
            }, []);
        } else if (response.data.products) {
            products = response.data.products;
        }

        return {
            success: response.data.success || 1,
            message: response.data.message || '',
            products: products,
            totalCount: response.data.totalCount || products.length
        };
    },

    // Get single product by ID
    async getProductById(id: string): Promise<Product> {
        const response = await api.get(`/show-product/${id}`);
        return response.data.product;
    },

    // Get top-rated products
    async getTopRated(params?: {
        minReviews?: number;
        limit?: number;
        category?: string;
    }): Promise<{ success: number; products: Product[] }> {
        const queryParams = new URLSearchParams();

        if (params?.minReviews) queryParams.append('minReviews', params.minReviews.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.category) queryParams.append('category', params.category);

        const response = await api.get(`/products/top-rated?${queryParams.toString()}`);
        return {
            success: response.data.success || 1,
            products: response.data.products || []
        };
    },

    // Search products
    async searchProducts(query: string): Promise<ProductsResponse> {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        return {
            success: response.data.success || 1,
            message: response.data.message || '',
            products: response.data.data || [], // Backend search returns 'data' array
            totalCount: response.data.count || (response.data.data ? response.data.data.length : 0)
        };
    },

    // Seller: Get host's products
    async getHostProducts(): Promise<{ success: number; products: Product[] }> {
        const response = await api.get('/showProducts');

        // Normalize response: backend returns categoryWise array
        let products: Product[] = [];
        if (response.data.products && Array.isArray(response.data.products)) {
            // Flatten the categoryWise products into a single array
            products = response.data.products.reduce((acc: Product[], current: { products?: Product[] }) => {
                return acc.concat(current.products || []);
            }, []);
        }

        return {
            success: response.data.success || 1,
            products: products
        };
    },

    // Seller: Bulk Upload CSV
    async uploadBulkProducts(file: File): Promise<{ success: number; message: string; count: number }> {
        const formData = new FormData();
        formData.append('csvFile', file);
        const response = await api.post('/host/bulk/bulk-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Seller: Bulk Update Prices
    async updateBulkPrices(updates: { id: string; price: number; mainPrice?: number }[]): Promise<{ success: number; message: string }> {
        const response = await api.patch('/host/bulk/bulk-update-price', { updates });
        return response.data;
    },

    // Seller: Analytics - Dashboard Stats
    async getDashboardStats(): Promise<{ success: number; stats: DashboardStats }> {
        const response = await api.get('/host/analytics/dashboard-stats');
        return response.data;
    },

    // Seller: Analytics - Sales Trends
    async getSalesTrends(): Promise<{ success: number; trends: SalesTrend[] }> {
        const response = await api.get('/host/analytics/sales-trends');
        return response.data;
    },

    // Seller: Analytics - Top Products
    async getTopProducts(): Promise<{ success: number; products: TopProduct[] }> {
        const response = await api.get('/host/analytics/top-products');
        return response.data;
    },

    // Seller: Add Product
    async addProduct(formData: FormData): Promise<{ success: number; message: string; product: Product }> {
        const response = await api.post('/addProduct', formData);
        return response.data;
    },

    // Seller: Update Product
    async updateProduct(id: string, formData: FormData): Promise<{ success: number; message: string }> {
        const response = await api.patch(`/updateProduct?id=${id}`, formData);
        return response.data;
    },

    // Seller: Delete Product
    async deleteProduct(id: string): Promise<{ success: number; message: string }> {
        const response = await api.delete(`/deleteProduct?id=${id}`);
        return response.data;
    }
};
