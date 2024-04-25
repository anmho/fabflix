FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm

RUN pnpm i
RUN pnpm run build


CMD ["npm", "start"]
