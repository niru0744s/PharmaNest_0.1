import React, { useEffect, useState } from 'react';
import UserSidebar from '../../components/layout/UserSidebar';
import { wishlistService } from '../../services/wishlistService';
import { useCart } from '../../contexts/CartContext';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistService.getWishlist();
            if (response.success) {
                setWishlistItems(response.wishlist || []);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const response = await wishlistService.removeFromWishlist(productId);
            if (response.success) {
                toast.success("Removed from wishlist");
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (product: any) => {
        addToCart(product, 1);
        handleRemove(product._id);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                            <FaHeart className="text-red-500 mr-3" /> My Wishlist
                        </h1>
                        <p className="text-gray-500">Items you've saved for later.</p>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="relative h-48 bg-gray-50">
                                        <img
                                            src={item.imageUrl?.url || item.imageUrl || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{item.brand}</p>
                                        <div className="mt-auto">
                                            <div className="text-xl font-bold text-blue-600 mb-4">₹{item.price}</div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="flex-1 bg-emerald-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors font-semibold"
                                                >
                                                    <FaShoppingCart className="w-4 h-4" /> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHeart className="text-gray-300 w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
                            <Link to="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                Explore Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
