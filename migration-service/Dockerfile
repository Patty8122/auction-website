# FROM node:carbon

# # Create app directory
# RUN mkdir -p /usr/src/app
# RUN chmod -R 777 /usr/src/app

# WORKDIR /usr/src/app

# # Copy code
# COPY package.json /usr/src/app/
# COPY . /usr/src/app

# # Copy migration files
# COPY ./migrations /usr/src/app/migrations

# # This is our secret sauce
# RUN git clone https://github.com/vishnubob/wait-for-it.git

# # Run config
# EXPOSE		8080
# CMD ["nodemon", "server"]


# stage 1 building the code
FROM node:14
# WORKDIR /app
COPY package*.json ./
COPY entrypoint.sh ./entrypoint.sh
COPY ./.pgpass /root/.pgpass
# give access to the file
RUN chmod 600 /root/.pgpass




RUN apt-get update \
    && apt-get install -y postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN npm install
RUN npm install db-migrate-pg
COPY . .

# This is our secret sauce
RUN git clone https://github.com/vishnubob/wait-for-it.git



# # Run config
EXPOSE		8080
CMD ["node", "server"]