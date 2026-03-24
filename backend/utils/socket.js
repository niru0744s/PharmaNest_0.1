const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Doctor = require('../modules/Doctor');
const User = require('../modules/User');

let io;

const init = (server) => {
    io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const onlineDoctors = new Map(); // userId -> Set of socketIds

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id).select('_id role');

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.userId = user._id.toString();
            socket.role = user.role;

            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`New connection: ${socket.id}`);

        // Join a private room for personal notifications
        if (socket.userId) {
            socket.join(socket.userId);
        }

        if (socket.role === 'doctor' && socket.userId) {
            if (!onlineDoctors.has(socket.userId)) {
                onlineDoctors.set(socket.userId, new Set());
                await Doctor.findOneAndUpdate({ userId: socket.userId }, { isOnline: true });
                io.emit('doctor_status_change', { userId: socket.userId, isOnline: true });
                console.log(`Doctor ${socket.userId} is now ONLINE`);
            }

            onlineDoctors.get(socket.userId).add(socket.id);
        }

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
