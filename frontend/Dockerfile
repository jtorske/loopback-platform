FROM node:20-slim

WORKDIR /app
COPY loopback/package*.json ./
RUN npm install
COPY loopback/ .

EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]