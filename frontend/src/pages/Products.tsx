import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from '../components/product/ProductCard';
import { Search, Loader2 } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [searchParams] = useSearchParams();

    // Suggestion states
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchRef = useRef<HTMLFormElement>(null);

    const navigate = useNavigate();

    const performSearch = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const response = await productService.getProducts({
                search: query,
                category: selectedCategory || undefined,
                sort: sortBy,
                limit: 50
            });
            if (response.success) {
                setProducts(response.products || []);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('Search failed. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, sortBy]);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({
                category: selectedCategory || undefined,
                sort: sortBy,
                limit: 50
            });

            if (response.success) {
                setProducts(response.products || []);
            } else {
                setProducts([]);
            }
        } catch (error: unknown) {
            console.error('Load products error:', error);
            toast.error('Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, sortBy]);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        } else {
            loadProducts();
        }
    }, [searchParams, performSearch, loadProducts]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsLoadingSuggestions(true);
                try {
                    const response = await productService.searchProducts(searchQuery);
                    if (response.success) {
                        setSuggestions(response.products);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSuggestionClick = (productId: string) => {
        navigate(`/products/${productId}`);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
        setSortBy('-createdAt');
        navigate('/products');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 mt-10">
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">Browse our collection of medicines and healthcare products</p>
                </div>

                {/* Search Bar */}
                <form
                    ref={searchRef}
                    onSubmit={handleSearch}
                    className="mb-8 relative"
                >
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                placeholder="Search for products, medicines..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl shadow-lg shadow-blue-100/50 focus:outline-none focus:border-blue-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {isLoadingSuggestions && (
                                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                )}
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>Search</span>
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-3 md:right-auto md:w-full glass-effect rounded-2xl shadow-2xl overflow-hidden z-50 py-3 border border-white/20"
                            >
                                {suggestions.length > 0 ? (
                                    <>
                                        <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 mb-2">
                                            Top Matches
                                        </div>
                                        {suggestions.map((product) => (
                                            <button
                                                key={product._id}
                                                type="button"
                                                onClick={() => handleSuggestionClick(product._id)}
                                                className="w-full flex items-center px-4 py-3 hover:bg-blue-50/50 transition text-left group"
                                            >
                                                <div className="h-12 w-12 bg-white rounded-xl flex-shrink-0 mr-4 border border-gray-100 flex items-center justify-center shadow-sm p-1.5 group-hover:scale-110 transition-transform">
                                                    <img src={product.imageUrl?.url} alt="" className="max-h-full max-w-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{product.brand} • {product.form}</p>
                                                </div>
                                                <div className="ml-4 text-right">
                                                    <p className="text-sm font-extrabold text-blue-600">₹{product.price}</p>
                                                    {product.quantity <= 0 && (
                                                        <span className="text-[8px] font-bold text-red-500 uppercase">Out of Stock</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                        <div className="px-4 py-3 border-t border-gray-100/50 mt-2 bg-gray-50/30">
                                            <button
                                                onClick={() => handleSearch()}
                                                className="w-full text-center text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 transition"
                                            >
                                                View All Results for "{searchQuery}"
                                            </button>
                                        </div>
                                    </>
                                ) : !isLoadingSuggestions && (
                                    <div className="px-8 py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <Search size={28} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">No suggestions found</p>
                                        <p className="text-xs text-gray-500 mt-1.5">Try a different keyword or check your spelling</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-wrap gap-6 items-end">
                        {/* Category Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-averageRating">Rating: High to Low</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {(selectedCategory || searchQuery) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-medium">Fetching healthcare products...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                            We couldn't find any products matching "{searchQuery || 'your criteria'}". Try a different search term or clear your filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg inline-block shadow-sm">
                            Showing <span className="text-blue-600 font-bold">{products.length}</span> products
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
