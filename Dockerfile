# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Copy migration script
COPY migrate-userId-nullable.mjs ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run migration then start server
CMD ["npm", "start"]
