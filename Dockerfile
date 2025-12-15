# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .

# 빌드 타임 환경변수 (Jenkins에서 --build-arg로 전달)
ARG SERVICE_URL
ARG NEXT_PUBLIC_SERVICE_URL
ENV SERVICE_URL=$SERVICE_URL
ENV NEXT_PUBLIC_SERVICE_URL=$NEXT_PUBLIC_SERVICE_URL

RUN pnpm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=Asia/Seoul
RUN apk add --no-cache tzdata && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["pnpm", "start"]