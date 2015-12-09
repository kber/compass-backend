FROM dr:5000/bolt-cnpm:2.0.14

ADD ./ /app
WORKDIR /app

RUN cnpm install --production -d

EXPOSE 9000

RUN chmod a+x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
