---
'@scayle/storefront-application-nuxt': minor
---

**\[Build\]** OpenTelemetry data can now be automatically enriched with Git repository information for improved observability.
To include the commit SHA and repository URL in your telemetry, pass the corresponding build arguments when creating the Docker image:

```sh
docker build ./docker/node \
--build-arg GIT_REPOSITORY_URL=$(git config --get remote.origin.url) \
--build-arg GIT_COMMIT_SHA=$(git rev-parse HEAD)
```
