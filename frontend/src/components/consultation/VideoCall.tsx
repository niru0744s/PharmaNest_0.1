import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Volume2,
    Settings,
    User,
    Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCKET_URL } from '../../utils/constants';
import PrescriptionModal from './PrescriptionModal';

interface VideoCallProps {
    roomName: string;
    consultationId: string;
    isDoctor: boolean;
    type: 'video' | 'voice' | 'chat';
    onEndCall: () => void;
}

const VideoCall = ({ roomName, consultationId, isDoctor, type, onEndCall }: VideoCallProps) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

    const pc = useRef<RTCPeerConnection | null>(null);
    const socket = useRef<Socket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
    const hasRemoteDescription = useRef(false);

    const turnServerUrl = import.meta.env.VITE_TURN_SERVER_URL;
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            ...(turnServerUrl ? [{
                urls: turnServerUrl,
                username: turnUsername,
                credential: turnCredential
            }] : []),
        ],
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        // 1. Initialize Socket and Peer Connection immediately
        socket.current = io(SOCKET_URL, {
            auth: { token: accessToken }
        });
        const peerConnection = new RTCPeerConnection(configuration);
        pc.current = peerConnection;

        // Cleanup function for tracks and connections
        const cleanup = () => {
            console.log("Cleaning up WebRTC session...");

            // Explicitly stop all tracks in the local stream
            if (pc.current) {
                pc.current.getSenders().forEach(sender => {
                    if (sender.track) sender.track.stop();
                });
                pc.current.close();
            }

            if (localVideoRef.current) localVideoRef.current.srcObject = null;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            socket.current?.disconnect();
        };

        const applyRemoteDescription = async (description: RTCSessionDescriptionInit) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
            hasRemoteDescription.current = true;

            if (pendingIceCandidates.current.length > 0) {
                const queuedCandidates = [...pendingIceCandidates.current];
                pendingIceCandidates.current = [];

                for (const candidate of queuedCandidates) {
                    try {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('Error applying queued ice candidate', error);
                    }
                }
            }
        };

        // 2. Setup Signaling Handlers BEFORE anything else
        socket.current.on('webrtc_offer', async (data) => {
            console.log("Received Offer");
            if (peerConnection.signalingState !== 'stable') return;

            try {
                await applyRemoteDescription(data.offer);
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.current?.emit('webrtc_answer', { roomName, answer });
            } catch (error) {
                console.error('Error handling WebRTC offer', error);
            }
        });

        socket.current.on('webrtc_answer', async (data) => {
            console.log("Received Answer");
            if (peerConnection.signalingState !== 'have-local-offer') return;

            try {
                await applyRemoteDescription(data.answer);
            } catch (error) {
                console.error('Error handling WebRTC answer', error);
            }
        });

        socket.current.on('webrtc_ice_candidate', async (data) => {
            if (!data.candidate) return;

            try {
                if (!hasRemoteDescription.current) {
                    pendingIceCandidates.current.push(data.candidate);
                    return;
                }

                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        // 3. Setup Internal PeerConnection Listeners
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current?.emit('webrtc_ice_candidate', {
                    roomName,
                    candidate: event.candidate
                });
            }
        };

        peerConnection.ontrack = (event) => {
            console.log("Received remote track");
            setRemoteStream(event.streams[0]);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        // 4. Reactive handler for new users joining
        socket.current.on('user_joined', async () => {
            console.log("Another user joined - Creating offer");
            if (peerConnection.signalingState !== 'stable') return;

            try {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.current?.emit('webrtc_offer', { roomName, offer });
            } catch (error) {
                console.error('Error creating WebRTC offer', error);
            }
        });

        // 5. Initialize Media and THEN Join Room
        const startSession = async () => {
            try {
                // Determine constraints based on call type
                const constraints = {
                    video: type === 'video',
                    audio: true
                };

                console.log(`Requesting media with:`, constraints);
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                // Add active tracks to the peer connection
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                // 6. FINALLY, join the room after EVERYTHING is ready
                console.log("Joining room...");
                socket.current?.emit('join_room', roomName);

            } catch (err) {
                console.error("Error accessing media devices.", err);
            }
        };

        startSession();

        return () => {
            cleanup();
        };
    }, [roomName, type]);

    const handleMute = () => {
        if (localStream) {
            const track = localStream.getAudioTracks()[0];
            if (track) {
                track.enabled = isMuted;
                setIsMuted(!isMuted);
            }
        }
    };

    const handleVideoToggle = () => {
        if (localStream && type === 'video') {
            const track = localStream.getVideoTracks()[0];
            if (track) {
                track.enabled = isVideoOff;
                setIsVideoOff(!isVideoOff);
            }
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            {/* Main Stage (Remote User) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 ${remoteStream ? 'opacity-100' : 'opacity-0'}`}
                />
                {!remoteStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/80 backdrop-blur-md">
                        <div className="h-32 w-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center animate-pulse">
                            <Stethoscope className="text-slate-600" size={64} />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Connecting...</p>
                    </div>
                )}
            </div>

            {/* Local Preview (Self) */}
            <motion.div
                drag
                dragConstraints={{ left: -300, right: 0, top: 0, bottom: 500 }}
                className="absolute top-8 right-8 w-48 h-64 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 z-20 cursor-move"
            >
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
                {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <User className="text-slate-600" size={32} />
                    </div>
                )}
                <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">You</span>
                </div>
            </motion.div>

            {/* Top Bar Stats */}
            <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
                <ControlBtn
                    icon={isMuted ? MicOff : Mic}
                    active={isMuted}
                    onClick={handleMute}
                />
                <ControlBtn
                    icon={isVideoOff ? VideoOff : Video}
                    active={isVideoOff}
                    onClick={handleVideoToggle}
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onEndCall}
                    className="h-20 w-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 hover:bg-red-600 transition-colors"
                >
                    <PhoneOff size={32} />
                </motion.button>
                <ControlBtn icon={Volume2} active={false} onClick={() => { }} />
                <ControlBtn icon={Settings} active={false} onClick={() => { }} />

                {isDoctor && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPrescriptionModal(true)}
                        className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Stethoscope size={16} /> End & Prescribe
                    </motion.button>
                )}
            </div>

            {/* Prescription Modal */}
            <AnimatePresence>
                {showPrescriptionModal && (
                    <PrescriptionModal
                        consultationId={consultationId}
                        onClose={() => setShowPrescriptionModal(false)}
                        onSuccess={() => {
                            setShowPrescriptionModal(false);
                            onEndCall();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ControlBtn = ({ icon: Icon, active, onClick }: any) => (
    <motion.button
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${active
            ? 'bg-red-500/20 text-red-500 border-2 border-red-500 shadow-lg shadow-red-500/20'
            : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
            }`}
    >
        <Icon size={24} />
    </motion.button>
);

export default VideoCall;
