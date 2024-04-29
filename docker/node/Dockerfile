# Nuxt 3-based Storefront-Boilerplate (DemoShop) Dockerfile

# Build
FROM node:20.12.1-alpine3.19 AS build

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
FROM node:20.12.1-alpine3.19

WORKDIR /app

COPY --from=build /app/.output /app/.output

RUN apk add --no-cache jq bash
COPY ./docker/node/entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./.output/server/index.mjs"]
