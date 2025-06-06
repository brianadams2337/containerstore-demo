---
'@scayle/storefront-application-nuxt': minor
---

**\[Build\]** To optimize the final Docker image size and build speed, the `.dockerignore` file has been extended.
This prevents development files, such as the Playwright test suite, documentation, and local environment configurations, from being unnecessarily copied into the build context.

- `/playwright`
- `README.md`
- `CHANGELOG.md`
- `CHANGELOG-RC.md`
- `docker-compose.yml`
- `vitest.config.ts`
- `.prettierrc`
- `.prettierrc.cjs`
- `.prettierignore`
- `.eslintrc.js`
- `.eslintignore`
- `.gitignore`
- `.dockerignore`
- `.nvmrc`
