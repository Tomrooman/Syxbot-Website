FROM nginx:1.19.1-alpine

LABEL author="Tom Rooman"

RUN rm /etc/nginx/conf.d/default.conf

COPY cert/default /etc/nginx/conf.d/

COPY cert/privkey.pem /etc/letsencrypt/live/syxbot.com/

COPY cert/fullchain.pem /etc/letsencrypt/live/syxbot.com/

RUN mv /etc/nginx/conf.d/default /etc/nginx/conf.d/default.conf

COPY dist/ /home/tom/Syxbot-Website/dist/