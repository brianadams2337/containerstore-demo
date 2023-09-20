# Nuxt 3-based Storefront-Boilerplate (DemoShop) Dockerfile
FROM node:18.17.1-alpine3.18

COPY ./.output/ /app/

WORKDIR /app

CMD ["node", "./server/index.mjs"]