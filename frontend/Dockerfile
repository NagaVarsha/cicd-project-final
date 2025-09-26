# Stage 1: Build the React application
# This uses an official Node.js image to build the static files.
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching.
# If these files don't change, Docker won't need to re-run 'npm install'.
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Run the build script defined in package.json to create the production build.
# This will create a 'dist' folder with the optimized static files.
RUN npm run build

# ---

# Stage 2: Serve the application using Nginx
# Nginx is a very fast and lightweight web server, perfect for serving static files.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page.
RUN rm -rf ./*

# Copy the built assets from the 'build' stage's 'dist' folder into the Nginx server directory.
COPY --from=build /app/dist .

# Copy our custom Nginx configuration to tell it how to handle API requests.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port.
EXPOSE 80

# The command to start the Nginx server in the foreground.
ENTRYPOINT ["nginx", "-g", "daemon off;"]

