FROM mdillon/postgis:9.6

WORKDIR /docker-entrypoint-initdb.d

ADD create_dbs.sh /docker-entrypoint-initdb.d/

# Remember that zipcodes.sh only runs after postgis.sh (from mdillon/postgis)
# because of alphabetical order!
ADD zipcodes.sh /docker-entrypoint-initdb.d/

ADD data/US.txt /docker-entrypoint-initdb.d/

RUN chmod 0755 /docker-entrypoint-initdb.d/create_dbs.sh
RUN chmod 0755 /docker-entrypoint-initdb.d/zipcodes.sh

