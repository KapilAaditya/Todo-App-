# ==========================================
# STAGE 1: Build Frontend Static Assets
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Set up Backend & Final Container
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets from STAGE 1 into backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Set working directory to backend
WORKDIR /app/backend

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "app.js"]