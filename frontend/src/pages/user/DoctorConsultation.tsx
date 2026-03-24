import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Video,
    Mic,
    MessageSquare,
    Star,
    Clock,
    ShieldCheck,
    Stethoscope,
    Calendar,
    ArrowRight,
    X,
    Zap
} from 'lucide-react';
import { consultationService, Doctor, Consultation } from '../../services/consultationService';
import { useAuth } from '../../contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../../utils/constants';
import ChatRoom from '../../components/consultation/ChatRoom';
import VideoCall from '../../components/consultation/VideoCall';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorConsultation = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState({
        type: 'video' as 'chat' | 'voice' | 'video',
        scheduledDate: '',
        slot: { start: '', end: '' },
        reason: ''
    });
    const [activeSession, setActiveSession] = useState<Consultation | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef<Socket | null>(null);

    const specialties = ['All', 'General Physician', 'Dermatology', 'Cardiology', 'Pediatrics', 'Neurology'];

    useEffect(() => {
        fetchDoctors();

        // Socket integration for real-time status
        const accessToken = localStorage.getItem('accessToken');
        socketRef.current = io(SOCKET_URL, {
            auth: { token: accessToken }
        });

        socketRef.current.on('doctor_status_change', ({ userId, isOnline }) => {
            setDoctors(prev => prev.map(doc =>
                doc.userId?._id === userId ? { ...doc, isOnline } : doc
            ));
        });

        // Listen for new instant consultation (if the current user IS a doctor)
        socketRef.current.on('new_instant_consultation', (data) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-slate-900">Incoming Consultation!</p>
                    <p className="text-xs text-slate-500">{data.patientName} is requesting a {data.type} session.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                navigate('/doctor/appointments');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                            View Request
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [navigate]);

    const fetchDoctors = async () => {
        try {
            const data = await consultationService.getDoctors();
            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!bookingData.scheduledDate || !bookingData.slot.start || !bookingData.reason) {
            toast.error('Please fill all booking details');
            return;
        }

        try {
            const response = await consultationService.bookConsultation({
                doctorId: selectedDoctor?._id,
                ...bookingData
            });
            if (response.success) {
                toast.success('Consultation booked successfully!');
                setIsBookingModalOpen(false);
                setBookingData({
                    type: 'video',
                    scheduledDate: '',
                    slot: { start: '', end: '' },
                    reason: ''
                });
            }
        } catch (error) {
            toast.error('Failed to book consultation');
        }
    };

    const handleInstantConsultation = async (doctor: Doctor) => {
        try {
            const response = await consultationService.instantBooking({
                doctorId: doctor._id,
                type: 'video',
                reason: 'Instant Consultation'
            });
            if (response.success) {
                toast.success('Consultation started! Redirecting...');
                setActiveSession(response.consultation);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Doctor is currently unavailable');
        }
    };

    const filteredDoctors = doctors.filter((doctor: Doctor) => {
        const matchesSearch = (doctor.userId?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.userId?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-slate-900 tracking-tight mb-2"
                        >
                            Tele-<span className="text-blue-600">Consultation</span>
                        </motion.h1>
                        <p className="text-slate-500 font-medium">Connect with verified medical professionals instantly.</p>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">100% Secure</span>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <div className="lg:col-span-8 relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                            <Search size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, specialty or clinic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Filter size={18} className="text-slate-400" />
                            </div>
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none text-slate-600 cursor-pointer"
                            >
                                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Doctors Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Finding available specialists...</p>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor: Doctor, index: number) => (
                            <motion.div
                                key={doctor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all overflow-hidden flex flex-col"
                            >
                                <div className="p-8 pb-4 flex items-start justify-between">
                                    <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden shrink-0 border-2 border-white shadow-inner">
                                        {doctor.profileImage?.url ? (
                                            <img src={doctor.profileImage.url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Stethoscope size={32} />
                                        )}
                                    </div>
                                    <div className={`${doctor.isOnline ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-slate-400'} px-5 py-2.5 rounded-2xl flex items-center gap-2 border transition-all duration-500 scale-105`}>
                                        <div className={`h-2.5 w-2.5 rounded-full ${doctor.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{doctor.isOnline ? 'Available Now' : 'Offline'}</span>
                                    </div>
                                </div>

                                <div className="px-8 pb-8 flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            Dr. {doctor.userId?.firstName || 'Unknown'} {doctor.userId?.lastName || ''}
                                        </h3>
                                        <p className="text-sm font-bold text-blue-500 uppercase tracking-tighter">{doctor.specialization}</p>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1 font-black text-slate-800 text-sm">
                                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                            {doctor.rating}
                                        </div>
                                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {doctor.experience} Yrs Experience
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
                                            <Video size={14} />
                                            <span className="text-[10px] font-black uppercase">Video</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
                                            <Mic size={14} />
                                            <span className="text-[10px] font-black uppercase">Voice</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
                                            <MessageSquare size={14} />
                                            <span className="text-[10px] font-black uppercase">Chat</span>
                                        </div>
                                    </div>

                                    {doctor.isOnline && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleInstantConsultation(doctor)}
                                            className="mb-6 w-full py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2"
                                        >
                                            <Zap size={14} className="fill-current" /> Consult Now
                                        </motion.button>
                                    )}

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                                            <p className="text-2xl font-black text-slate-900">₹{doctor.consultationFees}</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ x: 5 }}
                                            onClick={() => {
                                                setSelectedDoctor(doctor);
                                                setIsBookingModalOpen(true);
                                            }}
                                            className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                                        >
                                            <ArrowRight size={20} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Stethoscope size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No Specialists Found</h2>
                        <p className="text-slate-500 font-medium px-10">We couldn't find any doctors matching your criteria. Try adjusting your filters.</p>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Video, title: "Virtual Clinic", desc: "Consult from the comfort of your home." },
                        { icon: Clock, title: "24/7 Availability", desc: "Doctors available round the clock." },
                        { icon: ShieldCheck, title: "Private & Secure", desc: "End-to-end encrypted consultations." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-8 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -tr-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                                <p className="text-xs text-blue-100 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && selectedDoctor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Book Consultation</h2>
                                    <p className="text-xs text-blue-100 font-bold opacity-80 uppercase tracking-widest mt-1">With Dr. {selectedDoctor.userId?.firstName || 'Unknown'}</p>
                                </div>
                                <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Type Selection */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 text-center">Select Mode</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['chat', 'voice', 'video'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setBookingData(prev => ({ ...prev, type }))}
                                                className={`py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${bookingData.type === type
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'}`}
                                            >
                                                {type === 'chat' && <MessageSquare size={18} />}
                                                {type === 'voice' && <Mic size={18} />}
                                                {type === 'video' && <Video size={18} />}
                                                <span className="text-[10px] font-black uppercase">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Preferred Date</label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="date"
                                                value={bookingData.scheduledDate}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time Slot</label>
                                        <div className="relative">
                                            <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="time"
                                                onChange={(e) => setBookingData(prev => ({ ...prev, slot: { start: e.target.value, end: '' } }))}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reason for Visit</label>
                                    <textarea
                                        rows={3}
                                        value={bookingData.reason}
                                        onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
                                        placeholder="Briefly describe your health concern..."
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                                >
                                    Confirm Appointment
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Session Overlay (Instant Call) */}
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
                                    isDoctor={false}
                                    currentUserId={user?._id || ''}
                                    currentUserName={user?.firstName || 'User'}
                                    currentUserImage={user?.profileImage?.url}
                                    currentUserRole="patient"
                                    onClose={() => setActiveSession(null)}
                                />
                            ) : (
                                <VideoCall
                                    roomName={activeSession.roomName}
                                    consultationId={activeSession._id}
                                    isDoctor={false}
                                    type={activeSession.type}
                                    onEndCall={() => setActiveSession(null)}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorConsultation;
