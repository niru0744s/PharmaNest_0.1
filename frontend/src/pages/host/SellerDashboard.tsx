import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import {
    TrendingUp,
    Package,
    ShoppingCart,
    AlertTriangle,
    Star,
    ArrowUpRight,
    DollarSign
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DashboardStats, SalesTrend, TopProduct } from '../../services/productService';

const SellerDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trends, setTrends] = useState<SalesTrend[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, trendsRes, topRes] = await Promise.all([
                productService.getDashboardStats(),
                productService.getSalesTrends(),
                productService.getTopProducts()
            ]);

            if (statsRes.success) setStats(statsRes.stats);
            if (trendsRes.success) setTrends(trendsRes.trends);
            if (topRes.success) setTopProducts(topRes.products);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Overview of your business performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{stats?.revenue?.toLocaleString()}</h3>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <ShoppingCart className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats?.orders}</h3>
                </div>

                {/* Products Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Package className="text-purple-600" size={24} />
                        </div>
                        <div className="flex gap-2">
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {stats?.activeProducts} Active
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{(stats?.activeProducts || 0) + (stats?.lowStockAlerts || 0)}</h3>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats?.lowStockAlerts}</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Sales Trend Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Sales Trend</h3>
                        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer outline-none">
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    tickFormatter={(str) => {
                                        const d = new Date(str);
                                        return `${d.getDate()}/${d.getMonth() + 1}`;
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                                    formatter={(value: any) => [`₹${value}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Rating Overview */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Happiness</h3>
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative mb-4">
                            <div className="h-40 w-40 rounded-full border-[12px] border-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-4xl font-black text-gray-900 block">{stats?.averageRating}</span>
                                    <span className="text-sm text-gray-400 font-bold uppercase">out of 5</span>
                                </div>
                            </div>
                            <div
                                className="absolute top-0 left-0 h-40 w-40 rounded-full border-[12px] border-yellow-400 border-t-transparent border-l-transparent -rotate-45"
                                style={{ clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 50% 100%)' }}
                            ></div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Star className="fill-yellow-400 text-yellow-400" size={20} />
                            <span>Based on {stats?.totalReviews} reviews</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Top Selling Products</h3>
                    <button
                        onClick={() => navigate('/host/inventory')}
                        className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        View All <ArrowUpRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sold</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Revenue</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <img src={product.imageUrl?.url} alt="" className="h-8 w-8 object-contain" />
                                            </div>
                                            <span className="font-bold text-gray-700">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-600">₹{product.price}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{product.soldQuantity} units</td>
                                    <td className="px-6 py-4 font-bold text-green-600">₹{(product.price * product.soldQuantity).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' :
                                            product.stockStatus === 'low_stock' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {product.stockStatus.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
