# 构建阶段
FROM node:20 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 生产阶段
FROM node:20

WORKDIR /app
COPY package.json yarn.lock ./
COPY .env.docker ./.env

RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist

# 启动应用
CMD ["node", "dist/main"]