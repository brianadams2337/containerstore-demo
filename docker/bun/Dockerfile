# SCAYLE Storefront-Application Dockerfile for Bun runtime

# Build
FROM node:22.11.0-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e AS build

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile

COPY . /app

RUN NITRO_PRESET=bun yarn nuxt build

# Run
FROM oven/bun:1.0

WORKDIR /app

COPY --from=build /app/.output /app/.output

CMD ["bun", "run", "./.output/server/index.mjs"]
