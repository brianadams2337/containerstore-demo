---
'@scayle/storefront-boilerplate-nuxt': patch
---

Fix caching for domain-based setups where we now consider the host for the SSR cache key.

Additionally, we now set an `integrity` value that invalidates the SSR cache automatically when a new build is deployed.  
You can control the value through the `VERSION` environment variable, which should be set to your current Git short commit sha.

Either you can set this normally during your build process

```sh
VERSION=147f33d yarn build
```

or when using the docker image

```
docker build --build-arg VERSION=${GIT_SHORT_COMMIT_SHA} -f docker/node/Dockerfile .
```
