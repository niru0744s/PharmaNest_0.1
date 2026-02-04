import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, UserPlus, UserCircle, Store, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import AuthLayout from '../components/layout/AuthLayout';
import PasswordStrengthChecker from '../components/shared/PasswordStrengthChecker';
import { authService } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'user' as 'user' | 'host'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [resending, setResending] = useState(false);
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);

    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role: 'user' | 'host') => {
        setFormData({ ...formData, role });
    };

    const handleResend = async () => {
        if (!formData.email) return;
        setResending(true);
        try {
            await authService.resendVerification(formData.email, formData.role === 'host' ? 'Host' : 'User');
            toast.success('Verification email sent!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
            setIsRegistered(true);
            toast.success('Registration successful!', { duration: 4000 });
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthLayout
            title="Join the Future of Health."
            subtitle="Secure your account to enjoy personalized health insights, easy renewals, and professional pharmacy support."
        >
            <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-blue-900/10 border border-white/60 relative overflow-hidden group max-h-[90vh] overflow-y-auto custom-scrollbar pt-10">
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mb-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <UserPlus size={28} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        Join PharmaNest
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
                            Sign In here
                        </Link>
                    </p>
                </motion.div>

                {isRegistered ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="inline-flex h-20 w-20 items-center justify-center bg-emerald-100 text-emerald-600 rounded-full mb-8">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Check Your Inbox!</h2>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">
                            We've sent a verification link to <span className="font-bold text-slate-900">{formData.email}</span>. Please click it to activate your account.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                            >
                                {resending ? 'Sending...' : 'Resend Email'}
                            </button>

                            <Link
                                to="/login"
                                className="block w-full py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>

                        <p className="text-slate-400 text-[10px] font-bold mt-8 uppercase tracking-widest">
                            Don't see it? Check your spam folder.
                        </p>
                    </motion.div>
                ) : (
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Registering as
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'user', label: 'Buyer', icon: UserCircle, color: 'blue', desc: 'Shop medicines' },
                                    { id: 'host', label: 'Seller', icon: Store, color: 'emerald', desc: 'Manage inventory' }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleRoleChange(role.id as 'user' | 'host')}
                                        className={`p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left relative overflow-hidden group/role ${formData.role === role.id
                                            ? `border-${role.color}-500 bg-${role.color}-50/50`
                                            : 'border-slate-100 bg-white/30 hover:border-blue-200'
                                            }`}
                                    >
                                        <role.icon className={`mb-3 transition-colors ${formData.role === role.id ? `text-${role.color}-600` : 'text-slate-400 group-hover/role:text-blue-400'}`} size={24} />
                                        <p className={`font-black text-xs uppercase tracking-widest ${formData.role === role.id ? `text-${role.color}-600` : 'text-slate-400'}`}>{role.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">{role.desc}</p>
                                        {formData.role === role.id && (
                                            <motion.div
                                                layoutId="role-indicator"
                                                className={`absolute top-4 right-4 h-2 w-2 rounded-full bg-${role.color}-600 shadow-md shadow-${role.color}-200`}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Name Grid */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'firstName' ? 'text-blue-600' : 'text-slate-400'}`}>
                                    First Name
                                </label>
                                <div className="relative group/input">
                                    <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'firstName' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-slate-100 rounded-[1.2rem] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'lastName' ? 'text-blue-600' : 'text-slate-400'}`}>
                                    Last Name
                                </label>
                                <div className="relative group/input">
                                    <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'lastName' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-slate-100 rounded-[1.2rem] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Email and Phone */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`}>
                                    Email Address
                                </label>
                                <div className="relative group/input">
                                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-slate-100 rounded-[1.2rem] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'phoneNumber' ? 'text-blue-600' : 'text-slate-400'}`}>
                                    Phone Number
                                </label>
                                <div className="relative group/input">
                                    <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'phoneNumber' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onFocus={() => setFocusedField('phoneNumber')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-slate-100 rounded-[1.2rem] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="space-y-2">
                            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`}>
                                Secure Password
                            </label>
                            <div className="relative group/input">
                                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-white/50 border-2 border-slate-100 rounded-[1.2rem] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors px-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {formData.password && (
                                <PasswordStrengthChecker
                                    password={formData.password}
                                    onStrengthChange={setIsPasswordStrong}
                                />
                            )}
                        </motion.div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-5 ${formData.role === 'host' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-300 group ${!isPasswordStrong && formData.password ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">
                                <ShieldCheck size={14} /> 100% Secure & HIPAA Compliant
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default Register;
