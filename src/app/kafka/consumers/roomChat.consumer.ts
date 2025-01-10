import { Kafka, Consumer } from 'kafkajs';
import config from '../../../config';
import { Socket } from 'socket.io';

class RoomChatConsumer {
  private consumer: Consumer;
  private static instance: RoomChatConsumer;
  private socketMap: Map<string, Socket> = new Map();

  private constructor() {
    const kafka = new Kafka({
      clientId: 'room-chat-consumer',
      brokers: config.kafka.brokers,
    });
    this.consumer = kafka.consumer({ groupId: 'room-chat-group' });
  }

  public static getInstance(): RoomChatConsumer {
    if (!RoomChatConsumer.instance) {
      RoomChatConsumer.instance = new RoomChatConsumer();
    }
    return RoomChatConsumer.instance;
  }

  public addSocket(userId: string, socket: Socket): void {
    this.socketMap.set(userId, socket);
  }

  public removeSocket(userId: string): void {
    this.socketMap.delete(userId);
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('RoomChat Consumer connected successfully');
    } catch (error) {
      console.error('Error connecting RoomChat Consumer:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log('RoomChat Consumer disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting RoomChat Consumer:', error);
      throw error;
    }
  }

  async subscribe(topics: string[]): Promise<void> {
    try {
      await this.consumer.subscribe({ topics });
      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          if (!message.value) return;
          
          const data = JSON.parse(message.value.toString());
          
          switch (topic) {
            case 'room-join':
              this.handleRoomJoin(data);
              break;
            case 'room-leave':
              this.handleRoomLeave(data);
              break;
            case 'webrtc-offer':
              this.handleWebRTCOffer(data);
              break;
            case 'webrtc-answer':
              this.handleWebRTCAnswer(data);
              break;
            case 'ice-candidate':
              this.handleICECandidate(data);
              break;
          }
        },
      });
    } catch (error) {
      console.error('Error in consumer subscription:', error);
      throw error;
    }
  }

  private handleRoomJoin(data: any): void {
    const { userId, roomId } = data;
    const socket = this.socketMap.get(userId);
    if (socket) {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', data);
    }
  }

  private handleRoomLeave(data: any): void {
    const { userId, roomId } = data;
    const socket = this.socketMap.get(userId);
    if (socket) {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', data);
    }
  }

  private handleWebRTCOffer(data: any): void {
    const { to } = data;
    const socket = this.socketMap.get(to);
    if (socket) {
      socket.emit('offer', data);
    }
  }

  private handleWebRTCAnswer(data: any): void {
    const { to } = data;
    const socket = this.socketMap.get(to);
    if (socket) {
      socket.emit('answer', data);
    }
  }

  private handleICECandidate(data: any): void {
    const { to } = data;
    const socket = this.socketMap.get(to);
    if (socket) {
      socket.emit('ice-candidate', data);
    }
  }
}

export default RoomChatConsumer;
