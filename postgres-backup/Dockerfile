FROM postgres

RUN apt-get update && apt-get install -y python-pip

RUN pip install awscli

RUN mkdir -p /opt/docker
COPY backup.sh /opt/docker/
RUN chmod 755 /opt/docker/backup.sh

COPY crontab /etc/

CMD env >> /etc/environment && /opt/docker/backup.sh && cron -f -L 15
