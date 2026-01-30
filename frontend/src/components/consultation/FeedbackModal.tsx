import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { consultationService } from '../../services/consultationService';

interface FeedbackModalProps {
    doctorId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const FeedbackModal = ({ doctorId, onClose, onSuccess }: FeedbackModalProps) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await consultationService.submitFeedback({
                doctorId,
                rating,
                comment
            });
            if (response.success) {
                toast.success('Thank you for your feedback!');
                onSuccess();
            }
        } catch (error) {
            toast.error('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 flex flex-col items-center text-center"
            >
                <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8">
                    <Star size={40} className="fill-blue-600" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2">Rate Your Experience</h2>
                <p className="text-slate-500 font-medium mb-8">How was your session with the doctor?</p>

                <div className="flex gap-2 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform active:scale-90"
                        >
                            <Star
                                size={36}
                                className={`transition-colors ${(hoveredRating || rating) >= star
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-200 fill-slate-50'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <div className="w-full text-left mb-8">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Your Feedback (Optional)</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-slate-300" size={18} />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you liked or how we can improve..."
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                    >
                        {loading ? '...' : (
                            <>
                                <Send size={16} /> Submit
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackModal;
