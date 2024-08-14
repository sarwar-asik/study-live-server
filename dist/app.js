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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const liveKit_service_1 = require("./app/modules/livekit/liveKit.service");
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://study-live-frontend.onrender.com',
    ],
    // config.env === 'development'
    //   ? [
    //       '*',
    //       // 'http://localhost:3000',
    //       // 'http://127.0.0.1:3000',
    //       // 'http://192.168.0.101:3000',
    //       // 'http://localhost:5173',
    //       // 'http://localhost:5174',
    //     ]
    //   : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use((0, cookie_parser_1.default)());
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Root route
app.get('/', (req, res) => {
    res.json({
        status: http_status_1.default.OK,
        message: `sarwar-server is running on http://localhost:${config_1.default.port}`,
    });
});
// API routes
app.use('/api/v1', routes_1.default);
app.get('/getToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield liveKit_service_1.LiveKitService.createToken();
    res.send(token);
}));
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle not found
app.use((req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
});
exports.default = app;
