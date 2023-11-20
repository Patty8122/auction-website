# init-db.sh creates the auctiondb, itemdb, and userdb databases.
#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE DATABASE auctiondb;
    CREATE DATABASE itemdb;
    CREATE DATABASE userdb;
EOSQL
