/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { io } from '../../../socket';

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
  // Create a new room
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];

    socket.emit('room-created', { roomId });
  };

  // Handle joining a room
  const joinRoom = ({
    roomId,
    userId,
    name,
  }: {
    roomId: string;
    userId: string;
    name: string;
  }) => {
    if (rooms[roomId]) {
      const userExists = rooms[roomId].some(user => user.userId === userId);

      if (!userExists) {
        rooms[roomId].push({ userId, userName: name ?? '' });
        socket.join(roomId);

        // Notify the user who joined
        socket.emit('get-users', {
          roomId,
          participants: rooms[roomId].map(user => user.userId),
        });

        // Notify other users in the room
        socket.emit('user-joined', { userId, roomId });

        // Handle disconnection
        socket.on('disconnect', () => {
          leaveRoom({ roomId, userId });
        });
      } else {
        socket.emit('user-already-in-room', { roomId, userId });
      }
    } else {
      socket.emit('room-not-found', { roomId });
    }
  };

  // Handle leaving a room
  const leaveRoom = ({ roomId, userId }: IRoomParams) => {
    console.log(rooms);
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(user => user.userId !== userId);
      console.log(rooms[roomId], 'ooms[roomId]');
      socket.emit('user-disconnected', userId);
      socket.leave(roomId);
    }
  };

  // Handle signaling for WebRTC
  const handleOffer = ({ offer, userId }: { offer: any; userId: string }) => {
    const recipientSocket = io.sockets.sockets.get(userId);
    if (recipientSocket) {
      socket.emit('offer', { offer, userId: socket.id });
    }
  };

  const handleAnswer = ({
    answer,
    userId,
  }: {
    answer: any;
    userId: string;
  }) => {
    const recipientSocket = io.sockets.sockets.get(userId);
    // console.log("🚀 ~ file: index.ts:103 ~ roomHandler ~ recipientSocket:", recipientSocket)
    if (recipientSocket) {
      socket.emit('answer', { answer });
    }
  };

  const handleCandidate = ({
    candidate,
    userId,
  }: {
    candidate: any;
    userId: string;
  }) => {
    const recipientSocket = io.sockets.sockets.get(userId);
    if (recipientSocket) {
      socket.emit('candidate', { candidate });
    }
  };

  // Register event listeners
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('offer', handleOffer);
  socket.on('answer', handleAnswer);
  socket.on('candidate', handleCandidate);
  socket.on('end-call', leaveRoom);
};
