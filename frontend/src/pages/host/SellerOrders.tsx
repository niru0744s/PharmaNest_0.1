import { useState, useEffect } from 'react';
import { orderService, Order } from '../../services/orderService';
import {
    ShoppingBag,
    Search,
    Clock,
    CheckCircle2,
    Package,
    Truck,
    XCircle,
    Eye,
    MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import OrderDetailsModal from './OrderDetailsModal';

const SellerOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getSellerOrders({
                status: statusFilter === 'all' ? undefined : statusFilter
            });
            if (response.success) {
                setOrders(response.orders);
                setStats(response.stats);
            }
        } catch (error) {
            console.error('Failed to load orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'on_the_way': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'shipped': return <Package size={14} />;
            case 'on_the_way': return <Truck size={14} />;
            case 'delivered': return <CheckCircle2 size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="text-blue-600" size={32} />
                        Order Management
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders for your products</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Orders', value: stats?.total || 0, color: 'blue' },
                    { label: 'Pending', value: stats?.pending || 0, color: 'amber' },
                    { label: 'Shipped', value: stats?.shipped || 0, color: 'indigo' },
                    { label: 'Delivered', value: stats?.delivered || 0, color: 'green' },
                    { label: 'Cancelled', value: stats?.cancelled || 0, color: 'red' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <span className="text-xs font-bold text-gray-400 uppercase mr-2 flex-shrink-0">Filter:</span>
                    {['all', 'pending', 'shipped', 'on_the_way', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Order Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Items</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-500 font-bold">Fetching your orders...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <p className="text-gray-500 font-bold">No orders found</p>
                                        <p className="text-xs text-gray-400 mt-1">When customers buy your products, they'll appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    (() => {
                                        const customerName = order.user
                                            ? `${order.user.firstName} ${order.user.lastName}`.trim()
                                            : 'Deleted user';
                                        const customerEmail = order.user?.email || 'No email available';

                                        return (
                                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-xs">
                                                    #{order._id.slice(-8)}
                                                </span>
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                                    <Clock size={10} />
                                                    {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-sm">
                                                    {customerName}
                                                </span>
                                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                    {customerEmail}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {order.products.slice(0, 3).map((p, idx) => (
                                                    <div key={idx} className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center p-1 shadow-sm ring-2 ring-white overflow-hidden">
                                                        <img src={p.product?.imageUrl?.url || '/medicine-placeholder.png'} alt="" className="object-contain" />
                                                    </div>
                                                ))}
                                                {order.products.length > 3 && (
                                                    <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 ring-2 ring-white">
                                                        +{order.products.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-900 text-sm">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="h-9 w-9 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button className="h-9 w-9 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all shadow-sm">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                        );
                                    })()
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={() => {
                        setSelectedOrder(null);
                        loadOrders();
                    }}
                />
            )}
        </div>
    );
};

export default SellerOrders;
