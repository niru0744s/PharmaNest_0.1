import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    UploadCloud,
    ShoppingBag,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HostSidebar: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/host/dashboard',
            icon: <LayoutDashboard size={20} />
        },
        {
            title: 'Orders',
            path: '/host/orders',
            icon: <ShoppingBag size={20} />
        },
        {
            title: 'Add Product',
            path: '/host/add-product',
            icon: <PlusCircle size={20} />
        },
        {
            title: 'Bulk Upload',
            path: '/host/bulk-operations',
            icon: <UploadCloud size={20} />
        }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-64px)] fixed left-0 top-16 z-20 overflow-y-auto">
            <div className="flex-grow py-6 px-4">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default HostSidebar;
