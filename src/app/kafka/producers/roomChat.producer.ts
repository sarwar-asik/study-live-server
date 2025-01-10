import { Kafka, Producer } from 'kafkajs';
import config from '../../../config';

class RoomChatProducer {
  private producer: Producer;
  private static instance: RoomChatProducer;

  private constructor() {
    const kafka = new Kafka({
      clientId: 'room-chat-producer',
      brokers: config.kafka.brokers,
    });
    this.producer = kafka.producer();
  }

  public static getInstance(): RoomChatProducer {
    if (!RoomChatProducer.instance) {
      RoomChatProducer.instance = new RoomChatProducer();
    }
    return RoomChatProducer.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('RoomChat Producer connected successfully');
    } catch (error) {
      console.error('Error connecting RoomChat Producer:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('RoomChat Producer disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting RoomChat Producer:', error);
      throw error;
    }
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export default RoomChatProducer;
