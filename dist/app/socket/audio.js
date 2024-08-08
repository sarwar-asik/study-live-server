"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioHandler = void 0;
const AudioHandler = (socket, connectedClients) => {
    socket.on('offer', offerData => {
        console.log('>>offer', offerData);
        if (connectedClients[offerData.targetId]) {
            console.log('Sending incoming-call to:', offerData.targetId);
            connectedClients[offerData.targetId].emit('incoming-call', {
                offer: offerData.offer,
                from: offerData.senderId,
                senderName: offerData.senderName,
                senderId: offerData.senderId,
            });
        }
    });
    socket.on('answer', answerData => {
        console.log(answerData, 'answerData');
        // const targetId = socket.handshake.query.targetId;
        if (connectedClients[answerData.targetId]) {
            connectedClients[answerData.targetId].emit('answer', answerData.answer);
        }
    });
    socket.on('ice-candidate', candidate => {
        socket.emit('ice-candidate', candidate);
        console.log(candidate, '>> recive candidate');
        // const targetId = socket.handshake.query.targetId as string;
        // if (connectedClients[targetId]) {
        //   connectedClients[targetId].emit('ice-candidate', candidate);
        // }
    });
    socket.on('end-call', receiverId => {
        // const targetId = socket.handshake.query.targetId;
        if (connectedClients[receiverId]) {
            connectedClients[receiverId].emit('end-call');
        }
    });
};
exports.AudioHandler = AudioHandler;
