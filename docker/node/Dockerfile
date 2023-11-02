# Nuxt 3-based Storefront-Boilerplate (DemoShop) Dockerfile

# Build
FROM node:20.7.0-alpine3.18 as build

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile

COPY . /app

RUN yarn nuxt build

# Run
FROM node:20.7.0-alpine3.18

WORKDIR /app

COPY --from=build /app/.output /app/.output

CMD ["node", "--env-file=.env", "./.output/server/index.mjs"]