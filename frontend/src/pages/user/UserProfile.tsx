import React, { useEffect, useState } from 'react';
import UserSidebar from '../../components/layout/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { addressService, Address } from '../../services/addressService';
import { FaPlus, FaTrash, FaMapMarkerAlt, FaUser, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
    const { user, setUser } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || ''
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAddress, setNewAddress] = useState<Address>({
        name: '',
        mobileNum: '',
        address: '',
        pincode: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'user') {
            fetchAddresses();
        }
        if (user) {
            setEditForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authService.updateProfile(editForm);
            if (data.success) {
                if (setUser) setUser(data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        setUploading(true);
        try {
            const data = await authService.updateProfileImage(formData);
            if (data.success) {
                if (setUser) setUser(data.user);
                toast.success('Profile picture updated');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            const fetchedAddresses = data.allAddress || data.address || data.addresses || (Array.isArray(data) ? data : []);
            setAddresses(fetchedAddresses);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addressService.addAddress(newAddress);
            setShowAddModal(false);
            setNewAddress({ name: '', mobileNum: '', address: '', pincode: '' });
            fetchAddresses();
            toast.success('Address added');
        } catch (error) {
            toast.error('Failed to add address');
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await addressService.deleteAddress(id);
                fetchAddresses();
                toast.success('Address deleted');
            } catch (error) {
                toast.error('Failed to delete address');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1 space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                        <div className="relative">
                            <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center">
                                {user?.profileImage?.url ? (
                                    <img src={user.profileImage.url} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <FaUser className="text-4xl text-slate-300" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 group-hover:rotate-12">
                                <FaCamera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>

                        <div className="text-center md:text-left flex-grow z-10">
                            <h1 className="text-3xl font-black text-slate-900 mb-1">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                                <span className={`h-2 w-2 rounded-full ${user?.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {user?.role} • {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
                            </p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaUser className="mr-2 text-emerald-500" /> Personal Information
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaEdit className="mr-2" /> Edit Info
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaTimes className="mr-2" /> Cancel
                                    </button>
                                    <button
                                        form="profile-form"
                                        type="submit"
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <FaSave className="mr-2" /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <form id="profile-form" onSubmit={handleUpdateProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={editForm.firstName}
                                            onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                            required
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium capitalize">
                                            {user?.firstName}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={editForm.lastName}
                                            onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                            required
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium capitalize">
                                            {user?.lastName}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={editForm.phoneNumber}
                                            onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                            required
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                            {user?.phoneNumber}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-400 font-medium">
                                        {user?.email}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 italic">* Email cannot be changed</p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Address Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-emerald-500" /> Saved Addresses
                            </h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                            >
                                <FaPlus className="mr-2" /> Add New
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-4">Loading addresses...</div>
                        ) : addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr: any) => (
                                    <div key={addr._id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors relative group">
                                        <button
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash />
                                        </button>
                                        <h3 className="font-bold text-gray-800 mb-1">{addr.name}</h3>
                                        <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                                        <p className="text-gray-600 text-sm mb-2">Pin: {addr.pincode}</p>
                                        <p className="text-gray-800 text-sm font-medium">Ph: {addr.mobileNum}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                No addresses saved. Add one to checkout faster!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Address</h3>
                        <form onSubmit={handleAddAddress}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        value={newAddress.name}
                                        onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        value={newAddress.mobileNum}
                                        onChange={e => setNewAddress({ ...newAddress, mobileNum: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        rows={3}
                                        value={newAddress.address}
                                        onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        value={newAddress.pincode}
                                        onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
