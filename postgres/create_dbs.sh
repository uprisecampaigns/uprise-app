#!/usr/bin/env bash
set -e

echo 'Running postgres entrypoint and creating database'

# TODO: Refactor uprise username into environment variable?
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
psql --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER uprise;
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO uprise;

    CREATE SCHEMA app AUTHORIZATION uprise;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA app;
    CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA app;

    ALTER USER uprise SET search_path = uprise, app, public;
EOSQL
