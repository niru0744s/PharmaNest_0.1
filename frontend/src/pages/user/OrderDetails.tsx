import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserSidebar from '../../components/layout/UserSidebar';
import { orderService } from '../../services/orderService';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null); // Using any for flexibility with populated fields
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails(id);
        }
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        if (!orderId) return;
        setLoading(true);
        try {
            const data = await orderService.getUserOrderDetails(orderId);
            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;
        try {
            await orderService.downloadInvoice(order._id);
        } catch (error) {
            console.error("Failed to download invoice", error);
        }
    };

    const handleCancelOrder = async () => {
        const reason = window.prompt("Please enter a reason for cancellation:");
        if (reason === null) return;

        try {
            const data = await orderService.cancelOrder(order._id, reason || "Cancelled by user");
            if (data.success) {
                toast.success("Order cancelled successfully");
                fetchOrderDetails(order._id);
            }
        } catch (error) {
            console.error("Failed to cancel order", error);
            toast.error("Failed to cancel order");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20 flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center mt-20">
                <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
                <Link to="/user/orders" className="text-emerald-500 hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    // Status Steps Logic
    const steps = [
        { status: 'pending', label: 'Confirmed', icon: FaBox },
        { status: 'shipped', label: 'Shipped', icon: FaTruck },
        { status: 'on_the_way', label: 'Out for Delivery', icon: FaTruck },
        { status: 'delivered', label: 'Delivered', icon: FaCheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);
    // If cancelled, show red
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Link to="/user/orders" className="flex items-center text-gray-500 hover:text-emerald-500 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Orders
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1 space-y-6 min-w-0">
                    {/* Header & Actions */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h1>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'on_the_way' ? 'bg-orange-100 text-orange-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                    {order.status === 'on_the_way' ? 'ON THE WAY' : order.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                            {order.status === 'pending' && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                            {order.status !== 'cancelled' && (
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                                >
                                    <FaDownload className="mr-2" /> Download Invoice
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Tracker */}
                    {!isCancelled && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="relative flex justify-between">
                                {/* Track Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-0 transform -translate-y-1/2 rounded-full transition-all duration-500"
                                    style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.status} className="relative z-10 flex flex-col items-center bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-300'}
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`mt-2 text-[10px] md:text-sm font-black uppercase tracking-tight ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-[10px] text-emerald-500 mt-1 font-black uppercase animate-pulse">Current</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center text-red-800">
                            <h3 className="font-bold mb-2">Order Cancelled</h3>
                            <p>Reason: {order.cancellationReason || 'Cancelled by user'}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-gray-800 uppercase text-xs tracking-widest">Item Details</div>
                            <div className="divide-y divide-gray-100">
                                {order.products.map((item: any) => (
                                    <div key={item._id} className="p-6 flex gap-6 hover:bg-gray-50/50 transition-colors">
                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.product?.imageUrl?.url || 'https://via.placeholder.com/80'}
                                                alt={item.product?.name}
                                                className="max-h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 text-lg leading-tight mb-2">{item.product?.name}</h4>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase text-gray-400">Unit Price</p>
                                                    <p className="font-bold text-gray-700">Rs. {item.product?.price || item.price}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase text-gray-400">Quantity</p>
                                                    <p className="font-bold text-gray-700">{item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-center">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total</p>
                                            <p className="font-black text-emerald-600 text-xl">
                                                Rs. {(item.product?.price || item.price) * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary & Address */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Delivery Address</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-lg font-black text-gray-900">{order.address.name}</p>
                                        <p className="text-gray-500 font-medium leading-relaxed mt-1">{order.address.address}</p>
                                        <p className="text-blue-600 font-bold mt-1">PIN: {order.address.pincode}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <p className="text-gray-700 font-bold">Ph: {order.address.mobileNum}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-transform hover:scale-110 duration-700" />
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Order Summary</h3>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between text-gray-600 font-bold">
                                        <span>Subtotal</span>
                                        <span>Rs. {order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-bold">
                                        <span>Shipping</span>
                                        <span className="text-emerald-500 uppercase tracking-widest text-[10px] bg-emerald-50 px-2 py-1 rounded-md">Free</span>
                                    </div>
                                    <div className="border-t-2 border-dashed border-gray-100 pt-3 mt-3 flex justify-between items-center">
                                        <span className="font-black text-gray-900 uppercase tracking-tighter">Grand Total</span>
                                        <span className="font-black text-2xl text-emerald-600 leading-none">Rs. {order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
