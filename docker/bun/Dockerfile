# Nuxt 3-based Storefront-Boilerplate (DemoShop) Dockerfile for Bun

# Build
FROM node:20.7.0-alpine3.18 as build

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