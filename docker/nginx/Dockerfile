FROM nginx:1.21-alpine

RUN apk add --no-cache bash

COPY ./docker/nginx/templates /etc/nginx/templates
COPY *.key /etc/nginx/
COPY *.crt /etc/nginx/

# prepare directories
RUN mkdir /app/
RUN mkdir -p /var/cache/nginx