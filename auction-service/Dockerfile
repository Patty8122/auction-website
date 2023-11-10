FROM node:20-bullseye-slim

# Set up the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Expose the port for the Node.js server
EXPOSE 3001

# Start the Node.js server
CMD ["npm", "start"]
