"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const audio_1 = require("./app/socket/audio");
const chatHandle_1 = require("./app/socket/chat/chatHandle");
const room_1 = require("./app/socket/room");
// const app: Application = express();
const httpServer = (0, http_1.createServer)(app_1.default);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
// const connectUsers =[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectedClients = {};
exports.io.on('connection', socket => {
    var _a, _b, _c, _d;
    console.log('user is connected', (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.id);
    const userId = (_d = (_c = socket.handshake) === null || _c === void 0 ? void 0 : _c.query) === null || _d === void 0 ? void 0 : _d.id;
    socket.id = userId;
    connectedClients[socket === null || socket === void 0 ? void 0 : socket.id] = socket;
    (0, room_1.roomHandler)(socket);
    // roomHandler(socket);
    // console.log(socket.id, 'socket.id');
    (0, chatHandle_1.chatHandler)(socket);
    (0, audio_1.AudioHandler)(socket, connectedClients);
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});
exports.default = httpServer;
