#!/usr/bin/env bash
set -e
set -o pipefail

echo 'Running certbot'

sleep 6 && certbot certonly --standalone -d $LETSENCRYPT_URL --text --agree-tos --email $LETSENCRYPT_EMAIL --server https://acme-v01.api.letsencrypt.org/directory --rsa-key-size 4096 --verbose --renew-by-default --standalone-supported-challenges http-01

echo 'Certbot successful'
