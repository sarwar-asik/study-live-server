import { Socket } from 'socket.io';

export const chatHandler = (socket: Socket) => {
  socket.emit('get-users', { users: [] });

  socket.on('send-message', ({ message }) => {
    socket.broadcast.emit('message', { message });
  });
  
};
