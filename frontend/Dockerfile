# Stage 1: Build Angular app
FROM node:20 AS build
WORKDIR /app
COPY loopback/package*.json ./
RUN npm install
COPY loopback/ .
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]