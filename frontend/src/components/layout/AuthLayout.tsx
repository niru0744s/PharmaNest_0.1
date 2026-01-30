import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Heart, Truck } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    illustration?: React.ReactNode;
    theme?: 'light' | 'dark';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    illustration,
    theme = 'light'
}) => {
    return (
        <div className={`min-h-screen flex flex-col lg:flex-row overflow-hidden ${theme === 'dark' ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
            {/* Left Side: Brand & Illustration (Hidden on mobile) */}
            <div className={`hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden ${theme === 'dark' ? 'bg-[#0f1117]' : 'bg-blue-600'}`}>
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-white/10'}`}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -45, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-white/5'}`}
                    />
                </div>

                <div className="relative z-10 w-full max-w-lg text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <ShieldCheck className="text-blue-600" size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">PharmaNest</span>
                        </div>

                        <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-6">
                            {title}
                        </h1>
                        <p className={`text-xl font-medium leading-relaxed mb-12 ${theme === 'dark' ? 'text-slate-400' : 'text-blue-100'}`}>
                            {subtitle}
                        </p>

                        {illustration || (
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: Zap, label: "Fast Delivery", color: "bg-blue-500" },
                                    { icon: ShieldCheck, label: "Secure Payments", color: "bg-emerald-500" },
                                    { icon: Heart, label: "Customer Care", color: "bg-rose-500" },
                                    { icon: Truck, label: "Real-time Tracking", color: "bg-amber-500" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/10'} backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/20 transition-colors group cursor-default`}
                                    >
                                        <div className={`h-12 w-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <item.icon size={24} />
                                        </div>
                                        <p className="font-bold text-sm">{item.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative min-h-screen">
                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-50" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Brand for mobile */}
                    <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
                        <ShieldCheck className="text-blue-600" size={24} />
                        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">PharmaNest</span>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
