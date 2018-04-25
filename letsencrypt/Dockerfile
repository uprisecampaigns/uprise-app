FROM quay.io/letsencrypt/letsencrypt:latest

RUN mkdir -p /opt/docker
COPY run.sh /opt/docker/
RUN chmod 755 /opt/docker/run.sh

COPY crontab /etc/

CMD env >> /etc/environment && /opt/docker/run.sh && cron -f -L 15
