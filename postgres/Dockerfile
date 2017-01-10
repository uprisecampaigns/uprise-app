FROM postgres

WORKDIR /docker-entrypoint-initdb.d

ADD create_dbs.sh /docker-entrypoint-initdb.d/
RUN chmod 0755 /docker-entrypoint-initdb.d/create_dbs.sh

