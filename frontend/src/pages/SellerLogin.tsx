import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';

const SellerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { loginHost, resendVerification } = useAuth();
    const navigate = useNavigate();
    const [verificationError, setVerificationError] = useState<{ email: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setVerificationError(null);

        try {
            await loginHost(email, password);
            toast.success('Merchant Dashboard Access Granted', {
                style: {
                    background: '#064e3b',
                    color: '#fff',
                    borderRadius: '1rem',
                },
                icon: <Sparkles className="text-emerald-400" />
            });
            navigate('/host/dashboard');
        } catch (error: any) {
            if (error.response?.status === 403 && error.response?.data?.needsVerification) {
                setVerificationError({ email: error.response.data.email });
            }
            // Error is already handled/toasted in AuthContext
            setIsLoading(false);
        }
    };

    const handleResendLink = async () => {
        if (!verificationError) return;
        setIsLoading(true);
        await resendVerification(verificationError.email, 'host');
        setIsLoading(false);
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthLayout
            theme="dark"
            title="Empower Your Pharmacy."
            subtitle="Secure merchant access to manage inventory, track wholesale orders, and connect with millions of buyers."
        >
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-emerald-900/20 border border-white/10 relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-10 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-xl shadow-emerald-900/20 mb-6 group-hover:scale-110 transition-transform duration-500 rotate-3">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-3">
                        Merchant Portal
                    </h2>
                    <p className="text-slate-400 font-medium">
                        Business accounts only. Not a seller?{' '}
                        <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                            Personal Login
                        </Link>
                    </p>
                </motion.div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-slate-500'}`}>
                            Merchant Email
                        </label>
                        <div className="relative group/input">
                            <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-slate-500'}`} size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border-2 border-white/5 rounded-[1.5rem] focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all text-white font-bold placeholder:text-slate-600"
                                placeholder="business@pharmacy.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${focusedField === 'password' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Access Key
                            </label>
                            <Link to="/forgot-password" title="forgot password" className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                                Reset Key?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-emerald-400' : 'text-slate-500'}`} size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-14 py-5 bg-white/[0.02] border-2 border-white/5 rounded-[1.5rem] focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all text-white font-bold placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors px-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 hover:-translate-y-1 disabled:opacity-50 active:scale-95 transition-all duration-300 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Enter Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {verificationError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-5 bg-white/[0.02] border border-emerald-500/10 rounded-2xl text-center"
                            >
                                <p className="text-[11px] font-medium text-slate-400 mb-3">
                                    Account activation required.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendLink}
                                    disabled={isLoading}
                                    className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 underline underline-offset-4 disabled:opacity-50 transition-colors"
                                >
                                    Resend Verification Key
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </form>

                <div className="mt-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                    <ShieldCheck className="text-emerald-500 mt-1 shrink-0" size={20} />
                    <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                        This session is encrypted with 256-bit SSL. Merchant activity is logged for security and compliance under regulated pharmaceutical guidelines.
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Don't have a merchant account?{' '}
                        <Link to="/register" className="text-emerald-400 hover:underline">Apply here</Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SellerLogin;
