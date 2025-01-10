// ! socket chat docs

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management and chat socket functionality
 *
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       required:
 *         - message
 *         - senderId
 *         - receiverId
 *       properties:
 *         message:
 *           type: string
 *           description: Content of the message
 *         senderId:
 *           type: string
 *           description: ID of the message sender
 *         receiverId:
 *           type: string
 *           description: ID of the message recipient
 *         message_type:
 *           type: string
 *           enum: [text, image, video, file]
 *           default: text
 *           description: Type of the message content
 *
 * /chat:
 *   get:
 *     tags: [Message]
 *     summary: WebSocket Chat Connection
 *     description: |
 *       WebSocket endpoint for real-time chat functionality.
 *
 *       ## Connection Details
 *       - Namespace: `/chat`
 *       - Authentication: Required (JWT token)
 *       - Supported Roles: USERAPP, ADMIN
 *
 *       ## Events
 *       1. Get Users Event:
 *          - Event: 'get-users'
 *          - Type: emit
 *          - Response: { users: Array<User> }
 *          - Description: Emitted when user connects to initialize user list
 *
 *       2. Send Message Event:
 *          - Event: 'send-message'
 *          - Type: on
 *          - Payload: { message: string, senderId: string, receiverId: string }
 *          - Description: Handles incoming chat messages
 *
 *       3. New Message Event:
 *          - Event: 'new-message'
 *          - Type: emit
 *          - Response: { 
 *              success: boolean,
 *              data?: { message, senderId, receiverId, timestamp },
 *              error?: string 
 *            }
 *          - Description: Emitted when a new message is received
 *
 *       ## Implementation Example:
 *       ```javascript
 *       const socket = io('/chat', {
 *         auth: { token: 'your-jwt-token' }
 *       });
 *
 *       // Listen for user list
 *       socket.on('get-users', ({ users }) => {
 *         console.log('Connected users:', users);
 *       });
 *
 *       // Send message
 *       socket.emit('send-message', {
 *         message: 'Hello!',
 *         senderId: 'user123',
 *         receiverId: 'user456'
 *       });
 *
 *       // Listen for new messages
 *       socket.on('new-message', (response) => {
 *         if (response.success) {
 *           console.log('New message:', response.data);
 *         } else {
 *           console.error('Message error:', response.error);
 *         }
 *       });
 *
 *       Example Success Response
 *       {
 *         success: true,
 *         data: {
 *           message: "Hello",
 *           senderId: "user123",
 *           receiverId: "user456",
 *           timestamp: "2025-01-10T12:57:09+06:00"
 *         }
 *       }
 *      
 *       Example Error Response
 *       {
 *         success: false,
 *         error: "Invalid message data"
 *       }
 *       ```
 *     security:
 *       - bearerAuth: []
 */