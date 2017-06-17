#!/usr/bin/env bash
set -e
set -o pipefail

echo 'Backing up postgres database'

pg_dump --dbname=postgresql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME $POSTGRES_EXTRA_OPTS | gzip > /tmp/dump.sql.gz

aws s3 cp /tmp/dump.sql.gz s3://$AWS_S3_BUCKET_NAME/$AWS_S3_PREFIX/${DATABASE_NAME}_$(date +"%Y-%m-%dT%H:%M:%SZ").sql.gz || exit 2

pg_dump -Fc --dbname=postgresql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME $POSTGRES_EXTRA_OPTS | gzip > /tmp/dump.gz

aws s3 cp /tmp/dump.gz s3://$AWS_S3_BUCKET_NAME/$AWS_S3_PREFIX/${DATABASE_NAME}_$(date +"%Y-%m-%dT%H:%M:%SZ").gz || exit 2

echo 'Postgres backup successful'
