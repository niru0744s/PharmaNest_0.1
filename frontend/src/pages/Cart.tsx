import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

const Cart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                        alt="Empty Cart"
                        className="w-40 h-40 mx-auto mb-6 opacity-80"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/products"
                        className="block w-full py-3 px-6 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/products" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-emerald-500">
                        <FaArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Shopping Cart <span className="text-sm font-normal text-gray-500">({cartCount} items)</span></h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                <div className="flex gap-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                                                <p className="text-emerald-600 font-bold mb-2">Rs. {item.price}</p>

                                                {/* Stock Status Badge */}
                                                {item.maxQuantity < 10 && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-md">
                                                        <FaExclamationTriangle className="mr-1" /> Only {item.maxQuantity} left
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                    >
                                                        <FaMinus size={10} />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                    >
                                                        <FaPlus size={10} />
                                                    </button>
                                                </div>
                                                <button className="text-gray-400 hover:text-pink-500 text-sm flex items-center gap-1 transition-colors">
                                                    <FaHeart /> <span className="hidden sm:inline">Save for later</span>
                                                </button>
                                            </div>
                                            <p className="font-bold text-gray-800 text-lg">Rs. {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-3 text-gray-600 text-sm mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs. {cartTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Estimate</span>
                                    <span>Rs. {(cartTotal * 0.18).toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-800">Order Total</span>
                                <span className="text-2xl font-bold text-emerald-600">Rs. {cartTotal + Number((cartTotal * 0.18).toFixed(0))}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all transform hover:scale-[1.02] shadow-lg mb-4"
                            >
                                Checkout
                            </button>

                            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
