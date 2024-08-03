import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { chatHandler } from './app/socket/chat/chatHandle';
// const app: Application = express();

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
// const connectUsers =[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectedClients: any = {};

io.on('connection', socket => {
  console.log('user is connected', socket?.handshake?.query?.id);
  socket?.id = socket?.handshake?.query?.id;
  connectedClients[socket?.id] = socket;

  // roomHandler(socket);
  // console.log(socket.id, 'socket.id');
  socket.on('offer', offerData => {
    console.log('>>offer', offerData);
    if (connectedClients[offerData.targetId]) {
      // console.log('Sending incoming-call to:', offerData.targetId);
      connectedClients[offerData.targetId].emit('incoming-call', {
        offer: offerData.offer,
        from: socket.id,
        senderName: offerData.senderName,
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
    const targetId = socket.handshake.query.targetId as string;
    if (connectedClients[targetId]) {
      connectedClients[targetId].emit('ice-candidate', candidate);
    }
  });

  socket.on('end-call', receiverId => {
    // const targetId = socket.handshake.query.targetId;
    if (connectedClients[receiverId]) {
      connectedClients[receiverId].emit('end-call');
    }
  });

  chatHandler(socket, connectedClients);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

export default httpServer;
