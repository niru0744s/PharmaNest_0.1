import React, { useEffect, useState } from 'react';
import UserSidebar from '../../components/layout/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { wishlistService } from '../../services/wishlistService';
import { FaBox, FaShoppingBag, FaUserCheck, FaExclamationTriangle, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        wishlistItems: 0,
        savedAddresses: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            if (user.role === 'doctor') {
                // For now, doctors can see the dashboard or we could redirect
                // But we must stop loading
                setLoading(false);
                return;
            }

            if (user.role !== 'user') {
                setLoading(false);
                return;
            }
            try {
                const [ordersResponse, addressResponse, wishlistRes] = await Promise.all([
                    orderService.getMyOrders(),
                    addressService.getAddresses(),
                    wishlistService.getWishlist()
                ]);

                const orders = ordersResponse.orders || [];
                const addresses = addressResponse.allAddress || addressResponse.address || [];

                setStats({
                    totalOrders: orders.length,
                    pendingOrders: orders.filter((o: any) => o.status === 'processing' || o.status === 'pending').length,
                    wishlistItems: wishlistRes.wishlist?.length || 0,
                    savedAddresses: addresses.length
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Hello, {user?.firstName}! 👋
                            </h1>
                            <p className="text-gray-500">
                                Welcome back to your account. Here's what's happening with your orders.
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-50 rounded-l-full opacity-50 transform translate-x-10"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-4 bg-blue-50 text-blue-500 rounded-full mr-4">
                                <FaShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-4 bg-orange-50 text-orange-500 rounded-full mr-4">
                                <FaBox className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Pending Orders</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                            </div>
                        </div>

                        <Link to="/user/wishlist" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow group">
                            <div className="p-4 bg-red-50 text-red-500 rounded-full mr-4 group-hover:bg-red-100 transition-colors">
                                <FaHeart className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Wishlist Items</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.wishlistItems}</p>
                            </div>
                        </Link>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-4 bg-purple-50 text-purple-500 rounded-full mr-4">
                                <FaMapMarkerAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Saved Addresses</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.savedAddresses}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className={`p-4 rounded-full mr-4 ${user?.isVerified ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                {user?.isVerified ? <FaUserCheck className="w-6 h-6" /> : <FaExclamationTriangle className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Account Status</p>
                                <p className={`text-lg font-bold ${user?.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                                    {user?.isVerified ? 'Verified' : 'Unverified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Preview */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Recent Orders</h3>
                            <Link to="/user/orders" className="text-emerald-500 hover:text-emerald-600 text-sm font-medium">
                                View All
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Order ID</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Total</th>
                                            <th className="px-6 py-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    Rs. {order.totalAmount}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <Link to={`/user/orders/${order._id}`} className="text-emerald-500 hover:text-emerald-700 font-medium">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>No orders yet. Start shopping!</p>
                                <Link to="/" className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                    Browse Products
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
