# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install dependencies with --legacy-peer-deps to avoid TypeScript conflicts
RUN npm install --legacy-peer-deps
# Copy the rest of the frontend source code
COPY . .
# Build the React app
RUN npm run build

# Stage 2: Serve the frontend using Nginx
FROM nginx:alpine
# Copy the built frontend from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 for Nginx
EXPOSE 80
# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
