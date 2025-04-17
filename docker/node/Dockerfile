# SCAYLE Storefront Application Dockerfile for Node runtime

# Build
FROM node:22.11.0-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e AS build

ARG VERSION
ARG CMS_PROVIDER

ENV VERSION=${VERSION}

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY patches /app/patches

RUN yarn install --frozen-lockfile

COPY . /app

ENV CMS_PROVIDER=$CMS_PROVIDER
ENV OTEL_ENABLED=true

RUN yarn nuxt build

# Run
FROM node:22.11.0-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e

WORKDIR /app

COPY --from=build /app/.output /app/.output

RUN apk add --no-cache jq bash
COPY ./docker/node/entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./.output/server/index.mjs"]
