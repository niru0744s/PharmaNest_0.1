import React, { useMemo } from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck, ShieldHalf } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordStrengthCheckerProps {
    password: string;
    onStrengthChange?: (isStrong: boolean) => void;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ password, onStrengthChange }) => {
    const criteria = useMemo(() => [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
        { label: 'At least one number', met: /[0-9]/.test(password) },
        { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(password) },
    ], [password]);

    const strengthCount = criteria.filter(c => c.met).length;

    const strengthConfig = useMemo(() => {
        if (password.length === 0) return { label: 'None', color: 'bg-slate-200', text: 'text-slate-400', icon: Shield, width: 'w-0' };
        if (strengthCount <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', icon: ShieldAlert, width: 'w-1/4' };
        if (strengthCount <= 3) return { label: 'Fair', color: 'bg-orange-500', text: 'text-orange-500', icon: ShieldHalf, width: 'w-1/2' };
        if (strengthCount <= 4) return { label: 'Good', color: 'bg-yellow-500', text: 'text-yellow-500', icon: ShieldCheck, width: 'w-3/4' };
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', icon: ShieldCheck, width: 'w-full' };
    }, [strengthCount, password.length]);

    React.useEffect(() => {
        if (onStrengthChange) {
            onStrengthChange(strengthCount >= 4);
        }
    }, [strengthCount, onStrengthChange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 bg-slate-50/50 backdrop-blur-md rounded-3xl border border-slate-100 space-y-4 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <strengthConfig.icon size={16} className={strengthConfig.text} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Level:</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${strengthConfig.text}`}>
                        {strengthConfig.label}
                    </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {strengthCount}/5 Criteria
                </span>
            </div>

            {/* Strength Bar */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: password.length === 0 ? '0%' : strengthConfig.width === 'w-1/4' ? '25%' : strengthConfig.width === 'w-1/2' ? '50%' : strengthConfig.width === 'w-3/4' ? '75%' : '100%' }}
                    className={`h-full ${strengthConfig.color} transition-all duration-500`}
                />
            </div>

            {/* Criteria List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {criteria.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={`flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center transition-colors ${item.met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                            {item.met ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${item.met ? 'text-slate-700' : 'text-slate-400'}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PasswordStrengthChecker;
