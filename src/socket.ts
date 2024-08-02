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

io.on('connection', socket => {
  console.log('user is connected');
  roomHandler(socket);
  chatHandler(socket);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

export default httpServer;
