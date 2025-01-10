"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const config_1 = __importDefault(require("../../../config"));
class RoomChatProducer {
    constructor() {
        const kafka = new kafkajs_1.Kafka({
            clientId: 'room-chat-producer',
            brokers: config_1.default.kafka.brokers,
        });
        this.producer = kafka.producer();
    }
    static getInstance() {
        if (!RoomChatProducer.instance) {
            RoomChatProducer.instance = new RoomChatProducer();
        }
        return RoomChatProducer.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.producer.connect();
                console.log('RoomChat Producer connected successfully');
            }
            catch (error) {
                console.error('Error connecting RoomChat Producer:', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.producer.disconnect();
                console.log('RoomChat Producer disconnected successfully');
            }
            catch (error) {
                console.error('Error disconnecting RoomChat Producer:', error);
                throw error;
            }
        });
    }
    sendMessage(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.producer.send({
                    topic,
                    messages: [{ value: JSON.stringify(message) }],
                });
            }
            catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        });
    }
}
exports.default = RoomChatProducer;
