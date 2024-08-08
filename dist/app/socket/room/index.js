"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = ({ peerId, receiverId, senderName, }) => {
        const roomId = (0, uuid_1.v4)();
        rooms[roomId] = [];
        joinRoom({ roomId, peerId });
        socket.broadcast.emit('room-created-b', { roomId, receiverId, senderName });
        socket.emit('room-created', { roomId, receiverId, senderName });
    };
    const joinRoom = ({ roomId, peerId }) => {
        console.log(peerId, ' joined room ', roomId);
        if (rooms[roomId]) {
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', { roomId, peerId });
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId],
            });
        }
        else {
            //   createRoom({ peerId });
            console.log('room not found', roomId);
        }
        socket.on('disconnect', () => {
            console.log('user disconnected ', peerId);
            leaveRoom({ roomId, peerId });
        });
    };
    const leaveRoom = ({ roomId, peerId }) => {
        var _a;
        socket.to(roomId).emit('user-disconnected', peerId);
        rooms[roomId] = (_a = rooms[roomId]) === null || _a === void 0 ? void 0 : _a.filter(id => id !== peerId);
    };
    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
    socket.on('leave-room', leaveRoom);
};
exports.roomHandler = roomHandler;
