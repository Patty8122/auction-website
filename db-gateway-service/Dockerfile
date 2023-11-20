FROM node:bookworm-slim

# Set up the working directory
WORKDIR /usr/src/app

# Copy node dependencies
COPY package*.json ./

COPY src ./src

COPY migrations ./migrations

# Copy ent
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Install Node.js dependencies
RUN npm install

# Get the port from the env (with default value 3001)
ENV PORT=3003

# Expose the port for the Node.js server
# EXPOSE $PORT

# Start the Node.js server
ENTRYPOINT ["./entrypoint.sh"]
