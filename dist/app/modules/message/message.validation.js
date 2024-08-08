"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
const createMessage = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({
            required_error: 'message is Required (zod)',
        }),
        senderId: zod_1.z.string({
            required_error: 'senderId is Required (zod)',
        }),
        receiverId: zod_1.z.string({
            required_error: 'receiverId is Required (zod)',
        }),
    }),
});
const updateMessage = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z
            .string({
            required_error: 'message is Required (zod)',
        })
            .optional(),
        senderId: zod_1.z
            .string({
            required_error: 'senderId is Required (zod)',
        })
            .optional(),
        receiverId: zod_1.z
            .string({
            required_error: 'receiverId is Required (zod)',
        })
            .optional(),
    }),
});
exports.MessageValidation = { createMessage, updateMessage };
