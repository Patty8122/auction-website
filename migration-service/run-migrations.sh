#!/bin/bash

# wait for the database to be ready
./wait-for-it/wait-for-it.sh db-service:5432

echo "Now ready to connect to db-service!"


# check if the database exists
# if [ -z "$(psql -Atqc "\\list $DATABASE_NAME")" ]; then
#     echo "Database $DATABASE_NAME does not exist. Creating..."
#     # create the database
#     npm run create-db
# fi

set -e
DB_NAME="itemdb"

# ./node_modules/.bin/node-pg-migrate down -m ./migrations
# Function to run migrations for a specific database
run_migrations() {
    local db=$1

    export DATABASE_URL="postgresql://postgres:postgres@pg_container/$db"
    ./node_modules/.bin/node-pg-migrate up -m ./migrations
    
}


# Check if the database exists
# if psql -lqt | cut -d \| -f 1 | grep -wq "$DB_NAME"; then
#     echo "Database $DB_NAME already exists. Skipping creation."
# else
#     # Create the database
#     echo "Creating database $DB_NAME ..."
#     npm run create-db
# fi


# Run migrations for each database
run_migrations "itemdb"

exec npm start
