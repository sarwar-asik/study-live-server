import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

type IRoomParams = {
  roomId: string;
  peerId: string;
};

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
  const createRoom = ({
    peerId,
    receiverId,
    senderName,
  }: {
    peerId: string;
    receiverId: string;
    senderName: string;
  }) => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    joinRoom({ roomId, peerId });
    socket.broadcast.emit('room-created-b', { roomId, receiverId, senderName });
    socket.emit('room-created', { roomId, receiverId, senderName });
  };
  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    console.log(peerId, ' joined room ', roomId);
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { roomId, peerId });
      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      });
    } else {
      //   createRoom({ peerId });
      console.log('room not found', roomId);
    }

    socket.on('disconnect', () => {
      console.log('user disconnected ', peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    socket.to(roomId).emit('user-disconnected', peerId);
    rooms[roomId] = rooms[roomId]?.filter(id => id !== peerId);
  };

  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('leave-room', leaveRoom);
};
