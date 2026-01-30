const socketio = require('socket.io');
const Doctor = require('../modules/Doctor');

let io;

const init = (server) => {
    io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const onlineDoctors = new Map(); // userId -> Set of socketIds

    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        socket.on('identify', async (data) => {
            const { userId, role } = data;
            socket.userId = userId;
            socket.role = role;

            // Join a private room for personal notifications
            socket.join(userId);

            if (role === 'doctor') {
                if (!onlineDoctors.has(userId)) {
                    onlineDoctors.set(userId, new Set());
                    // First connection for this doctor
                    await Doctor.findOneAndUpdate({ userId }, { isOnline: true });
                    io.emit('doctor_status_change', { userId, isOnline: true });
                    console.log(`Doctor ${userId} is now ONLINE`);
                }
                onlineDoctors.get(userId).add(socket.id);
            }
        });

        socket.on('join_room', (roomName) => {
            socket.join(roomName);
            console.log(`User ${socket.id} joined room: ${roomName}`);

            // Notify others in the room (for WebRTC peer discovery)
            socket.to(roomName).emit('user_joined', { socketId: socket.id });
        });

        socket.on('send_message', (data) => {
            io.to(data.roomName).emit('receive_message', data);
        });

        // WebRTC Signaling
        socket.on('webrtc_offer', (data) => {
            socket.to(data.roomName).emit('webrtc_offer', {
                offer: data.offer,
                socketId: socket.id
            });
        });

        socket.on('webrtc_answer', (data) => {
            socket.to(data.roomName).emit('webrtc_answer', {
                answer: data.answer,
                socketId: socket.id
            });
        });

        socket.on('webrtc_ice_candidate', (data) => {
            socket.to(data.roomName).emit('webrtc_ice_candidate', {
                candidate: data.candidate,
                socketId: socket.id
            });
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.id}`);

            if (socket.role === 'doctor' && socket.userId) {
                const sockets = onlineDoctors.get(socket.userId);
                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        onlineDoctors.delete(socket.userId);
                        // All connections for this doctor are closed
                        await Doctor.findOneAndUpdate({ userId: socket.userId }, { isOnline: false });
                        io.emit('doctor_status_change', { userId: socket.userId, isOnline: false });
                        console.log(`Doctor ${socket.userId} is now OFFLINE`);
                    }
                }
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { init, getIO };
