ARG CORE_IMAGE_TAG=1.21-alpine-ccr-stable
FROM 736335200020.dkr.ecr.eu-west-1.amazonaws.com/ca/core-storefront-nginx:$CORE_IMAGE_TAG

RUN apk add --no-cache bash

COPY ./docker/nginx/templates /etc/nginx/templates
COPY *.key /etc/nginx/
COPY *.crt /etc/nginx/
