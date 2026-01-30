import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Loader2,
    Trash2,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiService, ChatMessage } from '../../services/aiService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AIAdvisor = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Only show for regular users
    const shouldShow = user?.role !== 'host' && isAuthenticated;

    useEffect(() => {
        if (isOpen && chatHistory.length === 0) {
            loadHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadHistory = async () => {
        try {
            const response = await aiService.getHistory();
            if (response.success) {
                setChatHistory(response.history);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await aiService.getAdvice(message, chatHistory);
            if (response.success) {
                setChatHistory(prev => [...prev, { role: 'assistant', content: response.reply }]);
            } else {
                toast.error('AI Advisor is currently unavailable');
            }
        } catch (error) {
            toast.error('Failed to connect to AI Advisor');
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const clearHistory = () => {
        if (window.confirm('Clear our conversation history?')) {
            setChatHistory([]);
            // Backend handles truncation normally, but we can add a specific clear route if needed
            toast.success('Conversation cleared');
        }
    };

    return (
        <AnimatePresence>
            {shouldShow && (
                <div className="fixed bottom-6 right-6 z-[60] font-sans">
                    {/* Floating Bubble */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.button
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 45 }}
                                whileHover={{ scale: 1.1, y: -4 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(true)}
                                className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 group relative"
                            >
                                <div className="absolute inset-0 bg-blue-600 rounded-3xl animate-ping opacity-20 group-hover:opacity-0" />
                                <MessageCircle size={28} className="relative z-10" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Chat Window */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                                className="w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden glass-effect"
                            >
                                {/* Header */}
                                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                            <Bot size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm tracking-tight flex items-center gap-1.5 uppercase">
                                                PharmaNest AI Advisor
                                                <Sparkles size={12} className="text-yellow-300" />
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active Now</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={clearHistory}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                            title="Clear Chat"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#f8fafc]/50">
                                    {/* Medical Disclaimer */}
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                                        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                                            Disclaimer: I am an AI assistant. My responses are for informational purposes only and NOT a substitute for professional medical advice, diagnosis, or treatment.
                                        </p>
                                    </div>

                                    {chatHistory.length === 0 && (
                                        <div className="text-center py-10 space-y-4">
                                            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                                <Bot size={32} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Welcome to Health Hub!</p>
                                                <p className="text-xs text-gray-500 px-10">Ask me about medicines, health symptoms, or products in our catalogue.</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 px-6">
                                                {[
                                                    "Common cold remedies",
                                                    "Best vitamins for energy",
                                                    "How to track my order?"
                                                ].map((q, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setMessage(q); /* Trigger send manually or via useEffect */ }}
                                                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-left"
                                                    >
                                                        "{q}"
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {chatHistory.map((msg, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                                        >
                                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-blue-600 border border-gray-100'
                                                    }`}>
                                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                                </div>
                                                <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                                                    : 'bg-white text-gray-700 border border-gray-50 rounded-tl-none prose prose-sm'
                                                    }`}>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="m-0 leading-relaxed font-bold" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="m-0 mt-2 list-disc list-inside space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="m-0 text-xs opacity-90" {...props} />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
                                                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" />
                                                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-6 bg-white border-t border-gray-100">
                                    <form
                                        onSubmit={handleSend}
                                        className="relative flex items-center gap-2"
                                    >
                                        <div className="relative flex-1 group">
                                            <input
                                                type="text"
                                                placeholder="Type your health query..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full pl-4 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="submit"
                                                disabled={!message.trim() || isLoading}
                                                className="absolute right-2 top-2 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-gray-200 transition-all shadow-lg shadow-blue-100"
                                            >
                                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                            </motion.button>
                                        </div>
                                    </form>
                                    <div className="mt-4 flex justify-center items-center gap-4 text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                                        <span className="flex items-center gap-1.5"><Sparkles size={10} className="text-blue-400" /> Powered by PharmaLlama</span>
                                        <div className="h-1 w-1 bg-gray-200 rounded-full" />
                                        <span>Ver 1.2 Beta</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AIAdvisor;
