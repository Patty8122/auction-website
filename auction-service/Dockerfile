FROM node:bookworm-slim

# Set up the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Get the port from the env (with default value 3001)
ENV PORT=3001

# Expose the port for the Node.js server
EXPOSE $PORT

# Start the Node.js server
CMD ["npm", "start"]
