import { useState, useRef } from 'react';
import { productService } from '../../services/productService';
import { Upload, FileText, CheckCircle2, RefreshCcw, DollarSign, ArrowLeft, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BulkOperations = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
                setUploadSuccess(null);
            } else {
                toast.error('Please upload a CSV file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const response = await productService.uploadBulkProducts(file);
            if (response.success) {
                toast.success(`Successfully uploaded ${response.count} products!`);
                setUploadSuccess(response.count);
                setFile(null);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const message = error.response?.data?.message || 'Upload failed. Check your CSV format.';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = 'name,brand,form,strength,category,price,mainPrice,quantity,sku,description,imageUrl\n';
        const sampleRows = 'Paracetamol 500mg,Dolo,Tablet,500mg,Medicine,30,40,100,SKU-DOLO-500,Pain reliever and fever reducer,\n';
        const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PharmaNest_Bulk_Template.csv';
        a.click();
    };

    return (
        <div className="space-y-10">
            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate('/host/inventory')}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold mb-8 transition"
                >
                    <ArrowLeft size={18} />
                    Back to Inventory
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Bulk Operations</h1>
                    <p className="text-gray-500">Fast-track your business by managing hundreds of products at once</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* CSV Upload Section */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                            <FileText size={120} />
                        </div>

                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Upload size={28} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Product Import</h2>
                        <p className="text-sm text-gray-500 mb-8">Upload a CSV file to add new products to your catalogue in seconds.</p>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".csv"
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <CheckCircle2 className="text-blue-600 mb-2" size={32} />
                                    <p className="font-bold text-gray-900 truncate max-w-full">{file.name}</p>
                                    <p className="text-xs text-blue-500 font-bold uppercase mt-1">Ready to upload</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Upload className="mb-2" size={32} />
                                    <p className="font-medium">Drop your CSV here</p>
                                    <p className="text-xs text-gray-400">or click to browse</p>
                                </div>
                            )}
                        </div>

                        {uploadSuccess && (
                            <div className="mt-4 p-4 bg-green-50 rounded-xl flex items-center gap-3 text-green-700">
                                <CheckCircle2 size={20} />
                                <p className="text-sm font-bold">Successfully imported {uploadSuccess} products!</p>
                            </div>
                        )}

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : 'Start Import'}
                            </button>
                            <button
                                onClick={downloadTemplate}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                                title="Download Template"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Batch Price Editor */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                            <DollarSign size={120} />
                        </div>

                        <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                            <RefreshCcw size={28} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Price Editor</h2>
                        <p className="text-sm text-gray-500 mb-8">Quickly update prices for multiple products without opening individual pages.</p>

                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <DollarSign className="text-amber-500 mb-2" size={32} />
                            <p className="font-bold text-gray-900">Live Editor</p>
                            <p className="text-xs text-amber-600 font-bold uppercase">Ready for rapid updates</p>
                        </div>

                        <button
                            onClick={() => navigate('/host/batch-price-edit')}
                            className="mt-8 w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                        >
                            Open Batch Editor
                        </button>
                    </div>

                </div>

                {/* Instructions */}
                <div className="mt-12 bg-blue-600 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl shadow-blue-100">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6">Tips for a Perfect Import</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-bold text-blue-100 mb-2">1. Required Fields</h4>
                                <p className="text-sm opacity-90">Ensure `name`, `brand`, and `price` are always present. Use full category names like `Medicine`.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-100 mb-2">2. SKU Format</h4>
                                <p className="text-sm opacity-90">SKUs must be unique. If left blank, we'll generate professional internal SKUs for you.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-100 mb-2">3. Price Check</h4>
                                <p className="text-sm opacity-90">Set `mainPrice` higher than `price` to show beautiful discount percentage badges automatically.</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-blue-500/30 rounded-full blur-3xl"></div>
                </div>

            </div>
        </div>
    );
};

export default BulkOperations;
