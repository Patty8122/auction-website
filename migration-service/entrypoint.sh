#!/bin/bash
set -e
DATABASE_NAME="itemdb"

# Function to run migrations for a specific database
run_migrations() {
    local db=$1
    local migration_dir=$2

    export DATABASE_URL="postgresql://postgres:postgres@pg_container/$db"
    ./node_modules/.bin/node-pg-migrate up -m ./migrations/$migration_dir
}

if [ -z "$(psql -Atqc "\\list $DATABASE_NAME")" ]; then
    echo "Database $DATABASE_NAME does not exist. Creating..."
    # create the database
    npm run create-db
fi


# wait for the database to be ready
./wait-for-it/wait-for-it.sh pg_container:5432

# Run migrations for each database
run_migrations "itemdb" "items"

exec npm start
