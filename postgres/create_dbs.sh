#!/usr/bin/env bash
set -e

echo 'Running postgres entrypoint and creating database'

timezone=$(cat /etc/timezone);

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
psql --username "$POSTGRES_USER" <<-EOSQL
    SET timezone to '$timezone';
    CREATE USER $APP_USER WITH ENCRYPTED PASSWORD '$APP_USER_PASSWORD';

    CREATE SCHEMA app AUTHORIZATION $APP_USER;

    ALTER DEFAULT PRIVILEGES 
      in SCHEMA public, app
      GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $APP_USER;

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA app;
    CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA app;
    CREATE EXTENSION IF NOT EXISTS "citext" SCHEMA app;

    ALTER USER $APP_USER SET search_path = $APP_USER, app, public;

EOSQL
