ARG NODE_VERSION=20.17.0
ARG DEPLOY_ENV=prod
ARG BUILD_ENV=docker

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 5000 && \
    npm config set fetch-retry-maxtimeout 60000

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install --force --loglevel verbose && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf /tmp/* && \
    rm -rf ~/.cache

COPY src ./src
COPY prisma ./prisma
RUN npm run prisma-gen:all && \
    npm run build && \
    rm -rf src

# Production stage
FROM node:${NODE_VERSION}-alpine AS runner

ARG DEPLOY_ENV

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# 只安装生产依赖，并清理缓存
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --omit=dev --force --production && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf /tmp/* && \
    rm -rf ~/.cache && \
    npm prune --production
    
USER node
    
EXPOSE 11451

ENV DEPLOY_ENV=${DEPLOY_ENV}
# Start the application
CMD ["sh", "-c", "npm run start:$DEPLOY_ENV"]