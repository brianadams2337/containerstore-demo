# SCAYLE Storefront Application Dockerfile for Node runtime

# Build
FROM node:22.16.0-alpine3.20@sha256:2289fb1fba0f4633b08ec47b94a89c7e20b829fc5679f9b7b298eaa2f1ed8b7e AS build

ARG VERSION
ARG CMS_PROVIDER=scayle
ARG GIT_REPOSITORY_URL
ARG GIT_COMMIT_SHA

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml patches/ ./

ENV VERSION=${VERSION} \
    CMS_PROVIDER=${CMS_PROVIDER} \
    OTEL_ENABLED=true \
    OTEL_RESOURCE_ATTRIBUTES=git.commit.sha=${GIT_COMMIT_SHA},git.repository_url=${GIT_REPOSITORY_URL}

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nuxt build

# Run
FROM node:22.16.0-alpine3.20@sha256:2289fb1fba0f4633b08ec47b94a89c7e20b829fc5679f9b7b298eaa2f1ed8b7e

WORKDIR /app

COPY --from=build /app/.output /app/.output

# Deleting potentially cached temporary data from apk
RUN apk add --no-cache jq bash && rm -rf /var/cache/apk/*
COPY ./docker/node/entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./.output/server/index.mjs"]
