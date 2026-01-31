import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    ChevronRight,
    Stethoscope,
    FileText
} from 'lucide-react';
import { consultationService, Consultation } from '../../services/consultationService';
import { useAuth } from '../../contexts/AuthContext';
import ChatRoom from '../../components/consultation/ChatRoom';
import VideoCall from '../../components/consultation/VideoCall';
import FeedbackModal from '../../components/consultation/FeedbackModal';
import toast from 'react-hot-toast';

const MyConsultations = () => {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState<Consultation | null>(null);
    const [feedbackDoctorId, setFeedbackDoctorId] = useState<string | null>(null);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const data = await consultationService.getMyConsultations();
            if (data.success) {
                setConsultations(data.consultations);
            }
        } catch (error) {
            toast.error('Failed to load consultations');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'ongoing': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'completed': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My <span className="text-blue-600">Consultations</span></h1>
                        <p className="text-slate-500 font-medium">Manage your upcoming and past medical appointments.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : consultations.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {consultations.map((item, idx) => {
                            const isDoctor =
                                item.doctorId?.userId?._id?.toString() === user?._id?.toString() ||
                                item.doctorId?.userId === user?._id?.toString();
                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={item._id}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"
                                >
                                    <div className="h-20 w-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Stethoscope size={32} />
                                    </div>

                                    <div className="flex-grow text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                                                {item.type} session
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-1">
                                            {isDoctor ? `Patient: ${item.userId?.firstName} ${item.userId?.lastName}` : `Dr. ${item.doctorId?.userId?.firstName} ${item.doctorId?.userId?.lastName}`}
                                        </h3>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500">
                                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                                <Calendar size={14} />
                                                {new Date(item.scheduledDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                                <Clock size={14} />
                                                {item.slot.start}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        {(item.status === 'confirmed' || item.status === 'ongoing' || item.status === 'pending') && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveSession(item)}
                                                className={`px-8 py-4 ${item.status === 'ongoing' ? 'bg-blue-600' : (item.status === 'confirmed' ? 'bg-emerald-600' : 'bg-slate-900')} text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg`}
                                            >
                                                {item.type === 'chat' ? 'Open Chat' : (item.type === 'video' ? 'Join Video Call' : 'Join Voice Call')}
                                            </motion.button>
                                        )}
                                        {item.status === 'completed' && !isDoctor && (
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => setFeedbackDoctorId(item.doctorId?._id)}
                                                    className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-600 transition-all"
                                                >
                                                    Rate Doctor
                                                </motion.button>
                                                <a
                                                    href="#"
                                                    className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                    title="Download Prescription"
                                                >
                                                    <FileText size={20} />
                                                </a>
                                            </div>
                                        )}
                                        <button className="p-4 hover:bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No Consultations Yet</h2>
                        <p className="text-slate-500 font-medium px-10">You haven't booked any medical consultations yet.</p>
                        <button className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:shadow-xl hover:shadow-blue-200 transition-all">
                            Book First Session
                        </button>
                    </div>
                )}
            </div>

            {/* Session Overlay (Chat or Video) */}
            <AnimatePresence>
                {activeSession && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setActiveSession(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            {activeSession.type === 'chat' ? (
                                <ChatRoom
                                    roomName={activeSession.roomName}
                                    consultationId={activeSession._id}
                                    isDoctor={activeSession.doctorId?.userId?._id === user?._id}
                                    currentUserId={user?._id || ''}
                                    currentUserName={user?.firstName || 'User'}
                                    currentUserImage={user?.profileImage?.url}
                                    onClose={() => {
                                        setActiveSession(null);
                                        fetchConsultations();
                                    }}
                                />
                            ) : (
                                <VideoCall
                                    roomName={activeSession.roomName}
                                    consultationId={activeSession._id}
                                    isDoctor={
                                        activeSession.doctorId?.userId?._id?.toString() === user?._id?.toString() ||
                                        activeSession.doctorId?.userId === user?._id?.toString()
                                    }
                                    type={activeSession.type}
                                    onEndCall={() => {
                                        setActiveSession(null);
                                        fetchConsultations();
                                    }}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Feedback Modal */}
            <AnimatePresence>
                {feedbackDoctorId && (
                    <FeedbackModal
                        doctorId={feedbackDoctorId}
                        onClose={() => setFeedbackDoctorId(null)}
                        onSuccess={() => {
                            setFeedbackDoctorId(null);
                            fetchConsultations();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyConsultations;
