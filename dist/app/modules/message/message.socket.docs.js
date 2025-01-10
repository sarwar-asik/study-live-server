"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *         - senderId
 *         - receiverId
 *       properties:
 *         message:
 *           type: string
 *           description: The content of the message
 *         senderId:
 *           type: string
 *           description: ID of the user sending the message
 *         receiverId:
 *           type: string
 *           description: ID of the user receiving the message
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful
 *         data:
 *           type: object
 *           description: Contains the message data if operation was successful
 *         error:
 *           type: string
 *           description: Error message if operation failed
 *
 * tags:
 *   - name: Chat
 *     description: Real-time chat socket events
 */
/**
 * @swagger
 * /socket/chat:
 *   get:
 *     summary: Real-time chat socket events documentation
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Socket events documentation for real-time chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event:
 *                         type: string
 *                         description: The name of the event
 *                       type:
 *                         type: string
 *                         description: Type of the event (`emit` or `on`)
 *                       request:
 *                         type: object
 *                         description: Payload sent with the event
 *                       response:
 *                         type: object
 *                         description: Response emitted by the server
 */
/**
 * @socketio
 * @event get-users
 * @type emit
 * @description Emitted when a user connects to initialize their user list
 * @response
 * {
 *   users: Array - List of connected users
 * }
 */
/**
 * @socketio
 * @event send-message
 * @type on
 * @description Handles incoming chat messages
 * @request
 * {
 *   message: string - Content of the message
 *   senderId: string - ID of the sender
 *   receiverId: string - ID of the receiver
 * }
 */
/**
 * @socketio
 * @event new-message
 * @type emit
 * @description Emitted when a new message is received
 * @response
 * {
 *   success: boolean - Operation success status
 *   data?: object - Message data if successful
 *   error?: string - Error message if failed
 * }
 * @example
 * // Success Response
 * {
 *   success: true,
 *   data: {
 *     message: "Hello",
 *     senderId: "user1",
 *     receiverId: "user2",
 *     timestamp: "2025-01-10T11:52:16+06:00"
 *   }
 * }
 *
 * // Error Response
 * {
 *   success: false,
 *   error: "Invalid message data"
 * }
 */
