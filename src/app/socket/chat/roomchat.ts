/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Socket } from 'socket.io';
import RoomChatProducer from '../../kafka/producers/roomChat.producer';
import RoomChatConsumer from '../../kafka/consumers/roomChat.consumer';
import { ROOM_CHAT_TOPICS } from '../../kafka/topics/roomChat.topics';

// Types for room management
interface IRoomUser {
  socketId: string;
  userId: string;
  userName: string;
  roomId: string;
}

interface IRoom {
  roomId: string;
  users: IRoomUser[];
  createdAt: Date;
}

interface IRoomJoinPayload {
  userId: string;
  userName: string;
  roomId: string;
}

interface IOfferPayload {
  offer: RTCSessionDescriptionInit;
  from: string;
  to: string;
  roomId: string;
}

interface IAnswerPayload {
  answer: RTCSessionDescriptionInit;
  from: string;
  to: string;
  roomId: string;
}

interface IIceCandidatePayload {
  candidate: RTCIceCandidateInit;
  from: string;
  to: string;
  roomId: string;
}

// Store active rooms
const activeRooms = new Map<string, IRoom>();

/**
 * Handles video chat room functionality with Kafka integration
 * @param socket - Socket instance for the connected client
 */
export const roomChatHandler = async (socket: Socket): Promise<void> => {
  let currentUser: IRoomUser | null = null;
  const producer = RoomChatProducer.getInstance();
  const consumer = RoomChatConsumer.getInstance();

  // Connect to Kafka
  await producer.connect();
  await consumer.connect();

  // Join room event handler
  socket.on('join-room', async ({ userId, userName, roomId }: IRoomJoinPayload) => {
    try {
      // Create or get room
      let room = activeRooms.get(roomId);
      if (!room) {
        room = {
          roomId,
          users: [],
          createdAt: new Date(),
        };
        activeRooms.set(roomId, room);
      }

      // Create user object
      currentUser = {
        socketId: socket.id,
        userId,
        userName,
        roomId,
      };

      // Add user to room
      room.users.push(currentUser);
      
      // Add socket to consumer map
      consumer.addSocket(userId, socket);

      // Send join event to Kafka
      await producer.sendMessage(ROOM_CHAT_TOPICS.ROOM_JOIN, {
        user: currentUser,
        users: room.users,
        roomId,
      });

      // Send room info to joined user
      socket.emit('room-joined', {
        users: room.users,
        roomId,
      });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('room-error', { message: 'Failed to join room' });
    }
  });

  // Handle WebRTC signaling through Kafka
  socket.on('offer', async (payload: IOfferPayload) => {
    await producer.sendMessage(ROOM_CHAT_TOPICS.WEBRTC_OFFER, payload);
  });

  socket.on('answer', async (payload: IAnswerPayload) => {
    await producer.sendMessage(ROOM_CHAT_TOPICS.WEBRTC_ANSWER, payload);
  });

  socket.on('ice-candidate', async (payload: IIceCandidatePayload) => {
    await producer.sendMessage(ROOM_CHAT_TOPICS.ICE_CANDIDATE, payload);
  });

  // Handle user leaving
  const handleDisconnect = async () => {
    if (currentUser) {
      const room = activeRooms.get(currentUser.roomId);
      if (room) {
        // Remove user from room
        room.users = room.users.filter(user => user.socketId !== socket.id);

        // Remove socket from consumer map
        consumer.removeSocket(currentUser.userId);

        // If room is empty, remove it
        if (room.users.length === 0) {
          activeRooms.delete(currentUser.roomId);
        }

        // Send leave event to Kafka
        await producer.sendMessage(ROOM_CHAT_TOPICS.ROOM_LEAVE, {
          userId: currentUser.userId,
          roomId: currentUser.roomId,
          remainingUsers: room.users,
        });
      }
    }
  };

  socket.on('leave-room', handleDisconnect);
  socket.on('disconnect', handleDisconnect);

  // Subscribe to all room chat topics
  await consumer.subscribe(Object.values(ROOM_CHAT_TOPICS));
};