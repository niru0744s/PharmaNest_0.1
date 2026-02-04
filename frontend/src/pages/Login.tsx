import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Store, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { login, resendVerification } = useAuth();
    const navigate = useNavigate();
    const [verificationError, setVerificationError] = useState<{ email: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setVerificationError(null);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error: any) {
            if (error.response?.status === 403 && error.response?.data?.needsVerification) {
                setVerificationError({ email: error.response.data.email });
            }
            setIsLoading(false);
        }
    };

    const handleResendLink = async () => {
        if (!verificationError) return;
        setIsLoading(true);
        await resendVerification(verificationError.email, 'user');
        setIsLoading(false);
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthLayout
            title="Your Health, Our Priority."
            subtitle="Sign in to access your prescriptions, health records, and premium healthcare services."
        >
            <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-blue-900/10 border border-white/60 relative overflow-hidden group">
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <LogIn size={28} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
                            Join PharmaNest
                        </Link>
                    </p>
                </motion.div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`}>
                            Email Address
                        </label>
                        <div className="relative group/input">
                            <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/50 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300"
                                placeholder="your@email.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`}>
                                Password
                            </label>
                            <Link to="/forgot-password" title="forgot password" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-14 py-5 bg-white/50 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors px-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 disabled:bg-blue-300 active:scale-95 transition-all duration-300 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {verificationError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-center"
                            >
                                <p className="text-xs font-bold text-orange-700 mb-3">
                                    Email verification required to access your account.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendLink}
                                    disabled={isLoading}
                                    className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 underline underline-offset-4 disabled:opacity-50"
                                >
                                    Resend Verification Link
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </form>

                {/* Divider */}
                <div className="my-10 flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">Trusted Access</span>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Seller Link Section */}
                <Link
                    to="/host-login"
                    className="w-full py-5 px-6 border-2 border-slate-100 rounded-[1.5rem] flex items-center gap-4 group/seller hover:border-emerald-500/20 hover:bg-emerald-50/50 transition-all duration-300"
                >
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover/seller:scale-110 transition-transform">
                        <Store size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/seller:text-emerald-600">Are you a merchant?</p>
                        <p className="text-sm font-bold text-slate-700">Go to Seller Portal</p>
                    </div>
                    <ShieldCheck size={18} className="ml-auto text-emerald-500/50" />
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
