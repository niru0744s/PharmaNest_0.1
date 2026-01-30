import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaHeart, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : 'text-gray-600 hover:bg-gray-50';
    };

    return (
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">My Account</h3>
            </div>
            <nav className="flex flex-col py-2">
                <Link to="/user/dashboard" className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive('/user/dashboard')}`}>
                    <FaTachometerAlt className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/user/orders" className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive('/user/orders')}`}>
                    <FaBoxOpen className="w-5 h-5 mr-3" />
                    <span className="font-medium">My Orders</span>
                </Link>
                <Link to="/user/profile" className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive('/user/profile')}`}>
                    <FaUser className="w-5 h-5 mr-3" />
                    <span className="font-medium">Profile & Address</span>
                </Link>
                <Link to="/user/wishlist" className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive('/user/wishlist')}`}>
                    <FaHeart className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wishlist</span>
                </Link>
                <Link to="/my-consultations" className={`flex items-center px-6 py-3 transition-colors duration-200 ${isActive('/my-consultations')}`}>
                    <FaUser className="w-5 h-5 mr-3" />
                    <span className="font-medium">My Consultations</span>
                </Link>
                {user?.role !== 'doctor' && (
                    <Link to="/register-doctor" className={`flex items-center px-6 py-3 transition-colors duration-200 text-blue-600 hover:bg-blue-50`}>
                        <FaUser className="w-5 h-5 mr-3" />
                        <span className="font-medium">Join as Doctor</span>
                    </Link>
                )}

                <button
                    onClick={logout}
                    className="flex items-center px-6 py-3 text-red-500 hover:bg-red-50 transition-colors duration-200 w-full text-left mt-2 border-t border-gray-100"
                >
                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default UserSidebar;
