FROM postgres:16-bookworm

# Set up the working directory
WORKDIR /usr/src/app

COPY init-db.sh ./
RUN chmod +x ./init-db.sh

# Initialize databases with init-db.sh
CMD ["./init-db.sh"]
