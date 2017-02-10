FROM nginx

RUN mkdir -p /opt/docker/conf.d
COPY entrypoint.sh /opt/docker
COPY conf.d/uprise.conf /opt/docker/conf.d/
COPY conf.d/uprise-secure.conf /opt/docker/conf.d/

COPY dhparams.pem /etc/ssl/private/

CMD /opt/docker/entrypoint.sh
