import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    maxQuantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    // Map backend cart item to frontend CartItem
    const mapBackendToFrontend = (item: any): CartItem => ({
        _id: item.products._id || item.products,
        name: item.products.name,
        price: item.products.price,
        imageUrl: item.products.imageUrl?.url || item.products.imageUrl,
        quantity: item.quantity,
        maxQuantity: item.products.quantity || 100
    });

    // Load from local storage or backend on mount
    const loadCart = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isAuthenticated && user?.role === 'user') {
                // If logged in as a normal user, fetch from backend
                const response = await cartService.fetchCart();
                if (response.success && response.userCart) {
                    const items = response.userCart.map(mapBackendToFrontend);
                    setCartItems(items);
                    // Also update local storage as backup
                    localStorage.setItem('cart', JSON.stringify(items));
                } else {
                    // If backend cart is empty, check if we have local items to sync
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        const localItems = JSON.parse(savedCart);
                        if (localItems.length > 0) {
                            await syncLocalCartWithBackend(localItems);
                        }
                    } else {
                        setCartItems([]);
                    }
                }
            } else {
                // If not logged in, load from local storage
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            }
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const syncLocalCartWithBackend = async (localItems: CartItem[]) => {
        try {
            const syncItems = localItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));
            const response = await cartService.syncCart(syncItems);
            if (response.success && response.userCart) {
                const items = response.userCart.map(mapBackendToFrontend);
                setCartItems(items);
                localStorage.setItem('cart', JSON.stringify(items));
            }
        } catch (error) {
            console.error("Failed to sync cart", error);
        }
    };

    const addToCart = async (product: any, quantity: number) => {
        const existingItem = cartItems.find(item => item._id === product._id);
        const maxStock = product.quantity || 100;

        if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
            if (newQuantity === existingItem.quantity && quantity > 0) {
                toast.error(`Cannot add more. Max stock is ${maxStock}`);
                return;
            }

            if (isAuthenticated) {
                try {
                    await cartService.updateCart(product._id, newQuantity);
                } catch (error) {
                    console.error("Failed to update cart on server", error);
                }
            }

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: newQuantity } : item
                )
            );
            toast.success('Cart updated');
        } else {
            const newItems = [...cartItems, {
                _id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl?.url || product.imageUrl,
                quantity: quantity,
                maxQuantity: maxStock
            }];

            if (isAuthenticated) {
                try {
                    await cartService.addToCart(product._id, quantity);
                } catch (error) {
                    console.error("Failed to add to cart on server", error);
                }
            }

            setCartItems(newItems);
            toast.success('Added to cart');
        }
    };

    const removeFromCart = async (productId: string) => {
        if (isAuthenticated) {
            try {
                await cartService.removeFromCart(productId);
            } catch (error) {
                console.error("Failed to remove from cart on server", error);
            }
        }
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        toast.success('Removed from cart');
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        const item = cartItems.find(i => i._id === productId);
        if (!item) return;

        const newQty = Math.max(1, Math.min(quantity, item.maxQuantity));

        if (isAuthenticated) {
            try {
                await cartService.updateCart(productId, newQty);
            } catch (error) {
                console.error("Failed to update quantity on server", error);
            }
        }

        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item._id === productId) {
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    // Save to local storage on change (as backup)
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cartItems]);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};
