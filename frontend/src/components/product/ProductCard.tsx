import React, { useState } from 'react';
import { Product } from '../../types/product';
import { wishlistService } from '../../services/wishlistService';
import { useCart } from '../../contexts/CartContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlistLoading(true);
        try {
            if (isWishlisted) {
                await wishlistService.removeFromWishlist(product._id);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await wishlistService.addToWishlist(product._id);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch {
            toast.error('Failed to update wishlist');
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.quantity > 0) {
            addToCart(product, 1);
        } else {
            toast.error('Product is out of stock');
        }
    };

    const discount = product.mainPrice > product.price
        ? Math.round(((product.mainPrice - product.price) / product.mainPrice) * 100)
        : 0;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            onClick={onClick}
            className="premium-card group relative flex flex-col h-full overflow-hidden"
        >
            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                disabled={isWishlistLoading}
                className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl glass-effect shadow-xl transition-all duration-500 hover:scale-110 ${isWishlisted ? 'text-red-500 opacity-100' : 'text-gray-400 md:opacity-0 group-hover:opacity-100'
                    }`}
            >
                {isWishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            </button>

            {/* Product Image Wrapper */}
            <div className="relative h-56 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-8 overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={product.imageUrl?.url || '/medicine-placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={(e) => {
                        e.currentTarget.src = '/medicine-placeholder.png';
                    }}
                />

                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-red-200 uppercase tracking-widest">
                        {discount}% OFF
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-1">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.15em]">{product.category}</span>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 font-medium italic">{product.brand}</p>

                {/* Meta Row: Rating & Stock */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 rounded-lg text-yellow-700">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">{product.averageRating > 0 ? product.averageRating.toFixed(1) : 'New'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        {product.quantity > 0 ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                In Stock
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Sold Out</span>
                        )}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-5 flex items-center justify-between gap-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-medium">₹{product.mainPrice}</span>
                        <span className="text-xl font-black text-slate-900 tracking-tight">₹{product.price}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={product.quantity === 0}
                        onClick={handleAddToCart}
                        className="h-11 w-11 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors disabled:bg-slate-200 disabled:shadow-none"
                    >
                        <ShoppingCart size={18} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
