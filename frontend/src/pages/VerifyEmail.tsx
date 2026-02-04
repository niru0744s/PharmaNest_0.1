import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, Mail, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import AuthLayout from '../components/layout/AuthLayout';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const verifyEffectCalled = useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing or invalid.');
                return;
            }

            if (verifyEffectCalled.current) return;
            verifyEffectCalled.current = true;

            try {
                const response = await authService.verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || 'Identity confirmed. Your account is now active.');
                    toast.success('Email verified successfully!');
                    setTimeout(() => navigate('/login'), 3500);
                } else {
                    console.warn('[VerifyEmail] Verification unsuccessful:', response.message);
                    setStatus('error');
                    setMessage(response.message || 'Verification link may have expired.');
                }
            } catch (error: unknown) {
                console.error('[VerifyEmail] Verification process error:', error);
                const err = error as AxiosError<{ message?: string }>;
                setStatus('error');
                setMessage(err.response?.data?.message || 'We encountered an error verifying your email.');
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <AuthLayout
            theme="light"
            title="Secure Verification."
            subtitle="Finalizing your credentials to ensure a safe and regulated healthcare shopping experience."
        >
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-blue-900/10 border border-white/60 relative overflow-hidden text-center">

                {status === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8 py-10"
                    >
                        <div className="relative inline-block">
                            <RefreshCw className="h-20 w-20 text-blue-600 animate-spin" />
                            <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Verifying Identity</h2>
                            <p className="text-slate-500 font-medium">Please wait while we secure your connection...</p>
                        </div>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 py-6"
                    >
                        <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-200">
                            <CheckCircle2 size={48} className="animate-bounce" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Verification Perfect!</h2>
                            <p className="text-slate-500 font-medium px-4">{message}</p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
                                <RefreshCw size={14} className="animate-spin" />
                                Redirecting to login...
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                Enter PharmaNest <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 py-6"
                    >
                        <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-xl shadow-red-200">
                            <XCircle size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Verification Failed</h2>
                            <p className="text-red-500 font-medium px-4">{message}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                            >
                                <Mail size={16} /> Try Again
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </motion.div>
                )}

                <div className="mt-12 p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-4 text-left">
                    <ShieldCheck className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                            PharmaNest uses advanced identity verification to prevent fraud and ensure compliance with healthcare regulations.
                        </p>
                        <a href="/security" className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 inline-flex items-center gap-1 hover:underline">
                            Security Protocol <ExternalLink size={10} />
                        </a>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;
