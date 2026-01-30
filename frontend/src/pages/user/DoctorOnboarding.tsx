import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { consultationService } from '../../services/consultationService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const DoctorOnboarding = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        specialization: '',
        experience: '',
        licenseNumber: '',
        consultationFees: '',
        bio: '',
    });

    // Handle redirection if already a doctor
    useEffect(() => {
        if (user?.role === 'doctor') {
            navigate('/my-consultations');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await consultationService.registerDoctor({
                ...formData,
                experience: Number(formData.experience),
                consultationFees: Number(formData.consultationFees),
            });
            if (response.success) {
                toast.success('Doctor profile created successfully!');
                // Update local user role to doctor
                if (user) {
                    setUser({ ...user, role: 'doctor' });
                }
                navigate('/my-consultations');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-20 w-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200"
                    >
                        <Stethoscope size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Join Our <span className="text-blue-600">Medical Network</span></h1>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto">
                        Help millions of patients get quality healthcare while growing your practice digitally.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Benefits Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <BenefitCard
                            icon={Award}
                            title="Global Recognition"
                            desc="Get verified and build your reputation."
                        />
                        <BenefitCard
                            icon={ShieldCheck}
                            title="Secure & Private"
                            desc="Encrypted calls and HIPAA ready."
                        />
                        <BenefitCard
                            icon={CheckCircle}
                            title="Flexible Hours"
                            desc="Consult at your own convenience."
                        />
                    </div>

                    {/* Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Specialization</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Cardiologist"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 underline-none outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Experience (Years)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="Years of practice"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 underline-none outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">License Number</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Medical ID"
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 underline-none outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Consultation Fee ($)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="Per session fee"
                                        value={formData.consultationFees}
                                        onChange={(e) => setFormData({ ...formData, consultationFees: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 underline-none outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Professional Bio</label>
                                <textarea
                                    required
                                    placeholder="Tell us about your medical background..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 underline-none outline-none resize-none"
                                    rows={4}
                                />
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Registering...' : (
                                    <>
                                        Finish Registration <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const BenefitCard = ({ icon: Icon, title, desc }: any) => (
    <div className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm flex items-start gap-4">
        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Icon size={20} />
        </div>
        <div>
            <h4 className="text-sm font-black text-slate-900 mb-1">{title}</h4>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default DoctorOnboarding;
