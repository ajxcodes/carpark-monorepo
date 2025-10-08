# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package manifests
COPY package.json pnpm-lock.yaml ./

# Install pnpm and then install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Angular application for production
RUN pnpm build

# Stage 2: Create the production image to run the server
FROM node:20-alpine

WORKDIR /app

# Copy only the built output from the build stage
COPY --from=build /app/dist/angular/ ./dist/angular/

# Expose the port the Angular SSR server will run on (default is 4200)
EXPOSE 4200

# The command to start the Node.js server for the Angular app
CMD [ "node", "dist/angular/server/server.mjs" ]

