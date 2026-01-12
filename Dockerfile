FROM node:24-alpine

WORKDIR /app

# Install dependencies for both backend and client
COPY package*.json ./
RUN npm install

COPY backendv2/package*.json ./backendv2/
COPY client/package*.json ./client/
RUN npm install --prefix backendv2
RUN npm install --prefix client --include=dev

# Copy all code
COPY . .

# Build client
RUN npm run build --prefix client

WORKDIR /app/backendv2

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
