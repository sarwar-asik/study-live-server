/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};
interface IUser {
  peerId: string;
  userName: string;
}
interface IRoomParams {
  roomId: string;
  peerId: string;
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
    rooms[roomId] = {};
    
    socket.emit('room-created', { roomId });
    console.log('user created the room');
  };

  socket.on('create-room', createRoom);
  //   socket.on('join-room', joinRoom);
  //   socket.on('start-sharing', startSharing);
  //   socket.on('stop-sharing', stopSharing);
  //   socket.on('send-message', addMessage);
  //   socket.on('change-name', changeName);
};
