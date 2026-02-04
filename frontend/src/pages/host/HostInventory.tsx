import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../types/product';
import { Package, AlertTriangle, CheckCircle, Search, Edit3, Trash2, Plus, ArrowUpRight, BarChart3, Package2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HostInventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const response = await productService.getHostProducts();
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            console.error('Inventory load error:', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await productService.deleteProduct(id);
            if (response.success) {
                toast.success('Product deleted successfully');
                loadInventory();
            } else {
                toast.error(response.message || 'Failed to delete product');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'out_of_stock':
                return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={12} /> Out of Stock</span>;
            case 'low_stock':
                return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={12} /> Low Stock</span>;
            default:
                return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> In Stock</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your inventory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Package2 className="text-blue-600" size={32} />
                        Inventory Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your medicine stock and product listings</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/host/bulk-operations')}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
                    >
                        <BarChart3 size={18} />
                        Bulk Operations
                    </button>
                    <button
                        onClick={() => navigate('/host/add-product')}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, SKU or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Total Products</p>
                        <p className="text-xl font-bold text-gray-900">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Low Stock Alerts</p>
                        <p className="text-xl font-bold text-gray-900">
                            {products.filter(p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">SKU</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">In Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <p className="text-gray-400">No products found matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    <img
                                                        src={p.imageUrl?.url || '/medicine-placeholder.png'}
                                                        alt=""
                                                        className="max-h-10 max-w-10 object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{p.name}</p>
                                                    <p className="text-xs text-gray-400">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                {p.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                {p.sku || 'N/A'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(p.stockStatus || 'in_stock')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <p className={`font-bold ${p.quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {p.quantity}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Units</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-bold text-gray-900">₹{p.price}</p>
                                            {p.mainPrice > p.price && (
                                                <p className="text-xs line-through text-gray-400">₹{p.mainPrice}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/host/edit-product/${p._id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    title="Edit Product"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                                                            handleDelete(p._id);
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/products/${p._id}`)}
                                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                                                    title="View Public Page"
                                                >
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HostInventory;
