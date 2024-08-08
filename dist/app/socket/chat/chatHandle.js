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
    // console.log(socket?.id, 'socket?.id');
    socket.emit('get-users', { users: [] });
    // console.log(connectedClients, 'connectedClients');
    // const clientSocket = connectedClients[socket?.id]
    // function emitMessageToClients(clientIds: string[], message: IMessage) {
    //   clientIds.forEach(clientId => {
    //     const clientSocket = connectedClients[clientId];
    //     if (clientSocket) {
    //       clientSocket.emit('new-message', message);
    //     } else {
    //       console.log(`Client with ID ${clientId} is not Online.`);
    //     }
    //   });
    // }
    socket.on('send-message', ({ message, senderId, receiverId }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(message, 'message');
        console.log({
            message,
            senderId,
            receiverId,
        });
        const createMessage = yield message_service_1.MessageServices.insertDB({
            message,
            senderId,
            receiverId,
        });
        socket.broadcast.emit('new-message', { createMessage });
        // if (createMessage) {
        //   emitMessageToClients([senderId, receiverId], createMessage);
        // }
    }));
};
exports.chatHandler = chatHandler;
