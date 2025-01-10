"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     RoomUser:
 *       type: object
 *       required:
 *         - socketId
 *         - userId
 *         - userName
 *         - roomId
 *       properties:
 *         socketId:
 *           type: string
 *           description: Socket ID of the connected user
 *         userId:
 *           type: string
 *           description: User's unique identifier
 *         userName:
 *           type: string
 *           description: Display name of the user
 *         roomId:
 *           type: string
 *           description: ID of the room user is in
 *
 *     Room:
 *       type: object
 *       required:
 *         - roomId
 *         - users
 *         - createdAt
 *       properties:
 *         roomId:
 *           type: string
 *           description: Unique identifier for the room
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoomUser'
 *           description: List of users in the room
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Room creation timestamp
 *
 * tags:
 *   - name: Video Chat Room
 *     description: Video chat room socket events and Kafka integration
 */
/**
 * @swagger
 * /socket/room-chat:
 *   get:
 *     summary: Video chat room socket and Kafka events documentation
 *     tags: [Video Chat Room]
 *     responses:
 *       200:
 *         description: Socket and Kafka events documentation for video chat rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 socketEvents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event:
 *                         type: string
 *                         description: Socket event name
 *                       type:
 *                         type: string
 *                         enum: [emit, on]
 *                         description: Event type
 *                       payload:
 *                         type: object
 *                         description: Event data structure
 *                 kafkaTopics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       topic:
 *                         type: string
 *                         description: Kafka topic name
 *                       payload:
 *                         type: object
 *                         description: Message payload structure
 */
/**
 * @socketio
 * @event join-room
 * @type on
 * @description Handles user joining a video chat room
 * @request
 * {
 *   userId: string - User's unique identifier
 *   userName: string - User's display name
 *   roomId: string - Room to join
 * }
 * @kafka
 * Topic: room-join
 * Payload: {
 *   user: RoomUser,
 *   users: RoomUser[],
 *   roomId: string
 * }
 */
/**
 * @socketio
 * @event room-joined
 * @type emit
 * @description Emitted when user successfully joins a room
 * @response
 * {
 *   users: RoomUser[] - List of users in the room
 *   roomId: string - Room identifier
 * }
 */
/**
 * @socketio
 * @event offer
 * @type on/emit
 * @description Handles WebRTC offer signal
 * @payload
 * {
 *   offer: RTCSessionDescriptionInit - WebRTC offer
 *   from: string - Sender's ID
 *   to: string - Receiver's ID
 *   roomId: string - Room identifier
 * }
 * @kafka
 * Topic: webrtc-offer
 */
/**
 * @socketio
 * @event answer
 * @type on/emit
 * @description Handles WebRTC answer signal
 * @payload
 * {
 *   answer: RTCSessionDescriptionInit - WebRTC answer
 *   from: string - Sender's ID
 *   to: string - Receiver's ID
 *   roomId: string - Room identifier
 * }
 * @kafka
 * Topic: webrtc-answer
 */
/**
 * @socketio
 * @event ice-candidate
 * @type on/emit
 * @description Handles ICE candidate exchange
 * @payload
 * {
 *   candidate: RTCIceCandidateInit - ICE candidate
 *   from: string - Sender's ID
 *   to: string - Receiver's ID
 *   roomId: string - Room identifier
 * }
 * @kafka
 * Topic: ice-candidate
 */
/**
 * @socketio
 * @event leave-room
 * @type on
 * @description Handles user leaving a room
 * @kafka
 * Topic: room-leave
 * Payload: {
 *   userId: string,
 *   roomId: string,
 *   remainingUsers: RoomUser[]
 * }
 */
/**
 * @kafka
 * @topic room-join
 * @description Handles room join events across server instances
 * @payload
 * {
 *   user: RoomUser - Joining user details
 *   users: RoomUser[] - Updated room user list
 *   roomId: string - Room identifier
 * }
 */
/**
 * @kafka
 * @topic room-leave
 * @description Handles room leave events across server instances
 * @payload
 * {
 *   userId: string - Leaving user's ID
 *   roomId: string - Room identifier
 *   remainingUsers: RoomUser[] - Updated room user list
 * }
 */
/**
 * @kafka
 * @topic webrtc-offer
 * @description Distributes WebRTC offers across server instances
 * @payload
 * {
 *   offer: RTCSessionDescriptionInit
 *   from: string
 *   to: string
 *   roomId: string
 * }
 */
/**
 * @kafka
 * @topic webrtc-answer
 * @description Distributes WebRTC answers across server instances
 * @payload
 * {
 *   answer: RTCSessionDescriptionInit
 *   from: string
 *   to: string
 *   roomId: string
 * }
 */
/**
 * @kafka
 * @topic ice-candidate
 * @description Distributes ICE candidates across server instances
 * @payload
 * {
 *   candidate: RTCIceCandidateInit
 *   from: string
 *   to: string
 *   roomId: string
 * }
 */ 
