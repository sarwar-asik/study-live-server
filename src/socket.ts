import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { roomHandler } from './app/socket/room';
// const app: Application = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  console.log('user is connected');
  roomHandler(socket);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

export default httpServer;
