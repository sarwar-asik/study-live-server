/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Socket } from 'socket.io';
import { MessageServices } from '../../modules/message/message.service';


interface IMessage {
  message: string;
  senderId: string;
  receiverId: string;
}

interface IMessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}


export const chatHandler = (socket: Socket): void => {
  // Initialize connected users
  socket.emit('get-users', { users: [] });
  socket.on(
    'send-message',
    async ({ message, senderId, receiverId }: IMessage): Promise<void> => {
      try {
        // Validate message data
        if (!message?.trim() || !senderId || !receiverId) {
          socket.emit('new-message', {
            success: false,
            error: 'Invalid message data',
          } as IMessageResponse);
          return;
        }

        // Store message in database
        const createMessage = await MessageServices.insertDB({
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
        } as IMessageResponse);

        // Confirm message sent to sender
        socket.emit('new-message', {
          success: true,
          data: createMessage,
        } as IMessageResponse);

      } catch (error) {
        console.error('Error in send-message handler:', error);
        socket.emit('new-message', {
          success: false,
          error: 'Failed to process message',
        } as IMessageResponse);
      }
    }
  );

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
