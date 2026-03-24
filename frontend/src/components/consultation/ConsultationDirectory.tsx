import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    ChevronRight,
    Stethoscope,
    FileText,
    History,
    Users,
    MessageSquare,
    Video,
    Mic,
    ArrowRight
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Consultation, consultationService } from '../../services/consultationService';
import { SOCKET_URL } from '../../utils/constants';
import ChatRoom from './ChatRoom';
import VideoCall from './VideoCall';
import FeedbackModal from './FeedbackModal';

interface ConsultationDirectoryProps {
    viewer: 'doctor' | 'patient';
    scope: 'active' | 'history';
}

const ConsultationDirectory = ({ viewer, scope }: ConsultationDirectoryProps) => {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState<Consultation | null>(null);
    const [feedbackDoctorId, setFeedbackDoctorId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    const isDoctorViewer = viewer === 'doctor';
    const isHistoryView = scope === 'history';
    const redirectPath = user?.role === 'doctor'
        ? (viewer === 'patient' ? '/doctor/appointments' : null)
        : (viewer === 'doctor' ? '/my-consultations' : null);

    useEffect(() => {
        fetchConsultations();
    }, []);

    useEffect(() => {
        if (!user || !isDoctorViewer) return;

        const accessToken = localStorage.getItem('accessToken');
        socketRef.current = io(SOCKET_URL, {
            auth: { token: accessToken }
        });

        const handleIncomingConsultation = (data: { patientName: string; type: string }) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-slate-900">Incoming Consultation!</p>
                    <p className="text-xs text-slate-500">{data.patientName} is requesting a {data.type} session.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });

            fetchConsultations();
        };

        socketRef.current.on('new_instant_consultation', handleIncomingConsultation);

        return () => {
            socketRef.current?.off('new_instant_consultation', handleIncomingConsultation);
            socketRef.current?.disconnect();
        };
    }, [isDoctorViewer, user]);

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

    const filteredConsultations = useMemo(() => {
        const historyStatuses = new Set(['completed', 'cancelled']);

        return consultations
            .filter((consultation) => {
                const isHistoryItem = historyStatuses.has(consultation.status);
                return isHistoryView ? isHistoryItem : !isHistoryItem;
            })
            .sort((a, b) => {
                const left = new Date(a.updatedAt || a.scheduledDate).getTime();
                const right = new Date(b.updatedAt || b.scheduledDate).getTime();
                return right - left;
            });
    }, [consultations, isHistoryView]);

    const fetchAndCloseSession = () => {
        setActiveSession(null);
        fetchConsultations();
    };

    const handleOpenSession = async (consultation: Consultation) => {
        try {
            if (consultation.status !== 'ongoing') {
                await consultationService.updateStatus(consultation._id, 'ongoing');
            }
        } catch (error) {
            toast.error('Failed to start consultation');
            return;
        }

        setConsultations((prev) =>
            prev.map((item) =>
                item._id === consultation._id ? { ...item, status: 'ongoing' } : item
            )
        );
        setActiveSession({ ...consultation, status: 'ongoing' });
    };

    const title = isDoctorViewer
        ? (isHistoryView ? 'Client Interaction History' : 'Assigned Clients')
        : (isHistoryView ? 'Consultation History' : 'My Consultations');

    const subtitle = isDoctorViewer
        ? (isHistoryView
            ? 'Review completed sessions, prescriptions, and client interactions.'
            : 'Manage patients who booked or started sessions with you.')
        : (isHistoryView
            ? 'Revisit your past doctor interactions and completed prescriptions.'
            : 'Track your upcoming, active, and ongoing consultations.');

    const switchHref = isDoctorViewer
        ? (isHistoryView ? '/doctor/appointments' : '/doctor/appointments/history')
        : (isHistoryView ? '/my-consultations' : '/my-consultations/history');

    const switchLabel = isHistoryView ? 'Open Active Queue' : 'View History';

    const getParticipantLabel = (item: Consultation) => {
        if (isDoctorViewer) {
            return `Patient: ${item.userId?.firstName || 'Unknown'} ${item.userId?.lastName || ''}`.trim();
        }

        return `Dr. ${item.doctorId?.userId?.firstName || 'Unknown'} ${item.doctorId?.userId?.lastName || ''}`.trim();
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'ongoing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'completed': return 'bg-slate-50 text-slate-600 border-slate-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {isDoctorViewer ? 'Doctor ' : 'Consultation '}
                            <span className="text-blue-600">{isHistoryView ? 'History' : 'Hub'}</span>
                        </h1>
                        <p className="text-slate-500 font-medium">{subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            {isHistoryView ? <History size={18} className="text-blue-600" /> : <Users size={18} className="text-emerald-600" />}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
                                <p className="text-sm font-black text-slate-900">{filteredConsultations.length} records</p>
                            </div>
                        </div>
                        <Link
                            to={switchHref}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-colors"
                        >
                            {switchLabel} <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredConsultations.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredConsultations.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-8"
                            >
                                <div className="h-20 w-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Stethoscope size={32} />
                                </div>

                                <div className="flex-grow w-full">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                                            {item.type} session
                                        </span>
                                        {item.prescription?.pdfUrl?.url && (
                                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                Prescription Ready
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{getParticipantLabel(item)}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-500 mb-4">
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <Calendar size={14} />
                                            {new Date(item.scheduledDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <Clock size={14} />
                                            {item.slot?.start || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            {item.type === 'chat' ? <MessageSquare size={14} /> : item.type === 'video' ? <Video size={14} /> : <Mic size={14} />}
                                            {item.type === 'chat' ? 'Chat' : item.type === 'video' ? 'Video Call' : 'Voice Call'}
                                        </div>
                                    </div>

                                    {item.reason && (
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Consultation Reason</p>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{item.reason}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                                    {!isHistoryView && (
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleOpenSession(item)}
                                            className={`px-8 py-4 ${item.status === 'ongoing' ? 'bg-blue-600' : (item.status === 'confirmed' ? 'bg-emerald-600' : 'bg-slate-900')} text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg whitespace-nowrap`}
                                        >
                                            {item.type === 'chat' ? 'Open Chat' : (item.type === 'video' ? 'Join Video Call' : 'Join Voice Call')}
                                        </motion.button>
                                    )}

                                    {isHistoryView && item.prescription?.pdfUrl?.url && (
                                        <a
                                            href={item.prescription.pdfUrl.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-colors"
                                        >
                                            <FileText size={16} /> Prescription
                                        </a>
                                    )}

                                    {isHistoryView && !isDoctorViewer && item.status === 'completed' && (
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setFeedbackDoctorId(item.doctorId?._id)}
                                            className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-600 transition-all whitespace-nowrap"
                                        >
                                            Rate Doctor
                                        </motion.button>
                                    )}

                                    <div className="flex items-center justify-center p-4 border border-slate-100 rounded-2xl text-slate-400">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            {isHistoryView ? <History size={40} /> : <Users size={40} />}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            {isHistoryView ? 'No History Yet' : 'No Active Consultations'}
                        </h2>
                        <p className="text-slate-500 font-medium px-10">
                            {isDoctorViewer
                                ? (isHistoryView
                                    ? "Completed client interactions will appear here once sessions are finished."
                                    : "Patients who book you or start an instant consultation will appear here.")
                                : (isHistoryView
                                    ? "Your completed doctor interactions will appear here after consultations finish."
                                    : "Your upcoming and ongoing doctor sessions will appear here once booked.")}
                        </p>
                    </div>
                )}
            </div>

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
                                    isDoctor={isDoctorViewer}
                                    currentUserId={user?._id || ''}
                                    currentUserName={user?.firstName || 'User'}
                                    currentUserImage={user?.profileImage?.url}
                                    currentUserRole={isDoctorViewer ? 'doctor' : 'patient'}
                                    onClose={fetchAndCloseSession}
                                />
                            ) : (
                                <VideoCall
                                    roomName={activeSession.roomName}
                                    consultationId={activeSession._id}
                                    isDoctor={isDoctorViewer}
                                    type={activeSession.type}
                                    onEndCall={fetchAndCloseSession}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

export default ConsultationDirectory;
