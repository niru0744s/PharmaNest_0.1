import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ShoppingCart,
    User,
    Search,
    Menu,
    X,
    Heart,
    LogOut,
    LayoutDashboard,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../services/productService';
import { Product } from '../../types/product';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const isHostPath = location.pathname.startsWith('/host');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus search input when opened
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isSearchOpen]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 2) {
            setIsLoading(true);
            try {
                const response = await productService.searchProducts(query);
                if (response.success) {
                    setSuggestions(response.products);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setIsSearchOpen(false);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        navigate(`/products/${productId}`);
        setShowSuggestions(false);
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'py-2 bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/20'
            : 'py-4 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-xl font-bold font-serif">P</span>
                        </motion.div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 tracking-tight">
                            PharmaNest
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {!isHostPath && (
                            <>
                                <Link to="/products" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Products</Link>
                                <Link to="/consultations" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Consult Doctor</Link>
                            </>
                        )}

                        {/* Search Control */}
                        {!isHostPath && (
                            <div className="relative group flex items-center">
                                <motion.div
                                    animate={{
                                        width: isSearchOpen ? 300 : 40,
                                        backgroundColor: isSearchOpen ? 'rgba(243, 244, 246, 1)' : 'rgba(243, 244, 246, 0)'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="relative h-10 flex items-center rounded-full overflow-hidden border border-transparent focus-within:border-blue-200"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                                        className="absolute left-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors z-20 shrink-0"
                                    >
                                        {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                                    </button>
                                    <form onSubmit={handleSearch} className="flex-1">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search medicines..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className={`w-full h-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                            onFocus={() => isSearchOpen && setShowSuggestions(true)}
                                        />
                                    </form>
                                    {isLoading && isSearchOpen && (
                                        <Loader2 className="absolute right-3 h-4 w-4 text-blue-500 animate-spin" />
                                    )}
                                </motion.div>

                                {/* Suggestions Dropdown */}
                                <AnimatePresence>
                                    {showSuggestions && isSearchOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-3 w-[400px] glass-effect rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                                        >
                                            {suggestions.length > 0 ? (
                                                <>
                                                    {suggestions.map((product) => (
                                                        <button
                                                            key={product._id}
                                                            onClick={() => handleSuggestionClick(product._id)}
                                                            className="w-full flex items-center px-4 py-3 hover:bg-blue-50/50 transition text-left group"
                                                        >
                                                            <div className="h-10 w-10 bg-white rounded-lg flex-shrink-0 mr-3 border border-gray-100 flex items-center justify-center">
                                                                <img src={product.imageUrl?.url} alt="" className="max-h-8 max-w-8 object-contain" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 truncate max-w-[200px]">{product.name}</p>
                                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{product.brand}</p>
                                                            </div>
                                                            <div className="ml-auto">
                                                                <span className="text-sm font-extrabold text-blue-600">₹{product.price}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    <div className="px-4 py-2 border-t border-gray-100 mt-2 bg-gray-50/50">
                                                        <button onClick={() => handleSearch()} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
                                                            Show all results
                                                        </button>
                                                    </div>
                                                </>
                                            ) : !isLoading && (
                                                <div className="px-8 py-10 text-center">
                                                    <Search className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                                    <p className="text-sm font-bold text-gray-900">No results found</p>
                                                    <p className="text-xs text-gray-500 mt-1">Try refined keywords</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {!isHostPath && (
                                <>
                                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/user/wishlist" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative">
                                            <Heart size={20} />
                                        </Link>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/cart" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                                            <ShoppingCart size={20} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </motion.div>
                                    <div className="w-px h-6 bg-gray-200 mx-2" />
                                </>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {user?.role === 'host' ? (
                                        <Link to="/host/dashboard" className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-emerald-50 rounded-full transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold ring-2 ring-transparent group-hover:ring-emerald-100 transition-all">
                                                {user?.firstName?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter leading-none">Seller</span>
                                                <span className="text-xs font-bold text-gray-700 leading-tight">{user?.firstName}</span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to="/user/profile" className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-gray-100 rounded-full transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                                                {user?.firstName?.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{user?.firstName}</span>
                                        </Link>
                                    )}
                                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {!isHostPath && (
                            <Link to="/cart" className="relative p-2 text-gray-600">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-1.5 rounded-full">{cartCount}</span>}
                            </Link>
                        )}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-4">
                            {!isHostPath && (
                                <>
                                    <form onSubmit={handleSearch} className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search medicines..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                                    </form>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Link to="/products" className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm">
                                            Products
                                        </Link>
                                        <Link to="/consultations" className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm">
                                            Consult Doctor
                                        </Link>
                                        <Link to="/user/wishlist" className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl font-bold text-gray-800 hover:bg-red-50 hover:text-red-500 transition-all text-sm">
                                            Wishlist
                                        </Link>
                                    </div>
                                </>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                            {user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Link to="/user/profile" className="p-4 hover:bg-gray-50 rounded-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <User size={18} className="text-blue-600" /> My Profile
                                        </Link>
                                        <Link to={user?.role === 'host' ? "/host/dashboard" : "/user/dashboard"} className="p-4 hover:bg-gray-50 rounded-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <LayoutDashboard size={18} className="text-emerald-600" /> Dashboard
                                        </Link>
                                        <button onClick={logout} className="w-full p-4 hover:bg-red-50 rounded-2xl font-bold text-red-600 flex items-center gap-3 text-left">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link to="/login" className="block w-full text-center py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
