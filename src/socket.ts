import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { chatHandler } from './app/socket/chat/chatHandle';
import { roomHandler } from './app/socket/room';
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

  roomHandler(socket);
  chatHandler(socket, connectedClients);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

export default httpServer;
