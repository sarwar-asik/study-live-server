"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomChatHandler = void 0;
const roomChat_producer_1 = __importDefault(require("../../kafka/producers/roomChat.producer"));
const roomChat_consumer_1 = __importDefault(require("../../kafka/consumers/roomChat.consumer"));
const roomChat_topics_1 = require("../../kafka/topics/roomChat.topics");
// Store active rooms
const activeRooms = new Map();
/**
 * Handles video chat room functionality with Kafka integration
 * @param socket - Socket instance for the connected client
 */
const roomChatHandler = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    let currentUser = null;
    const producer = roomChat_producer_1.default.getInstance();
    const consumer = roomChat_consumer_1.default.getInstance();
    // Connect to Kafka
    yield producer.connect();
    yield consumer.connect();
    // Join room event handler
    socket.on('join-room', ({ userId, userName, roomId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Create or get room
            let room = activeRooms.get(roomId);
            if (!room) {
                room = {
                    roomId,
                    users: [],
                    createdAt: new Date(),
                };
                activeRooms.set(roomId, room);
            }
            // Create user object
            currentUser = {
                socketId: socket.id,
                userId,
                userName,
                roomId,
            };
            // Add user to room
            room.users.push(currentUser);
            // Add socket to consumer map
            consumer.addSocket(userId, socket);
            // Send join event to Kafka
            yield producer.sendMessage(roomChat_topics_1.ROOM_CHAT_TOPICS.ROOM_JOIN, {
                user: currentUser,
                users: room.users,
                roomId,
            });
            // Send room info to joined user
            socket.emit('room-joined', {
                users: room.users,
                roomId,
            });
        }
        catch (error) {
            console.error('Error joining room:', error);
            socket.emit('room-error', { message: 'Failed to join room' });
        }
    }));
    // Handle WebRTC signaling through Kafka
    socket.on('offer', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        yield producer.sendMessage(roomChat_topics_1.ROOM_CHAT_TOPICS.WEBRTC_OFFER, payload);
    }));
    socket.on('answer', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        yield producer.sendMessage(roomChat_topics_1.ROOM_CHAT_TOPICS.WEBRTC_ANSWER, payload);
    }));
    socket.on('ice-candidate', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        yield producer.sendMessage(roomChat_topics_1.ROOM_CHAT_TOPICS.ICE_CANDIDATE, payload);
    }));
    // Handle user leaving
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        if (currentUser) {
            const room = activeRooms.get(currentUser.roomId);
            if (room) {
                // Remove user from room
                room.users = room.users.filter(user => user.socketId !== socket.id);
                // Remove socket from consumer map
                consumer.removeSocket(currentUser.userId);
                // If room is empty, remove it
                if (room.users.length === 0) {
                    activeRooms.delete(currentUser.roomId);
                }
                // Send leave event to Kafka
                yield producer.sendMessage(roomChat_topics_1.ROOM_CHAT_TOPICS.ROOM_LEAVE, {
                    userId: currentUser.userId,
                    roomId: currentUser.roomId,
                    remainingUsers: room.users,
                });
            }
        }
    });
    socket.on('leave-room', handleDisconnect);
    socket.on('disconnect', handleDisconnect);
    // Subscribe to all room chat topics
    yield consumer.subscribe(Object.values(roomChat_topics_1.ROOM_CHAT_TOPICS));
});
exports.roomChatHandler = roomChatHandler;
