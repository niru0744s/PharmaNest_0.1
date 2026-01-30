import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import {
    DollarSign,
    Save,
    ArrowLeft,
    Loader2,
    TrendingDown,
    Search,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ProductUpdate {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    mainPrice: number;
    originalPrice: number;
    originalMainPrice: number;
}

const BatchPriceEditor = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [discountValue, setDiscountValue] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getHostProducts();
            if (response.success) {
                const mapped = response.products.map((p: any) => ({
                    _id: p._id,
                    name: p.name,
                    brand: p.brand,
                    category: p.category,
                    price: p.price,
                    mainPrice: p.mainPrice,
                    originalPrice: p.price,
                    originalMainPrice: p.mainPrice
                }));
                setProducts(mapped);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (id: string, field: 'price' | 'mainPrice', value: string) => {
        const numValue = parseFloat(value) || 0;
        setProducts(prev => prev.map(p =>
            p._id === id ? { ...p, [field]: numValue } : p
        ));
    };

    const applyGlobalDiscount = () => {
        const discount = parseFloat(discountValue);
        if (isNaN(discount) || discount <= 0 || discount >= 100) {
            toast.error('Please enter a valid discount percentage (1-99)');
            return;
        }

        setProducts(prev => prev.map(p => {
            const newPrice = Math.round(p.mainPrice * (1 - discount / 100));
            return { ...p, price: newPrice };
        }));
        toast.success(`Applied ${discount}% discount to all items!`);
    };

    const handleSave = async () => {
        const updates = products
            .filter(p => p.price !== p.originalPrice || p.mainPrice !== p.originalMainPrice)
            .map(p => ({
                id: p._id,
                price: p.price,
                mainPrice: p.mainPrice
            }));

        if (updates.length === 0) {
            toast.error('No changes to save');
            return;
        }

        setSaving(true);
        try {
            const response = await productService.updateBulkPrices(updates);
            if (response.success) {
                toast.success(`Successfully updated ${updates.length} products!`);
                loadProducts();
            }
        } catch (error) {
            toast.error('Failed to update prices');
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasChanges = products.some(p => p.price !== p.originalPrice || p.mainPrice !== p.originalMainPrice);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold">Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => navigate('/host/bulk-operations')}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold mb-2 transition"
                    >
                        <ArrowLeft size={18} />
                        Back to Bulk Operations
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Batch Price Editor</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tools Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-gray-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                    />
                </div>

                {/* Global Discount */}
                <div className="lg:col-span-2 flex items-center gap-4 bg-blue-50/50 p-2 rounded-2xl border border-blue-100">
                    <div className="bg-blue-600 text-white p-2 rounded-xl">
                        <TrendingDown size={20} />
                    </div>
                    <div className="flex-grow">
                        <p className="text-xs font-bold text-blue-600 uppercase">Global Discount Tool</p>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="number"
                                placeholder="Enter percentage..."
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                className="flex-grow bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={applyGlobalDiscount}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                            >
                                Apply to All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Editor Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Product Information</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">MRP / Base (₹)</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Selling Price (₹)</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Margin / Discount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p) => {
                                const discount = Math.round(((p.mainPrice - p.price) / p.mainPrice) * 100);
                                return (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{p.name}</div>
                                            <div className="text-xs text-gray-500 font-medium">{p.brand} • {p.category}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative max-w-[120px]">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                                <input
                                                    type="number"
                                                    value={p.mainPrice}
                                                    onChange={(e) => handlePriceChange(p._id, 'mainPrice', e.target.value)}
                                                    className={`w-full pl-8 pr-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold transition-all outline-none ${p.mainPrice !== p.originalMainPrice ? 'border-amber-500 bg-amber-50' : 'border-transparent'
                                                        }`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative max-w-[120px]">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                                <input
                                                    type="number"
                                                    value={p.price}
                                                    onChange={(e) => handlePriceChange(p._id, 'price', e.target.value)}
                                                    className={`w-full pl-8 pr-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold transition-all outline-none ${p.price !== p.originalPrice ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                                                        }`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-black px-2 py-1 rounded-full ${discount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {discount}% OFF
                                                </span>
                                                {p.price > p.mainPrice && (
                                                    <div title="Selling price is higher than MRP">
                                                        <AlertCircle className="text-red-500" size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-gray-400 font-medium">No products found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Legend / Info */}
            <div className="mt-8 flex items-center gap-6 text-sm font-medium text-gray-500 px-6">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span>Changed Selling Price</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    <span>Changed MRP/Base</span>
                </div>
            </div>
        </div>
    );
};

export default BatchPriceEditor;
