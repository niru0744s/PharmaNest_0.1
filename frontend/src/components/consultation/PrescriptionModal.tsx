import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { consultationService } from '../../services/consultationService';

interface PrescriptionModalProps {
    consultationId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PrescriptionModal = ({ consultationId, onClose, onSuccess }: PrescriptionModalProps) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
    const [loading, setLoading] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
    };

    const removeMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const updated = [...medicines];
        (updated[index] as any)[field] = value;
        setMedicines(updated);
    };

    const handleSubmit = async () => {
        if (!diagnosis) return toast.error('Diagnosis is required');
        if (medicines.some(m => !m.name)) return toast.error('Medicine names are required');

        setLoading(true);
        try {
            const response = await consultationService.createPrescription(consultationId, {
                diagnosis,
                medicines,
                advice
            });
            if (response.success) {
                toast.success('Prescription generated successfully!');
                onSuccess();
            }
        } catch (error) {
            toast.error('Failed to generate prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Generate Prescription</h2>
                        <p className="text-xs text-blue-100 font-bold opacity-80 uppercase tracking-widest mt-1">Ref ID: {consultationId.substring(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* Diagnosis */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Final Diagnosis</label>
                        <textarea
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Enter patient diagnosis..."
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Medicines */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Prescribed Medicines</label>
                            <button
                                onClick={addMedicine}
                                className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <Plus size={14} /> Add Medicine
                            </button>
                        </div>

                        <div className="space-y-4">
                            {medicines.map((med, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-3xl relative group border border-transparent hover:border-slate-200 transition-all">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input
                                            value={med.name}
                                            onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                            placeholder="Medicine Name"
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-600 outline-none transition-all"
                                        />
                                        <input
                                            value={med.dosage}
                                            onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                            placeholder="Dosage (e.g. 1-0-1)"
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            value={med.duration}
                                            onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                            placeholder="Duration (e.g. 5 days)"
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-600 outline-none transition-all"
                                        />
                                        <input
                                            value={med.instructions}
                                            onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                                            placeholder="Instructions (Optional)"
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    {medicines.length > 1 && (
                                        <button
                                            onClick={() => removeMedicine(idx)}
                                            className="absolute -top-2 -right-2 h-8 w-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advice */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Additional Advice</label>
                        <textarea
                            value={advice}
                            onChange={(e) => setAdvice(e.target.value)}
                            placeholder="Dietary advice, next steps, etc..."
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={18} /> Complete & Generate Rx
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PrescriptionModal;
