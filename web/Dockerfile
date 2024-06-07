# FROM node:18-alpine

# WORKDIR /app
# COPY . .

# RUN npm install -g pnpm

# RUN pnpm i
# RUN pnpm run build


# CMD ["npm", "start"]


# Use a Node.js base image
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Build the application
RUN npm run build

# Expose the necessary port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

