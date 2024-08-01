/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

// const rooms: Record<string[]> = {};
// const rooms: Record<string, Record<string, IUser>> = {};
const rooms: Record<string, IUser[]> = {};
// const rooms: IUser[] = [];
// const chats: Record<string, IMessage[]> = {};
interface IUser {
  userId: string;
  userName: string;
}
interface IRoomParams {
  roomId: string;
  userId: string;
}

interface IJoinRoomParams extends IRoomParams {
  userName: string;
}
interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];

    console.log(rooms, 'rooms when created');

    socket.emit('room-created', { roomId });
    console.log('user created the room');
  };

  const joinRoom = ({
    roomId,
    userId,
    name,
  }: {
    roomId: string;
    userId: string;
    name: string;
  }) => {
    console.log(roomId, userId,'userId');
    if (rooms[roomId]) {
      // Check if the user is already in the room
      const userExists = rooms[roomId].some(user => user.userId === userId);

      console.log(userExists);
      if (!userExists) {
        rooms[roomId].push({ userId, userName: name ?? '' });

        console.log('user joined');
      } else {
        console.log('rooms>>', rooms);
        console.log('User already in the room');
        socket.emit('user-already-in-room', { roomId, userId });
      }
      socket.join(roomId);
      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      });

      socket.on('disconnect', () => {
        console.log('user left the room');
        leaveRoom({ roomId, userId });
      });
    } else {
      console.log('Room does not exist');
      socket.emit('room-not-found', { roomId });
    }
  };

  const leaveRoom = ({ roomId, userId }: IRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(
        (user: IUser) => user.userId !== userId
      );
      socket.to(roomId).emit('user-disconnected', userId);
      socket.leave(roomId);
    } else {
      console.log('Room does not exist');
    }
    // socket.leave(roomId);
  };
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  //   socket.on('start-sharing', startSharing);
  //   socket.on('stop-sharing', stopSharing);
  //   socket.on('send-message', addMessage);
  //   socket.on('change-name', changeName);
};
