import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { addressService, Address } from '../services/addressService';
import { paymentService } from '../services/paymentService';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const Checkout: React.FC = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const taxAmount = Number((cartTotal * 0.18).toFixed(0));
    const finalAmount = cartTotal + taxAmount;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
        fetchAddresses();
    }, [cartItems, navigate]);

    const fetchAddresses = async () => {
        try {
            const response = await addressService.getAddresses();
            const fetchedAddresses = response.allAddress || response.address || response.addresses || (Array.isArray(response) ? response : []);
            setAddresses(fetchedAddresses);
            if (fetchedAddresses.length > 0) {
                setSelectedAddressId(fetchedAddresses[0]._id!);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
            toast.error("Could not load your addresses");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        setIsProcessing(true);
        try {
            // Step 1: Create Order in Backend
            console.log("Cart Items at Checkout:", cartItems);
            const checkoutData = {
                products: cartItems.map(item => ({
                    product: item._id || (item as any).id,
                    quantity: item.quantity
                })),
                addressId: selectedAddressId,
                totalAmount: finalAmount
            };
            console.log("Checkout Payload:", checkoutData);

            const response = await paymentService.checkout(checkoutData);

            if (response.success) {
                const { razorpayOrder, order } = response;

                // Step 2: Initialize Razorpay
                const options = {
                    key: razorpayOrder.key,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: 'PharmaNest',
                    description: 'Purchase of health essentials',
                    order_id: razorpayOrder.id,
                    handler: async (response: any) => {
                        try {
                            // Step 3: Verify Payment
                            const verificationData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order._id
                            };

                            const verifyRes = await paymentService.verifyPayment(verificationData);
                            if (verifyRes.success) {
                                toast.success("Order placed successfully!");
                                clearCart();
                                navigate('/user/orders');
                            } else {
                                toast.error("Payment verification failed");
                            }
                        } catch (error) {
                            console.error("Verification error", error);
                            toast.error("An error occurred during verification");
                        }
                    },
                    prefill: {
                        name: '', // Will be filled by backend/user session anyway
                        email: '',
                        contact: ''
                    },
                    theme: {
                        color: "#2563eb" // blue-600
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error(response.message || "Checkout failed");
            }
        } catch (error: any) {
            console.error("Checkout error", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 mt-4 flex items-center">
                    <FaShieldAlt className="mr-3 text-blue-600" /> Secure Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Addressing */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-red-500" /> Delivery Address
                            </h2>

                            {addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr._id}
                                            className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr._id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-100 hover:border-blue-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                className="hidden"
                                                checked={selectedAddressId === addr._id}
                                                onChange={() => setSelectedAddressId(addr._id!)}
                                            />
                                            <span className="font-bold text-gray-800">{addr.name}</span>
                                            <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                            <p className="text-sm text-gray-600">Ph: {addr.mobileNum} | Pin: {addr.pincode}</p>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => navigate('/user/profile')}
                                        className="text-blue-600 text-sm font-semibold hover:underline"
                                    >
                                        + Add new address
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 mb-4">No addresses found</p>
                                    <button
                                        onClick={() => navigate('/user/profile')}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaCreditCard className="mr-2 text-blue-600" /> Payment Method
                            </h2>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center">
                                <span className="p-2 bg-white rounded-lg shadow-sm mr-4">
                                    <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-6 h-6" />
                                </span>
                                <div>
                                    <p className="font-bold text-gray-800">Razorpay Secure</p>
                                    <p className="text-xs text-gray-500 text-nowrap">UPI, Cards, NetBanking, Wallets</p>
                                </div>
                                <div className="ml-auto text-blue-600">
                                    <FaShieldAlt />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaShoppingBag className="mr-2 text-emerald-500" /> Order Summary
                            </h2>

                            <div className="max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 mb-4 pb-4 border-b border-gray-50">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                                            <img src={item.imageUrl} alt="" className="max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-800">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold text-nowrap">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>GST (18%)</span>
                                    <span>₹{taxAmount}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Amount Payable</span>
                                    <span className="text-2xl font-black text-blue-600">₹{finalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || addresses.length === 0}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg ${isProcessing || addresses.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-blue-100'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${finalAmount}`
                                )}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-4">
                                By clicking Pay, you agree to PharmaNest's Terms and Conditions.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
