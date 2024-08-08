"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRelationalFieldsMapper = exports.messageRelationalFields = exports.MessageFilterableFields = exports.MessageSearchableField = void 0;
exports.MessageSearchableField = ['receiverId', 'senderId'];
exports.MessageFilterableFields = [
    'receiverId',
    'senderId',
    'searchTerm',
    'message',
];
exports.messageRelationalFields = ['receiverId', 'senderId'];
exports.messageRelationalFieldsMapper = {
    sender: 'users',
    receiver: 'users',
};
