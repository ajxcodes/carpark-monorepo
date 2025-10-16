# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests
COPY pnpm-lock.yaml package.json ./

# Install pnpm and then install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the React app for production. The output will be in /app/dist
RUN pnpm run build

# Stage 2: Serve the app with a lightweight web server
FROM node:20-alpine

WORKDIR /app

# Install a simple static server called 'serve'
RUN npm install -g serve

# Copy the built output from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the server will run on
EXPOSE 3000

# The command to start the server.
# It serves the static files from the 'dist' folder on port 3000
CMD [ "serve", "-s", "dist", "-l", "3000" ]