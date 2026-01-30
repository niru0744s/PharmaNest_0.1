import { useState } from 'react';
import { Order, orderService } from '../../services/orderService';
import {
    X,
    User,
    Phone,
    MapPin,
    Package,
    Truck,
    CheckCircle2,
    Loader2,
    ShoppingBag,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onStatusUpdate: () => void;
}

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) => {
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState<any>(order.status);
    const [notes, setNotes] = useState('');
    const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await orderService.updateOrderStatus(order._id, {
                status,
                notes,
                trackingNumber
            });
            if (response.success) {
                toast.success('Order status updated successfully');
                onStatusUpdate();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStep = (s: string) => {
        const statuses = ['pending', 'shipped', 'on_the_way', 'delivered'];
        return statuses.indexOf(s);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Order #{order._id.slice(-8)}</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                Placed on {format(new Date(order.createdAt), 'PPP p')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Order Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Products Table */}
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Package size={16} className="text-blue-600" />
                                    Order Items
                                </h3>
                                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 font-bold text-gray-400">Product</th>
                                                <th className="px-4 py-3 font-bold text-gray-400 text-center">Qty</th>
                                                <th className="px-4 py-3 font-bold text-gray-400 text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.products.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 flex items-center gap-3">
                                                        <div className="h-10 w-10 flex-shrink-0 bg-white rounded-lg border border-gray-200 p-1 flex items-center justify-center">
                                                            <img src={p.product?.imageUrl?.url || '/medicine-placeholder.png'} alt="" className="max-h-8 object-contain" />
                                                        </div>
                                                        <span className="font-bold text-gray-700">{p.product?.name}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold text-gray-500">{p.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-black text-gray-900">₹{p.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-white">
                                                <td colSpan={2} className="px-4 py-4 text-right font-bold text-gray-500">Total Amount</td>
                                                <td className="px-4 py-4 text-right font-black text-blue-600 text-lg">₹{order.totalAmount}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Tracking Progress */}
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Delivery Progress</h3>
                                <div className="flex items-center justify-between relative px-4">
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                                        style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                                    ></div>
                                    {[
                                        { s: 'pending', icon: <Clock size={16} /> },
                                        { s: 'shipped', icon: <Package size={16} /> },
                                        { s: 'on_the_way', icon: <Truck size={16} /> },
                                        { s: 'delivered', icon: <CheckCircle2 size={16} /> }
                                    ].map((step, idx) => (
                                        <div key={step.s} className="relative z-10 flex flex-col items-center">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 transition-all ${getStatusStep(order.status) >= idx
                                                ? 'bg-blue-600 border-blue-100 text-white'
                                                : 'bg-white border-gray-100 text-gray-300'
                                                }`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase mt-2 tracking-tighter ${getStatusStep(order.status) >= idx ? 'text-blue-600' : 'text-gray-300'
                                                }`}>
                                                {step.s.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customer & Status Update */}
                        <div className="space-y-8">
                            {/* Customer Info */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Customer Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-xl text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Name</p>
                                            <p className="font-bold text-gray-700">{order.user.firstName} {order.user.lastName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-xl text-blue-600">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                            <p className="font-bold text-gray-700">{order.user.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-xl text-blue-600">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Shipping Address</p>
                                            <p className="text-sm font-bold text-gray-600 leading-relaxed">
                                                {order.address.address}, {order.address.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update Form */}
                            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Update Status</h3>
                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase opacity-60 block mb-1">New Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full bg-blue-700 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="on_the_way">On the Way</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    {['shipped', 'on_the_way'].includes(status) && (
                                        <div>
                                            <label className="text-[10px] font-black uppercase opacity-60 block mb-1">Tracking ID</label>
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="e.g. TRK472819"
                                                className="w-full bg-blue-700 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black uppercase opacity-60 block mb-1">Internal Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add a note to customer..."
                                            rows={2}
                                            className="w-full bg-blue-700 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updating || status === order.status}
                                        className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {updating ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
