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

    SELECT AddGeometryColumn( 'public', 'zipcodes', 'thepoint_lonlat', 4269, 'POINT', 2 ); 

    UPDATE zipcodes SET thepoint_lonlat = ST_SetSRID(ST_Point(longitude, latitude),4269);

EOSQL
