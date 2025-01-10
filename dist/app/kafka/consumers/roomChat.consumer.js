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
const kafkajs_1 = require("kafkajs");
const config_1 = __importDefault(require("../../../config"));
class RoomChatConsumer {
    constructor() {
        this.socketMap = new Map();
        const kafka = new kafkajs_1.Kafka({
            clientId: 'room-chat-consumer',
            brokers: config_1.default.kafka.brokers,
        });
        this.consumer = kafka.consumer({ groupId: 'room-chat-group' });
    }
    static getInstance() {
        if (!RoomChatConsumer.instance) {
            RoomChatConsumer.instance = new RoomChatConsumer();
        }
        return RoomChatConsumer.instance;
    }
    addSocket(userId, socket) {
        this.socketMap.set(userId, socket);
    }
    removeSocket(userId) {
        this.socketMap.delete(userId);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.consumer.connect();
                console.log('RoomChat Consumer connected successfully');
            }
            catch (error) {
                console.error('Error connecting RoomChat Consumer:', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.consumer.disconnect();
                console.log('RoomChat Consumer disconnected successfully');
            }
            catch (error) {
                console.error('Error disconnecting RoomChat Consumer:', error);
                throw error;
            }
        });
    }
    subscribe(topics) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.consumer.subscribe({ topics });
                yield this.consumer.run({
                    eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                        if (!message.value)
                            return;
                        const data = JSON.parse(message.value.toString());
                        switch (topic) {
                            case 'room-join':
                                this.handleRoomJoin(data);
                                break;
                            case 'room-leave':
                                this.handleRoomLeave(data);
                                break;
                            case 'webrtc-offer':
                                this.handleWebRTCOffer(data);
                                break;
                            case 'webrtc-answer':
                                this.handleWebRTCAnswer(data);
                                break;
                            case 'ice-candidate':
                                this.handleICECandidate(data);
                                break;
                        }
                    }),
                });
            }
            catch (error) {
                console.error('Error in consumer subscription:', error);
                throw error;
            }
        });
    }
    handleRoomJoin(data) {
        const { userId, roomId } = data;
        const socket = this.socketMap.get(userId);
        if (socket) {
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', data);
        }
    }
    handleRoomLeave(data) {
        const { userId, roomId } = data;
        const socket = this.socketMap.get(userId);
        if (socket) {
            socket.leave(roomId);
            socket.to(roomId).emit('user-left', data);
        }
    }
    handleWebRTCOffer(data) {
        const { to } = data;
        const socket = this.socketMap.get(to);
        if (socket) {
            socket.emit('offer', data);
        }
    }
    handleWebRTCAnswer(data) {
        const { to } = data;
        const socket = this.socketMap.get(to);
        if (socket) {
            socket.emit('answer', data);
        }
    }
    handleICECandidate(data) {
        const { to } = data;
        const socket = this.socketMap.get(to);
        if (socket) {
            socket.emit('ice-candidate', data);
        }
    }
}
exports.default = RoomChatConsumer;
