import { Socket } from 'socket.io';
import { MessageServices } from '../../modules/message/message.service';

type IMessage = {
  message: string;
  senderId: string;
  receiverId: string;
};

export const chatHandler = (socket: Socket, connectedClients: any) => {
  // console.log(socket?.id, 'socket?.id');
  socket.emit('get-users', { users: [] });

  // console.log(connectedClients, 'connectedClients');
  // const clientSocket = connectedClients[socket?.id]
  function emitMessageToClients(clientIds: string[], message: IMessage) {
    clientIds.forEach(clientId => {
      const clientSocket = connectedClients[clientId];
      if (clientSocket) {
        clientSocket.emit('new-message', message);
      } else {
        console.log(`Client with ID ${clientId} is not Online.`);
      }
    });
  }

  socket.on(
    'send-message',
    async ({ message, senderId, receiverId }: IMessage) => {
      console.log(message, 'message');
      console.log({
        message,
        senderId,
        receiverId,
      });
      const createMessage = await MessageServices.insertDB({
        message,
        senderId,
        receiverId,
      });
      socket.broadcast.emit('new-message', { createMessage });
      // if (createMessage) {
      //   emitMessageToClients([senderId, receiverId], createMessage);
      // }
    }
  );
};
