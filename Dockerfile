# Stage 1: Development dependencies & Build
FROM node:18-alpine AS builder

# Install dependencies required for node-gyp, building native modules, and Prisma
RUN apk add --no-cache python3 make g++ gcc openssl openssl-dev libc6-compat

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including development dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Install required system dependencies
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat \
    tini

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Generate Prisma client in production
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN npx prisma generate

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Environment variables
ENV NODE_ENV=production \
    PORT=5001 \
    DATABASE_URL="" \
    PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Expose port
EXPOSE ${PORT}

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/server.js"]
