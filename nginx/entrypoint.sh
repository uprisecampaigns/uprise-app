#!/usr/bin/env bash
rm /etc/nginx/conf.d/*
envsubst '$$NGINX_HOST $$NGINX_PORT' < /opt/docker/conf.d/node-app.conf > /etc/nginx/conf.d/node-app.conf && nginx -g 'daemon off;'
