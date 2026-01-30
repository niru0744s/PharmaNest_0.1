import { useState } from 'react';
import { productService } from '../../services/productService';
import {
    DollarSign,
    Layers,
    FileText,
    Plus,
    Image as ImageIcon,
    Save,
    X,
    TrendingDown,
    Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const categories = [
    "Medicine",
    "OTC_Medicine",
    "First_Aid",
    "Hygiene",
    "Baby_product",
    "Supplements",
    "Test_kits"
];

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        form: '',
        strength: '',
        category: 'Medicine',
        mainPrice: '',
        price: '',
        description: '',
        quantity: '',
        composition: '',
        manufacturer: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error('Please upload a product image');
            return;
        }

        setLoading(true);
        const data = new FormData();

        // Append all text fields
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        // Append image
        data.append('imageUrl', imageFile);

        try {
            const response = await productService.addProduct(data);
            if (response.success) {
                toast.success('Product added successfully!');
                navigate('/host/inventory');
            } else {
                toast.error(response.message || 'Failed to add product');
            }
        } catch (error: any) {
            console.error('Add product error:', error);
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Add New Product</h1>
                    <p className="text-gray-500 mt-1">List a new medicine or healthcare product to your store</p>
                </div>
                <button
                    onClick={() => navigate('/host/inventory')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 text-blue-600">
                            <FileText size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Paracetamol 500mg"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Brand / Manufacturer</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        required
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. GSK"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Form</label>
                                    <input
                                        type="text"
                                        name="form"
                                        required
                                        value={formData.form}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Tablet, Syrup"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Strength</label>
                                    <input
                                        type="text"
                                        name="strength"
                                        required
                                        value={formData.strength}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 500mg"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Details */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 text-purple-600">
                            <Activity size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Description & Composition</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What is this medicine used for?"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Composition (Active Ingredients)</label>
                                <input
                                    type="text"
                                    name="composition"
                                    value={formData.composition}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Paracetamol, Caffeine"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Image */}
                <div className="space-y-8">
                    {/* Image Upload */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 text-amber-600">
                            <ImageIcon size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
                        </div>

                        <div
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${imagePreview ? 'border-blue-500' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                        >
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-6 text-gray-400">
                                    <Plus size={32} className="mx-auto mb-2" />
                                    <span className="text-xs font-bold uppercase">Upload Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 text-green-600">
                            <DollarSign size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">MRP / Before Discount (₹)</label>
                                <div className="relative">
                                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="mainPrice"
                                        required
                                        value={formData.mainPrice}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Available Quantity</label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="quantity"
                                        required
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transform transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <>
                                <Save size={24} />
                                Publish Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
