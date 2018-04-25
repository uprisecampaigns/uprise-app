#!/usr/bin/env bash
set -e

echo "entrypoint.sh script"

rm /etc/nginx/conf.d/*
envsubst '$$NGINX_HOST $$NGINX_HTTP_PORT $$NGINX_HTTPS_PORT $$NODE_APP_HOST $$NODE_APP_PORT $$LETSENCRYPT_HOST $$LETSENCRYPT_HTTP_PORT $$LETSENCRYPT_HTTPS_PORT' < /opt/docker/conf.d/uprise.conf > /etc/nginx/conf.d/uprise.conf

if [ "$PRODUCTION" = "true" ]
then
  echo Running production letsencrypt directions
  echo Starting nginx in the background
  nginx

  # This bit waits until the letsencrypt container has done its thing.
  # We see the changes here bceause there's a docker volume mapped.
  echo Waiting for folder /etc/letsencrypt/live/$NGINX_HOST to exist
  while [ ! -d /etc/letsencrypt/live/$NGINX_HOST ] ;
  do
    sleep 2
  done

  while [ ! -f /etc/letsencrypt/live/$NGINX_HOST/fullchain.pem ] ;
  do
    echo Waiting for file fullchain.pem to exist
    sleep 2
  done

  while [ ! -f /etc/letsencrypt/live/$NGINX_HOST/privkey.pem ] ;
  do
    echo Waiting for file privkey.pem to exist
    sleep 2
  done


  echo Letsencrypt ssl keys have been successfully obtained
  envsubst '$$NGINX_HOST $$NGINX_HTTP_PORT $$NGINX_HTTPS_PORT $$NODE_APP_HOST $$NODE_APP_PORT $$LETSENCRYPT_HOST $$LETSENCRYPT_HTTP_PORT $$LETSENCRYPT_HTTPS_PORT' < /opt/docker/conf.d/uprise-secure.conf > /etc/nginx/conf.d/uprise.conf

  echo Stopping background nginx
  # pkill nginx
  kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
fi

watch_keys() {
  echo "Watching keys"
  while true
  do
    inotifywait /etc/letsencrypt/live/$NGINX_HOST/ /etc/nginx/conf.d/
    echo "Reloading Nginx Configuration"
    nginx -s reload
  done
}

## TODO: use inotifywait to watch for new letsencrypt keys!
if [ "$PRODUCTION" = "true" ]
then
  echo "In production environment"
  nginx -g 'daemon off;' & watch_keys
else
  echo "Not in production environment"
  nginx -g 'daemon off;'
fi
