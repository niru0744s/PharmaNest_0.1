import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, X, MessageSquare, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCKET_URL } from '../../utils/constants';
import PrescriptionModal from './PrescriptionModal';

interface Message {
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
}

interface ChatRoomProps {
    roomName: string;
    consultationId: string;
    isDoctor: boolean;
    currentUserId: string;
    currentUserName: string;
    onClose: () => void;
}

const ChatRoom = ({ roomName, consultationId, isDoctor, currentUserId, currentUserName, onClose }: ChatRoomProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit('join_room', roomName);

        newSocket.on('receive_message', (data: Message) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket) return;

        const messageData: Message = {
            senderId: currentUserId,
            senderName: currentUserName,
            message: inputValue,
            timestamp: Date.now()
        };

        socket.emit('send_message', { roomName, ...messageData });
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">Medical Chat</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Consultation</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isDoctor && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPrescriptionModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all flex items-center gap-2"
                        >
                            <Stethoscope size={14} /> End & Prescribe
                        </motion.button>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => {
                    const isOwnMessage = msg.senderId === currentUserId;
                    const isDoctorMessage = isDoctor ? isOwnMessage : !isOwnMessage;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-white overflow-hidden ${isDoctorMessage ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                    <User size={20} />
                                </div>
                                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDoctorMessage ? 'text-emerald-600' : 'text-blue-600'
                                        }`}>
                                        {isDoctorMessage ? 'Doctor' : 'Patient'}
                                    </span>
                                    <div className={`p-4 rounded-[1.5rem] text-sm font-medium ${isOwnMessage
                                            ? (isDoctorMessage ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-blue-600 text-white rounded-tr-none')
                                            : 'bg-white text-slate-700 rounded-tl-none shadow-sm'
                                        }`}>
                                        <p>{msg.message}</p>
                                        <span className={`text-[9px] mt-2 block opacity-60 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-100 bg-white">
                <form onSubmit={handleSend} className="relative flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100"
                    >
                        <Send size={18} />
                    </motion.button>
                </form>
            </div>

            {/* Prescription Modal */}
            <AnimatePresence>
                {showPrescriptionModal && (
                    <PrescriptionModal
                        consultationId={consultationId}
                        onClose={() => setShowPrescriptionModal(false)}
                        onSuccess={() => {
                            setShowPrescriptionModal(false);
                            onClose();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatRoom;
