#!/usr/bin/env bash
set -e

echo 'Importing zipcodes'

psql --username "$POSTGRES_USER" <<-EOSQL

    CREATE TABLE IF NOT EXISTS zipcodes (
      country char(2),
      postal_code varchar(20) PRIMARY KEY,
      place_name varchar(180),
      state_name varchar(100),
      state_code varchar(20),
      county_name varchar(100),
      county_code varchar(20),
      community_name varchar(100),
      community_code varchar(20),
      latitude float,
      longitude float,
      accuracy smallint
    );

    COPY zipcodes FROM '/docker-entrypoint-initdb.d/US.txt';

    ALTER TABLE zipcodes 
      ADD COLUMN location geography(Point, 4326);

    UPDATE zipcodes SET location = ST_GeographyFromText('SRID=4326;POINT(' || longitude || ' ' || latitude || ')');

    CREATE INDEX idx_zipcodes_location ON public.zipcodes USING gist(location);

EOSQL
