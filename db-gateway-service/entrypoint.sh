#!/bin/bash
set -e

# Function to run migrations for a specific database
run_migrations() {
    local db=$1
    local migration_dir=$2

    export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/$db"
    ./node_modules/.bin/node-pg-migrate up -m /migrations/$migration_dir
}

# Run migrations for each database
run_migrations "auctiondb" "auction"
#run_migrations "userdb" "user"
#run_migrations "itemdb" "item"

exec npm start
