import React, { useEffect, useState } from 'react';
import UserSidebar from '../../components/layout/UserSidebar';
import { orderService, Order } from '../../services/orderService';
import { FaBoxOpen, FaDownload, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            // Assuming data.orders is the array
            const orderList = data.orders || [];
            setOrders(orderList);
            setFilteredOrders(orderList);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = orders;

        // Filter by tab
        if (activeTab !== 'all') {
            result = result.filter(order => order.status === activeTab);
        }

        // Filter by search (Order ID or Product Name)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(order =>
                order._id.toLowerCase().includes(lowerTerm) ||
                order.products.some((p: any) => p.product.name.toLowerCase().includes(lowerTerm))
            );
        }

        setFilteredOrders(result);
    }, [activeTab, searchTerm, orders]);

    const handleDownloadInvoice = async (orderId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await orderService.downloadInvoice(orderId);
        } catch (error) {
            console.error("Failed to download invoice", error);
            alert("Failed to download invoice. Please try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1 space-y-6 min-w-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaBoxOpen className="mr-2 text-emerald-500" /> My Orders
                            </h2>
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or Product"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 mb-6 overflow-x-auto">
                            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 
                                        ${activeTab === tab
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                                        <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-50 pb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Order Placed</p>
                                                <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                                <p className="font-medium text-gray-800">Rs. {order.totalAmount}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                                <p className="font-medium text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 items-center">
                                            {/* Product Previews */}
                                            <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
                                                {order.products.slice(0, 3).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3 min-w-[200px]">
                                                        <img
                                                            src={item.product?.imageUrl?.url || 'https://via.placeholder.com/80'}
                                                            alt={item.product?.name}
                                                            className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.products.length > 3 && (
                                                    <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-md text-gray-500 text-xs font-medium">
                                                        +{order.products.length - 3} more
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                                                <Link
                                                    to={`/user/orders/${order._id}`}
                                                    className="flex-1 md:flex-none px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium text-center"
                                                >
                                                    View Details
                                                </Link>
                                                {order.status !== 'cancelled' && (
                                                    <button
                                                        onClick={(e) => handleDownloadInvoice(order._id, e)}
                                                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                                                    >
                                                        <FaDownload className="mr-2" /> Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <FaBoxOpen className="text-gray-400 w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                                <Link to="/" className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
