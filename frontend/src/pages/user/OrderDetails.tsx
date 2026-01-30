import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserSidebar from '../../components/layout/UserSidebar';
import { orderService } from '../../services/orderService';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaDownload } from 'react-icons/fa';

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
        try {
            const data = await orderService.getOrderDetails(orderId);
            setOrder(data.order);
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20 flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
                <Link to="/user/orders" className="text-emerald-500 hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    // Status Steps Logic
    const steps = [
        { status: 'processing', label: 'Processing', icon: FaBox },
        { status: 'shipped', label: 'Shipped', icon: FaTruck },
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
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        {order.status !== 'cancelled' && (
                            <button
                                onClick={handleDownloadInvoice}
                                className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                                <FaDownload className="mr-2" /> Download Invoice
                            </button>
                        )}
                    </div>

                    {/* Status Tracker */}
                    {!isCancelled && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="relative flex justify-between">
                                {/* Track Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-0 transform -translate-y-1/2 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
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
                                            <span className={`mt-2 text-sm font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-xs text-emerald-500 mt-1 font-semibold animate-pulse">Current</span>
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
                            <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Item Details</div>
                            <div className="divide-y divide-gray-100">
                                {order.products.map((item: any) => (
                                    <div key={item._id} className="p-4 flex gap-4">
                                        <img
                                            src={item.product?.imageUrl?.url || 'https://via.placeholder.com/80'}
                                            alt={item.product?.name}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.product?.name}</h4>
                                            <p className="text-sm text-gray-500">Unit Price: Rs. {item.price}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-gray-800">
                                            Rs. {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary & Address */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Delivery Address</h3>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p className="font-medium text-gray-800">{order.address.name}</p>
                                    <p>{order.address.address}</p>
                                    <p>PIN: {order.address.pincode}</p>
                                    <p className="mt-2 flex items-center">
                                        <span className="font-medium">Phone:</span> {order.address.mobileNum}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>Rs. {order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-800">
                                        <span>Total</span>
                                        <span>Rs. {order.totalAmount}</span>
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
