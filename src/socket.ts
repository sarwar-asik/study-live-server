/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { AudioHandler } from './app/socket/audio';
import { chatHandler } from './app/socket/chat/chatHandle';
import { roomHandler } from './app/socket/room';
// const app: Application = express();

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
// const connectUsers =[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectedClients: any = {};

io.on('connection', socket => {
  console.log('user is connected', socket?.handshake?.query?.id);
  const userId = socket.handshake?.query?.id as string;
  (socket as any).id = userId;
  connectedClients[socket?.id] = socket;
  roomHandler(socket);
  // roomHandler(socket);
  // console.log(socket.id, 'socket.id');

  chatHandler(socket);
  AudioHandler(socket, connectedClients);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

export default httpServer;
