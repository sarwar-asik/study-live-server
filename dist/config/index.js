"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    superAdmin: {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD
    },
    kafka: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: ((_a = process.env.KAFKA_BROKERS) === null || _a === void 0 ? void 0 : _a.split(',')) || [],
    },
    server_name: process.env.SERVER_NAME,
    database_url: process.env.DATABASE_URL,
    default_student_pass: process.env.DEFAULT_STUDENT_PASS,
    default_faculty_pass: process.env.DEFAULT_FACULTY_PASS,
    default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    server_url: process.env.SERVER_URL,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    nodeMailer: {
        FromEmail: process.env.FROMEMAIL,
        appPassword: process.env.APPPASSWORD,
    },
    frontend_url: process.env.FRONTEND_URL,
};
