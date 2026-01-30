import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { reviewService, Review, ReviewStats } from '../services/reviewService';
import { Product } from '../types/product';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ReviewList from '../components/product/ReviewList';
import ReviewForm from '../components/product/ReviewForm';
import {
    Star,
    ShoppingCart,
    Heart,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Plus,
    Minus,
    Info,
    Beaker,
    Activity,
    AlertTriangle,
    Zap,
    ChevronLeft,
    Share2,
    Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'usage' | 'safety' | 'reviews'>('details');

    // Review states
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const fetchReviews = useCallback(async (productId: string) => {
        setReviewsLoading(true);
        try {
            const data = await reviewService.getProductReviews(productId);
            if (data.success) {
                setReviews(data.reviews);
                setReviewStats(data.stats);
            }
        } catch (error) {
            console.error('Fetch reviews error:', error);
        } finally {
            setReviewsLoading(false);
        }
    }, []);

    const loadProduct = useCallback(async (productId: string) => {
        setLoading(true);
        try {
            const data = await productService.getProductById(productId);
            setProduct(data);
        } catch (error: unknown) {
            console.error('Load product error:', error);
            toast.error('Failed to load product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (id) {
            loadProduct(id);
            fetchReviews(id);
        }
    }, [id, loadProduct, fetchReviews]);

    const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
        if (!id) return;
        if (editingReview) {
            await reviewService.updateReview(editingReview._id, data);
        } else {
            await reviewService.addReview(id, data);
        }
        setShowReviewForm(false);
        setEditingReview(null);
        fetchReviews(id);
        loadProduct(id);
    };

    const handleReviewDelete = async (reviewId: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const data = await reviewService.deleteReview(reviewId);
            if (data.success) {
                toast.success('Review deleted');
                if (id) {
                    fetchReviews(id);
                    loadProduct(id);
                }
            }
        } catch {
            toast.error('Failed to delete review');
        }
    };

    const handleMarkHelpful = async (reviewId: string) => {
        if (!isAuthenticated) return toast.error('Please login to rate reviews');
        try {
            const data = await reviewService.markHelpful(reviewId);
            if (data.success) {
                setReviews((prev) => prev.map((r: Review) =>
                    r._id === reviewId
                        ? { ...r, helpful: { ...r.helpful, count: data.helpful, users: data.helpful > r.helpful.count ? [...r.helpful.users, user?._id || ''] : r.helpful.users.filter((id: string) => id !== user?._id) } }
                        : r
                ));
            }
        } catch {
            toast.error('Failed to update helpfulness');
        }
    };

    const handleReportReview = async (reviewId: string) => {
        if (!isAuthenticated) return toast.error('Please login to report reviews');
        const reason = window.prompt('Please enter reason for reporting this review:');
        if (!reason) return;
        try {
            const data = await reviewService.reportReview(reviewId, reason);
            if (data.success) {
                toast.success('Review reported. Thank you for your feedback.');
            }
        } catch {
            toast.error('Failed to report review');
        }
    };


    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            toast.success('Added to cart!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
                    />
                    <p className="mt-4 text-slate-500 font-medium">Loading premium experience...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <p className="text-slate-600 text-lg">Product not found</p>
                    <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 font-bold hover:underline capitalize">Back to repository</button>
                </div>
            </div>
        );
    }

    const discount = product.mainPrice > product.price
        ? Math.round(((product.mainPrice - product.price) / product.mainPrice) * 100)
        : 0;

    const tabs = [
        { id: 'details', label: 'Details', icon: Info },
        { id: 'usage', label: 'Usage', icon: Zap },
        { id: 'safety', label: 'Safety', icon: ShieldCheck },
        { id: 'reviews', label: `Reviews (${product.totalReviews})`, icon: Star },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/products')}
                        className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-widest"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                        Back to Products
                    </button>
                    <div className="flex gap-4">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors">
                            <Share2 size={20} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 transition-colors">
                            <Heart size={20} />
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7"
                    >
                        <div className="glass-effect bg-white rounded-[2.5rem] p-12 border border-white/60 shadow-2xl relative overflow-hidden group">
                            {/* Decorative background flare */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <motion.img
                                layoutId={`product-image-${product._id}`}
                                src={product.imageUrl?.url || '/placeholder.png'}
                                alt={product.name}
                                className="w-full aspect-[4/3] object-contain relative z-10 filter drop-shadow-2xl"
                                onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                            />

                            {discount > 0 && (
                                <div className="absolute top-8 left-8 bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-blue-200 uppercase tracking-tighter">
                                    {discount}% Limited Offer
                                </div>
                            )}

                            <div className="absolute bottom-8 right-8 flex gap-2">
                                <div className="h-2 w-8 bg-blue-600 rounded-full" />
                                <div className="h-2 w-2 bg-slate-200 rounded-full" />
                                <div className="h-2 w-2 bg-slate-200 rounded-full" />
                            </div>
                        </div>

                        {/* Quick Trust Badges */}
                        <div className="grid grid-cols-3 gap-6 mt-10">
                            {[
                                { icon: Truck, label: "Free Shipping", sub: "On orders over ₹500" },
                                { icon: ShieldCheck, label: "Secure Payment", sub: "100% encrypted" },
                                { icon: RefreshCcw, label: "Easy Returns", sub: "7 days policy" }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-white/40 rounded-3xl border border-white/60 shadow-sm">
                                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
                                        <badge.icon size={24} />
                                    </div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{badge.label}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">{badge.sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Info & Action Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-blue-100/50">
                                    {product.category.replace('_', ' ')}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-emerald-100/50">
                                    <Activity size={14} />
                                    {product.form}
                                </div>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-slate-900 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                                    <Store size={16} className="text-blue-600" />
                                    <span className="text-sm">{product.brand}</span>
                                </div>
                                <div className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-sm font-bold text-slate-500">{product.strength}</span>
                            </div>

                            {/* Ratings Summary */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={16} className={s <= Math.round(product.averageRating) ? "fill-blue-600 text-blue-600" : "text-slate-200"} />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className="text-xs font-black text-blue-600 uppercase hover:underline"
                                >
                                    {product.totalReviews} Reviews
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -tr-1/2" />
                            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                                <div className="space-y-1">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Special Price</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl lg:text-5xl font-black tracking-tighter">₹{product.price}</span>
                                        {discount > 0 && (
                                            <span className="text-lg text-slate-500 line-through font-medium">₹{product.mainPrice}</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">Inclusive of all local taxes</p>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest ${product.quantity > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {product.quantity > 0 ? 'Fully Stocked' : 'Out of Stock'}
                                </div>
                            </div>
                        </div>

                        {/* Selection & Actions */}
                        <div className="space-y-6 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                            {product.quantity > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Quantity</span>
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="w-8 text-center font-black text-slate-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(37 99 235 / 0.1)" }}
                                            whileTap={{ scale: 1.02 }}
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all group"
                                        >
                                            <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <AlertTriangle className="text-red-500" size={24} />
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase">Restocking Soon</p>
                                        <p className="text-xs text-slate-500 font-medium">Leave your email and we'll notify you.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Tabbed Content Section */}
                <div className="mt-20">
                    <div className="flex items-center gap-8 border-b border-slate-200 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'details' | 'usage' | 'safety' | 'reviews')}
                                className={`flex items-center gap-2.5 pb-4 transition-all relative outline-none whitespace-nowrap ${activeTab === tab.id
                                    ? "text-blue-600 font-black text-sm uppercase tracking-widest"
                                    : "text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-slate-600"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'details' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                                                    <div className="w-8 h-1 bg-blue-600 rounded-full" />
                                                    Description
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                    {product.description}
                                                </p>
                                            </div>
                                            {product.composition && (
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                                                        <div className="w-8 h-1 bg-blue-600 rounded-full" />
                                                        Active Composition
                                                    </h3>
                                                    <p className="text-slate-600 leading-relaxed font-medium bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                        {product.composition}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-8">
                                            {product.benefits && product.benefits.length > 0 ? (
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                                                        <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                                                        Key Highlights
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {product.benefits.map((benefit, i) => (
                                                            <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group">
                                                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                                    <Zap size={18} />
                                                                </div>
                                                                <span className="text-slate-700 font-bold text-sm mt-1.5">{benefit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex flex-col items-center justify-center text-center">
                                                    <Beaker className="text-blue-500 mb-4" size={40} />
                                                    <h4 className="font-black text-blue-900 uppercase tracking-tight">Scientifically Formulated</h4>
                                                    <p className="text-sm text-blue-600 font-medium mt-2">Tested and verified for maximum efficacy and safety standards.</p>
                                                </div>
                                            )}

                                            <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                                                <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-4">Manufacturer Info</h4>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center font-black">
                                                        {product.brand.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black">{product.manufacturer || product.brand}</p>
                                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Marketed by Pharmanest Global</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'usage' && (
                                    <div className="max-w-3xl mx-auto space-y-12">
                                        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="h-16 w-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
                                                    <Zap size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Usage Instructions</h3>
                                                    <p className="text-slate-500 font-medium">Follow these guidelines for optimal results</p>
                                                </div>
                                            </div>
                                            <div className="text-slate-600 leading-relaxed font-bold text-lg p-8 bg-slate-50 rounded-2xl whitespace-pre-wrap">
                                                {product.usage || "Store in a cool and dry place. Read the label carefully before use. Do not exceed the recommended dosage."}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
                                                    <Truck size={24} />
                                                </div>
                                                <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2">Storage Conditions</h4>
                                                <p className="text-slate-800 font-bold">{product.storage || "Below 30°C. Protect from moisture."}</p>
                                            </div>
                                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                                                <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                                                    <AlertTriangle size={24} />
                                                </div>
                                                <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2">Safety Tip</h4>
                                                <p className="text-slate-800 font-bold">Keep out of reach of children.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'safety' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100/50 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm shadow-red-100">
                                                    <AlertTriangle size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-red-900 uppercase">Side Effects</h3>
                                                    <p className="text-red-700/60 font-medium text-xs">Inform your doctor if these persist</p>
                                                </div>
                                            </div>
                                            <p className="text-red-900 font-bold leading-relaxed bg-white/50 p-6 rounded-2xl">
                                                {product.sideEffects || "Consult your physician for possible side effects."}
                                            </p>
                                        </div>

                                        <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100/50 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                                                    <ShieldCheck size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-amber-900 uppercase">Precautions</h3>
                                                    <p className="text-amber-700/60 font-medium text-xs">Safety measures to consider</p>
                                                </div>
                                            </div>
                                            <p className="text-amber-900 font-bold leading-relaxed bg-white/50 p-6 rounded-2xl">
                                                {product.precautions || "Inform your healthcare professional about all current medications."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-12">
                                        {/* Statistics Overview */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                            <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                                                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-4">Total Average</p>
                                                <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">
                                                    {product.averageRating.toFixed(1)}
                                                </h2>
                                                <div className="flex justify-center gap-1 mb-6">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={24} className={s <= Math.round(product.averageRating) ? "fill-blue-600 text-blue-600" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                                <p className="text-slate-500 text-sm font-medium">Based on {product.totalReviews} genuine customer reviews</p>
                                            </div>

                                            <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] text-white space-y-4">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="font-black uppercase tracking-widest text-xs text-slate-400">Rating Distribution</h4>
                                                    <button
                                                        onClick={() => !isAuthenticated ? navigate('/login') : setShowReviewForm(true)}
                                                        className="px-6 py-2 bg-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors"
                                                    >
                                                        Review This Product
                                                    </button>
                                                </div>
                                                <div className="space-y-5">
                                                    {[5, 4, 3, 2, 1].map((star) => {
                                                        const percentage = reviewStats && reviewStats.totalReviews > 0
                                                            ? Math.round((reviewStats.ratingDistribution[star] / reviewStats.totalReviews) * 100)
                                                            : 0;
                                                        return (
                                                            <div key={star} className="flex items-center gap-6">
                                                                <span className="text-[10px] font-black text-slate-400 w-12">{star} STAR</span>
                                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percentage}%` }}
                                                                        className="h-full bg-blue-500 rounded-full"
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 w-12 text-right">{percentage}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Form & List */}
                                        <div id="reviews-section" className="pt-10">
                                            {showReviewForm && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mb-12"
                                                >
                                                    <ReviewForm
                                                        productId={id || ''}
                                                        initialData={editingReview ? { rating: editingReview.rating, comment: editingReview.comment, _id: editingReview._id } : undefined}
                                                        onSubmit={handleReviewSubmit}
                                                        onCancel={() => {
                                                            setShowReviewForm(false);
                                                            setEditingReview(null);
                                                        }}
                                                    />
                                                </motion.div>
                                            )}

                                            {reviewsLoading ? (
                                                <div className="flex justify-center py-24">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
                                                </div>
                                            ) : (
                                                <ReviewList
                                                    reviews={reviews}
                                                    onDelete={handleReviewDelete}
                                                    onEdit={(review) => {
                                                        setEditingReview(review);
                                                        setShowReviewForm(true);
                                                        window.scrollTo({ top: document.getElementById('reviews-section')?.offsetTop || 0, behavior: 'smooth' });
                                                    }}
                                                    onHelpful={handleMarkHelpful}
                                                    onReport={handleReportReview}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
