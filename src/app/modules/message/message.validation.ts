import { z } from 'zod';
const createMessage = z.object({
  body: z.object({
    message: z.string({
      required_error: 'message is Required (zod)',
    }),
    senderId: z.string({
      required_error: 'senderId is Required (zod)',
    }),
    receiverId: z.string({
      required_error: 'receiverId is Required (zod)',
    }),
  }),
});
const updateMessage = z.object({
  body: z.object({
    message: z
      .string({
        required_error: 'message is Required (zod)',
      })
      .optional(),
    senderId: z
      .string({
        required_error: 'senderId is Required (zod)',
      })
      .optional(),
    receiverId: z
      .string({
        required_error: 'receiverId is Required (zod)',
      })
      .optional(),
  }),
});

export const MessageValidation = { createMessage, updateMessage };
