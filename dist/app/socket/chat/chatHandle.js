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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = void 0;
const message_service_1 = require("../../modules/message/message.service");
const chatHandler = (socket) => {
    // Initialize connected users
    socket.emit('get-users', { users: [] });
    socket.on('send-message', ({ message, senderId, receiverId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate message data
            if (!(message === null || message === void 0 ? void 0 : message.trim()) || !senderId || !receiverId) {
                socket.emit('new-message', {
                    success: false,
                    error: 'Invalid message data',
                });
                return;
            }
            // Store message in database
            const createMessage = yield message_service_1.MessageServices.insertDB({
                message: message.trim(),
                senderId,
                receiverId,
            });
            if (!createMessage) {
                throw new Error('Failed to save message');
            }
            // Broadcast message to specific room or recipient
            socket.to(receiverId).emit('new-message', {
                success: true,
                data: createMessage,
            });
            // Confirm message sent to sender
            socket.emit('new-message', {
                success: true,
                data: createMessage,
            });
        }
        catch (error) {
            console.error('Error in send-message handler:', error);
            socket.emit('new-message', {
                success: false,
                error: 'Failed to process message',
            });
        }
    }));
    // Clean up on disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
};
exports.chatHandler = chatHandler;
