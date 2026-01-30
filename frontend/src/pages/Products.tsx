import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from '../components/product/ProductCard';
import { Search } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [searchParams] = useSearchParams();

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
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
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Search
                        </button>
                    </div>
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
