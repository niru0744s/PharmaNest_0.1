import { Product } from './product';
import { Address } from './user';

export interface OrderProduct {
    product: Product | string;
    name: string;
    quantity: number;
}

export interface StatusHistoryItem {
    status: string;
    updatedBy?: {
        firstName: string;
        lastName: string;
    };
    updatedByModel?: string;
    notes?: string;
    timestamp: string;
}

export interface Order {
    _id: string;
    user: string;
    status: 'pending' | 'shipped' | 'on_the_way' | 'delivered' | 'cancelled';
    totalAmount: number;
    products: OrderProduct[];
    address: Address | string;
    paymentId?: string;
    razorpayOrderId?: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    refundId?: string;
    statusHistory: StatusHistoryItem[];
    trackingNumber?: string;
    cancelledBy?: string;
    cancelledByModel?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}
