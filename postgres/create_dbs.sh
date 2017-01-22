#!/usr/bin/env bash
set -e

echo 'Running postgres entrypoint and creating database'

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
psql --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER docker;
    CREATE DATABASE docker;
    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
    CREATE DATABASE prod;
    GRANT ALL PRIVILEGES ON DATABASE prod TO docker;
    CREATE DATABASE dev;
    GRANT ALL PRIVILEGES ON DATABASE dev TO docker;
    CREATE DATABASE test;
    GRANT ALL PRIVILEGES ON DATABASE test TO docker;
EOSQL
