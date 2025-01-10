# Study Live Server 

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4.x-blue.svg)](https://www.typescriptlang.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.x-black.svg)](https://socket.io)
[![Kafka](https://img.shields.io/badge/Kafka-Latest-red.svg)](https://kafka.apache.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14.x-blue.svg)](https://www.postgresql.org)

</div>

## Overview

A powerful real-time communication server supporting audio/video calls, chat, and file sharing. Built with modern technologies and best practices for scalability and performance.

## Features

### Authentication & Security
- JWT-based authentication
- Role-based access control
- Secure password hashing
- CORS protection

### Real-Time Communication
- Text chat with typing indicators
- Audio/Video calls using WebRTC
- File sharing & image uploads
- Presence detection

### Scalability
- Kafka integration for distributed events
- Socket.IO for real-time communication
- Horizontal scaling support
- Redis for session management

### Developer Experience
- TypeScript for type safety
- Swagger API documentation
- Prisma ORM for database operations
- Husky for git hooks

## Quick Start

### Prerequisites

- Node.js (v18.x or later)
- PostgreSQL (v14.x or later)
- Kafka cluster
- Redis (optional, for session storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarwar-asik/study-live-server
   cd study-live-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see Environment Variables section below)

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
SERVER_NAME=study-live-server

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# Admin Credentials
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin123
DEFAULT_STUDENT_PASS=student123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Kafka Configuration
KAFKA_CLIENT_ID=study-live-server
KAFKA_BROKERS=kafka://kafka-0.kafka.svc.cluster.local:9092,kafka-1.kafka.svc.cluster.local:9092

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000
```

## API Documentation

### REST Endpoints

#### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/user/:id` - Get user details

#### Messaging
- `POST /api/messages` - Send message
- `POST /api/messages/image` - Send message with image
- `GET /api/messages` - Get conversation history

### Socket.IO Events

#### Chat Events
- `send-message` - Send chat message
- `new-message` - Receive new message
- `typing` - User typing indicator

#### Video Chat Events
- `join-room` - Join video chat room
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange

### Kafka Topics
- `room-join` - Room join events
- `room-leave` - Room leave events
- `webrtc-offer` - WebRTC offers
- `webrtc-answer` - WebRTC answers
- `ice-candidate` - ICE candidates

## Security Features

- JWT authentication
- Request validation using Zod
- CORS protection
- Rate limiting
- Secure password hashing
- Input sanitization

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, email support@studylive.com or join our Slack channel.
