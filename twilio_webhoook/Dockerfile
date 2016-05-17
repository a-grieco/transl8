FROM ubuntu:14.04

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get update && apt-get install -y \
              supervisor \
              vim \
              nodejs

ADD package.json /opt/twilio/package.json
WORKDIR /opt/twilio
RUN npm install
ADD conf/supervisord.conf /etc/supervisor/conf.d/
ADD conf/crontab /etc/cron.d/logrotate
ADD conf/twilio /etc/logrotate.d/twilio
RUN chmod 0644 /etc/cron.d/logrotate
ADD . /opt/twilio/

ENTRYPOINT "/usr/bin/supervisord"

EXPOSE 3000

CMD ["/usr/bin/supervisord"]