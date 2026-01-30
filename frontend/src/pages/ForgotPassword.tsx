import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Key, CheckCircle2, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import AuthLayout from '../components/layout/AuthLayout';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'user' | 'host'>('user');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(email, role);
            if (response.success) {
                toast.success('Verification code sent to your email!');
                setUserId(response.usr._id);
                setStep(2);
            } else {
                toast.error(response.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error sending OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.verifyOTP(userId, otp.join(''), role);
            if (response.success) {
                toast.success('OTP Verified. Please set a new password.');
                setStep(3);
            } else {
                toast.error(response.message || 'Invalid OTP');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error verifying OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.resetPassword(userId, otp.join(''), newPassword, role);
            if (response.success) {
                toast.success('Password reset successful!', {
                    icon: <CheckCircle2 className="text-emerald-500" />
                });
                navigate(role === 'host' ? '/host-login' : '/login');
            } else {
                toast.error(response.message || 'Failed to reset password');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <AuthLayout
            theme={role === 'host' ? 'dark' : 'light'}
            title="Account Recovery."
            subtitle="Follow the steps to securely verify your identity and restore access to your PharmaNest account."
        >
            <div className={`bg-white/${role === 'host' ? '0.03' : '40'} backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl border ${role === 'host' ? 'border-white/10 shadow-emerald-900/10' : 'border-white/60 shadow-blue-900/10'} relative overflow-hidden group`}>

                {/* Back Button */}
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className={`absolute top-8 left-8 p-2 rounded-xl transition-colors ${role === 'host' ? 'text-slate-400 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="text-center mb-10">
                                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500 ${role === 'host' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-blue-600 shadow-blue-200'}`}>
                                    <Key size={32} />
                                </div>
                                <h2 className={`text-4xl font-black tracking-tight mb-3 ${role === 'host' ? 'text-white' : 'text-slate-900'}`}>
                                    Lost Access?
                                </h2>
                                <p className="text-slate-500 font-medium px-4">
                                    Enter your email and we'll send you a secure verification code.
                                </p>
                            </div>

                            <form onSubmit={handleSendOTP} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                        Account Type
                                    </label>
                                    <div className="flex gap-4 p-1.5 bg-slate-100/50 rounded-2xl">
                                        {(['user', 'host'] as const).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRole(r)}
                                                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === r
                                                    ? (r === 'host' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                                                    : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {r === 'host' ? 'Merchant' : 'Personal'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'email' ? (role === 'host' ? 'text-emerald-400' : 'text-blue-600') : 'text-slate-400'}`}>
                                        Registered Email
                                    </label>
                                    <div className="relative group/input">
                                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? (role === 'host' ? 'text-emerald-400' : 'text-blue-600') : 'text-slate-400'}`} size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full pl-12 pr-6 py-4 border-2 rounded-[1.2rem] outline-none transition-all font-bold ${role === 'host'
                                                ? 'bg-white/5 border-white/5 text-white focus:border-emerald-500/50'
                                                : 'bg-white/50 border-slate-100 text-slate-700 focus:border-blue-500'}`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-center gap-3 py-5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-300 group ${role === 'host' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Generate Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="text-center mb-10">
                                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl mb-6 ${role === 'host' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-blue-600 shadow-blue-200'}`}>
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className={`text-4xl font-black tracking-tight mb-3 ${role === 'host' ? 'text-white' : 'text-slate-900'}`}>
                                    Verify Identity
                                </h2>
                                <p className="text-slate-500 font-medium px-4">
                                    We've sent a 6-digit code to <span className={`font-bold ${role === 'host' ? 'text-emerald-400' : 'text-blue-600'}`}>{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOTP} className="space-y-8">
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                            className={`w-12 h-16 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all ${role === 'host'
                                                ? 'bg-white/5 border-white/5 text-white focus:border-emerald-500/50'
                                                : 'bg-white/50 border-slate-100 text-slate-900 focus:border-blue-500'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.some(d => !d)}
                                    className={`w-full flex items-center justify-center gap-3 py-5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-300 group ${role === 'host' ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'}`}
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Verify Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>

                                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Didn't get it? <button type="button" onClick={handleSendOTP} className={`hover:underline ${role === 'host' ? 'text-emerald-400' : 'text-blue-600'}`}>Resend Code</button>
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="text-center mb-10">
                                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl mb-6 ${role === 'host' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-blue-600 shadow-blue-200'}`}>
                                    <Lock size={32} />
                                </div>
                                <h2 className={`text-4xl font-black tracking-tight mb-3 ${role === 'host' ? 'text-white' : 'text-slate-900'}`}>
                                    New Password
                                </h2>
                                <p className="text-slate-500 font-medium px-4">
                                    Ensure your account is protected with a strong, unique password.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'newPassword' ? (role === 'host' ? 'text-emerald-400' : 'text-blue-600') : 'text-slate-400'}`}>
                                        New Password
                                    </label>
                                    <div className="relative group/input">
                                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'newPassword' ? (role === 'host' ? 'text-emerald-400' : 'text-blue-600') : 'text-slate-400'}`} size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onFocus={() => setFocusedField('newPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-[1.2rem] outline-none transition-all font-bold ${role === 'host'
                                                ? 'bg-white/5 border-white/5 text-white focus:border-emerald-500/50'
                                                : 'bg-white/50 border-slate-100 text-slate-700 focus:border-blue-500'}`}
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
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || newPassword.length < 6}
                                    className={`w-full flex items-center justify-center gap-3 py-5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-300 group ${role === 'host' ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'}`}
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Reset Password <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-10 pt-10 border-t border-slate-100/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Need help? <a href="mailto:support@pharmanest.com" className="text-blue-500 hover:underline">Contact Security Team</a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
