export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:id',
    PROFILE: '/profile',
    AI_ADVISOR: '/ai-advisor',

    // Seller routes
    SELLER_DASHBOARD: '/seller',
    SELLER_PRODUCTS: '/seller/products',
    SELLER_ORDERS: '/seller/orders',
};

export const PRODUCT_CATEGORIES = [
    'Medicine',
    'OTC_Medicine',
    'First_Aid',
    'Hygiene',
    'Baby_product',
    'Supplements',
    'Test_kits'
] as const;

export const ORDER_STATUSES = {
    PENDING: 'pending',
    SHIPPED: 'shipped',
    ON_THE_WAY: 'on_the_way',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
} as const;
