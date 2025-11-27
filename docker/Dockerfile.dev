# Dockerfile for local development
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Set environment
ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000

# Use nodemon in dev to reload on changes
CMD ["npm", "run", "dev"]
