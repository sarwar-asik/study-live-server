# Study Live server

# Real-Time Communication Server

This server is designed for a real-time communication application that supports audio, video, and chat functionalities. It includes comprehensive authentication, messaging, and image upload features. The server uses a PostgreSQL database managed with Prisma ORM, and it integrates security measures such as JWT authentication, CORS policy, and data validation using Zod.

## Features

- **Real-Time Communication**: Supports audio, video, and chat features using Socket.IO.
- **Authentication**: Secure user authentication with JWT tokens.
- **Messaging**: Send and receive messages with optional image attachments handled by Multer.
- **Global Error Handling**: Centralized error management for consistent error responses.
- **Validation**: Zod is used for request data validation to ensure data integrity.
- **Security**: CORS policy and JWT authentication provide a secure environment.
- **PostgreSQL with Prisma ORM**: Efficient data management with type-safe database access.
- **Git Hooks with Husky**: Enforces code quality with pre-commit and pre-push hooks.

## Technology Stack

- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.IO
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer
- **Validation**: Zod
- **Security**: CORS, JWT
- **Git Hooks**: Husky

## API Endpoints

### Authentication

- **POST /api/auth/sign-up**  
  Register a new user.

  - **Body**: `{ username, email, password ,image}`

- **POST /api/auth/login**  
  Authenticate a user and retrieve a JWT token.

  - **Body**: `{ email, password }`

- **GET /api/auth/profile**  
  Retrieve the authenticated user's profile.

  - **Headers**: `{ Authorization: Bearer <token> }`

- **GET /api/user/:id**  
    Retrieve the authenticated SIngle user's data.
  - **Headers**: `{ Authorization: Bearer <token> }`

### Messaging

- **POST /api/messages**  
  Send a new message.

  - **Body**: `{ recipientId, content }`
  - **Headers**: `{ Authorization: Bearer <token> }`

- **POST /api/messages/image**  
  Send a new message with an image attachment.

  - **Form Data**: `{ recipientId, content, imageFile }`
  - **Headers**: `{ Authorization: Bearer <token> }`

- **GET /api/messages?senderId=1234&receiverId=1234123**  
  Retrieve all messages in a conversation.
  - **Headers**: `{ Authorization: Bearer <token> }`

### Real-Time Communication

- **WebSocket Events**
  - `connect`: Connect to the WebSocket server.
  - `message`: Send and receive chat messages in real-time.
  - `audio-call`: Initiate and manage audio calls.
  - `video-call`: Initiate and manage video calls.

## Security

- **CORS Policy**: Configured to allow secure cross-origin requests.
- **JWT Authentication**: Protects API routes, ensuring only authenticated users can access resources.
- **Zod Validation**: Validates incoming request data to prevent malformed or malicious inputs.
- **Husky Git Hooks**: Pre-commit and pre-push hooks enforce code quality and consistency.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarwar-asik/study-live-server

   cd study-live-server
   ```
