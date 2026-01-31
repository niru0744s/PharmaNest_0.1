import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, X, MessageSquare, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCKET_URL } from '../../utils/constants';
import PrescriptionModal from './PrescriptionModal';

interface Message {
    senderId: string;
    senderName: string;
    senderImage?: string;
    message: string;
    timestamp: number;
}

interface ChatRoomProps {
    roomName: string;
    consultationId: string;
    isDoctor: boolean;
    currentUserId: string;
    currentUserName: string;
    currentUserImage?: string;
    onClose: () => void;
}

/**
 * Header component for the Chat Room.
 * Displays title, status, and optional end-session actions for doctors.
 */
const ChatHeader = ({
    isDoctor,
    onEndSession,
    onClose
}: {
    isDoctor: boolean;
    onEndSession: () => void;
    onClose: () => void;
}) => (
    <div className="p-6 bg-slate-900 text-white flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-glow-blue">
                <MessageSquare className="text-white" size={20} />
            </div>
            <div>
                <h3 className="font-black text-sm uppercase tracking-tight">Medical Consultation</h3>
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Secure Messaging Active</p>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {isDoctor && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEndSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all flex items-center gap-2 border-2 border-transparent hover:border-blue-600"
                >
                    <Stethoscope size={14} /> End & Prescribe
                </motion.button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
            </button>
        </div>
    </div>
);

/**
 * Individual message bubble component.
 * Differentiates styling based on sender role and ownership.
 */
const MessageBubble = ({
    msg,
    isOwnMessage,
    isDoctorMessage
}: {
    msg: Message;
    isOwnMessage: boolean;
    isDoctorMessage: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
        <div className={`max-w-[80%] flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-white overflow-hidden ${isDoctorMessage ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                {msg.senderImage ? (
                    <img src={msg.senderImage} alt="" className="w-full h-full object-cover" />
                ) : (
                    <User size={18} />
                )}
            </div>
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 px-1 ${isDoctorMessage ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                    {isDoctorMessage ? 'Medical Expert' : 'Patient'}
                </span>
                <div className={`p-4 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all hover:shadow-md ${isOwnMessage
                    ? (isDoctorMessage ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-blue-600 text-white rounded-tr-none')
                    : 'bg-white text-slate-700 rounded-tl-none'
                    }`}>
                    <p className="leading-relaxed">{msg.message}</p>
                    <span className={`text-[9px] mt-2 block font-bold opacity-60 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    </motion.div>
);

/**
 * Chat input component with message submission handling.
 */
const ChatInput = ({
    value,
    onChange,
    onSend
}: {
    value: string;
    onChange: (val: string) => void;
    onSend: (e: React.FormEvent) => void;
}) => (
    <div className="p-6 border-t border-slate-100 bg-white">
        <form onSubmit={onSend} className="relative flex gap-3">
            <input
                type="text"
                placeholder="Type your clinical assessment or query..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!value.trim()}
                className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all"
            >
                <Send size={20} />
            </motion.button>
        </form>
    </div>
);

const ChatRoom = ({ roomName, consultationId, isDoctor, currentUserId, currentUserName, currentUserImage, onClose }: ChatRoomProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Socket Connection
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit('join_room', roomName);

        const handleReceiveMessage = (data: Message) => {
            setMessages((prev) => [...prev, data]);
        };

        newSocket.on('receive_message', handleReceiveMessage);

        return () => {
            newSocket.off('receive_message', handleReceiveMessage);
            newSocket.disconnect();
        };
    }, [roomName]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = inputValue.trim();

        if (!trimmedMessage || !socket) return;

        const messageData: Message = {
            senderId: currentUserId,
            senderName: currentUserName,
            senderImage: currentUserImage,
            message: trimmedMessage,
            timestamp: Date.now()
        };

        socket.emit('send_message', { roomName, ...messageData });
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
            <ChatHeader
                isDoctor={isDoctor}
                onEndSession={() => setShowPrescriptionModal(true)}
                onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fbfcfd] scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const isOwnMessage = msg.senderId === currentUserId;
                        const isDoctorMessage = isDoctor ? isOwnMessage : !isOwnMessage;

                        return (
                            <MessageBubble
                                key={idx}
                                msg={msg}
                                isOwnMessage={isOwnMessage}
                                isDoctorMessage={isDoctorMessage}
                            />
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-2" />
            </div>

            <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
            />

            {/* Modals */}
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
