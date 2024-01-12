# @scayle/storefront-boilerplate-nuxt

## 1.0.0-rc.05

### 🔥 Highlights

#### ✨ Update to Nuxt 3.9 and Vue 3.4

Storefront Boilerplate now runs on both the latest Nuxt `v3.9` and Vue `v3.4` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.9 Announcement Blog](https://nuxt.com/blog/v3-9)
and the [Official Vue 3.4 Announcement Blog](https://blog.vuejs.org/posts/vue-3-4).

#### 🛫 Introducing Promotion Engine

The Promotion Engine presents the user with various promotions that have specific conditions for receiving the discount.
The Storefront Boilerplate currently support the two types `Automatic discount` and `Buy X get Y` by default as promotions.

- [SCAYLE Resource Center - Storefront Boilerplate / Promotion Engine](https://scayle.dev/en/dev/storefront-core/promotion-engine)

#### 👥 Identity Provider support for Token-based Authentication

The Storefront Boilerplate now provides support for Single-Sign-On (SSO) via multiple Identity Provider (IDP) like Okta, KeyCloak or Google.
The IDP login / SSO flow integrates with the existing Token-based Authentication and can be used in parallel to the existing SCAYLE IDP.

- [SCAYLE Resource Center - Storefront Core / Authentication](https://scayle.dev/en/dev/storefront-core/authentication)

#### 🔋 Introducing Page Caching with unified cache handling

The distributed default configuration of the Storefront Boilerplate comes with page caching enabled and relies on the
global `storefront-cache` storage mountpoint available via [Storefront Core - Caching](https://scayle.dev/en/dev/storefront-core/caching)
and configured via [Storefront Core - Storage via Module Configuration](https://scayle.dev/en/dev/storefront-core/module-configuration#storage).

- [SCAYLE Resource Center - Storefront Boilerplate / Page Caching](https://scayle.dev/en/dev/storefront-core/page-caching)

#### 🛫 Introducing support for Vercel Edge deployment

Storefront Boilerplate does now support deployment to Vercel Edge, besides Docker-based deployments.

- [SCAYLE Resource Center - Storefront Boilerplate / Vercel Edge](https://scayle.dev/en/dev/storefront-core/vercel-edge-deployment-sfb)

### 🚀 Major Changes

- Updated Cypress E2E test suite
- Introduced new utility `formatCurrency()` in `useFormatHelpers` and refactored usage of `getCurrency()` & `toCurrency()`
- Removed `nuxt-viewport` and refactored application to use `useDefaultBreakpoints` composable based on `VueUse/useBreakpoints` (_​For details see [VueUse Documentation](https://vueuse.org/core/useBreakpoints/)_)
- Reduced the usage of viewport detection logic and refactored UI to rely on responsive layouts instead
- Extract and refactor Product Filter handling on Category and Search page
- Refactored i18n integration and usage across application due to update of `@nuxt/i18n` to `v1.0.0` stable release

### 💅 Minor Changes

- Removed `stylelint`, related dependencies and package script commands
- Replaced `nuxt-vitest` with `@nuxt/test-utils@3.9.0` as the projects have been officially been merged together (_For detailed changes see [Changelog of @nuxt/test-utils](https://github.com/nuxt/test-utils/releases/tag/v3.9.0)_)
  - Introduced `vitest-environment-nuxt@1.0.0`
- Remove unsupported `imageBaseUrl` option key from `storefrontRuntimeConfigPublic` in `config/storefront.ts`
- Removed usage of `process.env` from `nuxt.config` and `config/storefront.ts`, relying on using runtime environment variables instead (_For details see [Nuxt Documentation - runtimeConfig / Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables))
- Allowing to use HTTP during local development mode
- Extend `.env.example` with updated environment variables for locale development purposes
- Added documentation reference links into `nuxt.config.ts`
- Added comments with environment variables names to override runtimeConfig keys into `nuxt.config.ts` and `config/storefront.ts`
- Removed unused `nuxt/utils/cms.ts`
- Introduce `useOrders` composable to unify orders handling
- Changed usage of `forgotPassword(data: SendResetPasswordEmailRequest)` to `forgotPassword(email: string)` in `useAuthentication` composable, refactored occurrences accordingly
- Introduce `@vercel/kv` and `@upstash/redis` for VercelKV support
- Extend `routeRules` in `nuxt.config.ts` to handle Vercel page caching
- Extend `routeRules` in `nuxt.config.ts` to support multiple cache configurations
- Extend `routeRules` in `nuxt.config.ts` to allow disabling SSR Page Caching via environment variables during build time with `DISABLE_SSR_CACHE`
- Extend `cache-test.mjs`
- Set `differentDomains` based on environment variable `DOMAIN_PER_LOCALE` during build time in `nuxt.config.ts`
- Enable `debug: true` in `nuxt.config.ts` to being able to pinpoint potential hydration mismatches or enumerating key iusses
- Various type tweaks and refinements

### 🩹 Patch Changes

- Fixed Storyblok integration with handling of invalid `product_ids` in `storyblok/components/ProductSlider`
- Fixed Storyblok integration on Category pages without defined Storyblok CMS category slug resulting in error pages in `pages/[...category].vue`
- Fixed issue with unavailable product colors on Product Detail Page in `pages/p/[slug].vue]`
- Removed `version: getStoryblokContentVersion(),` from `composables/useCms.ts`
- Fixed caching behaviour incorrect product list layout in `components/productList/ProductList.vue` & `pages/[...category].vue]`
- Fixed Order types in `components/order/OrderHeader.vue`, `components/order/OrderItems.vue`, `components/order/summary/PaymentSummary.vue`, `pages/account/orders/[id].vue`
- Fixed computed property `orderItems` in `pages/account/orders/[id].vue`
- Fixed ProductBadge position in `components/product/ProductBadge.vue` and `components/productList/ProductList.vue`
- Fixed user information disappearing after reload by disabling `autoFetch` and fetching user data explicitly `onMounted` in `components/layout/headers/user/UserPopover.vue`
- Fixed re-fetching for product list in `pages/[...category].vue]`
- Fixed mobile sidebar overlapping issue in `components/layout/navigation/MobileSidebar.vue`
- Fixed size picker overlapping issue in `components/wishlist/card/WishlistCard.vue`
- Fixed SlideIn overlapping issue in `components/layout/SlideIn.vue` and `composables/useSlideIn.ts`
- Fixed Wishlist and Basket page being incorrectly cached
- Fixed incorrect routing behaviour in the following files
  - `components/layout/headers/search/HeaderSearch.vue`
  - `components/ui/links/DefaultLink.vue`
  - `composables/useRouteHelpers.ts`
  - `middleware/authGuard.global.ts`
  - `utils/route.ts`
- Various other smaller fixes and improvements

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Removed `@nuxt/devtools` from devDependencies, as its now included with `nuxt@3.8` or higher
- Updated to `vue@3.4.10` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)
- Updated to `nuxt@3.9.1` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `@crowdin/cli@3.16.0`
- Updated to `@nuxt/image@1.2.0`
- Updated to `@nuxt/test-utils@3.9.0`
- Updated to `@nuxtjs/i18n@8.0.0`
- Updated to `@nuxtjs/tailwindcss@6.10.4`
- Updated to `@scayle/eslint-config-storefront@3.2.6`
- Updated to `@types/color@3.0.6`
- Updated to `@types/node@20.11.1`
- Updated to `cypress@13.6.2`
- Updated to `eslint@8.56.0`
- Updated to `eslint-plugin-tailwindcss@3.13.1`
- `happy-dom@13.0.4`
- `lint-staged@15.2.0`
- Updated to `nuxt-svgo@4.0.0.`
- `postcss@8.4.33`
- `postcss-custom-properties@13.3.4`
- `postcss-html@1.6.0`
- `postcss-import@16.0.0`
- `prettier-plugin-tailwindcss@0.5.11`
- `storyblok@3.26.0`
- `storyblok-generate-ts@2.0.1`
- Updated to `tailwindcss@3.4.1`
- Updated to `typescript@3.4.1`
- Updated to `vitest@1.1.3` and `@vitest/coverage-v8@1.2.0`
- Updated to `vue-tsc@1.8.27` (_NOTE: This dependency update is required for proper `vue@3.4` type checking!_)

#### 🏠 dependencies

- Added `nuxi@3.10.0` as it is now a standalone project within the Nuxt ecosystem
- Added `vue@3.4.10` as explicit dependency to avoid potential version mismatches
- Updated to `@scayle/storefront-nuxt@7.50.1` (_For detailed changes see [SCAYLE Resources Center - Releases](https://scayle.dev/en/releases/introduction)_)
- Updated to `@storyblok/nuxt@6.0.1`
- Updated to `@tailwindcss/forms@0.5.7`
- Updated to `@vueuse/core@10.7.1` and `@vueuse/nuxt@10.7.1`
- Updated to `global@4.4.0`
- Updated to `maska@2.1.11`
- Updated to `nanoid@5.0.4`
- Updated to `redis@4.6.12`
- Updated to `ufo@1.3.2`

## 1.0.0-rc.04

### Major Changes

- Use public npmjs.org package registry for `@scayle` packages and remove the need for a local `.npmrc` file
- Use public `storyblok-generate-ts` package instead of private fork

### Minor Changes

- Updated to latest `@scayle/storefront-nuxt` package using `v7.37.2`
- Improved Dockerfiles for build and deployments

### Patch Changes

- Updated various dependencies to latest versions

## 1.0.0-rc.03

### Major Changes

- Introduced `vitest` for unit testing and created dummy test files for most components
- Introduced page caching using [Route Rules](https://nuxt.com/docs/guide/concepts/rendering#route-rules)
- Replacing AuthGuard component with router middleware
- Use `defineOptions` for `vue` component naming

### Minor Changes

- Introduce `localizedNavigateTo` for the programmatic routing approach
- Upgrade to Vue 3.3.7
- Replaced `useUiState` with smaller composables which are: `useFlyouts`, `useMobileSearch`, `useModal` & `useSideNavigation`.
- Enable auto-import for the `constants` folder
- Various dependency minor dependency

### Patch Changes

- Fixed session max age
- Handle AddToWishlist errors
- Added missing Storyblok components
- Resolved Storyblok link
- Fixed broken links when path-based shops are enabled
- Various bugfixes

## 1.0.0-rc.02

### Minor Changes

- Upgrade to Nuxt 3.7.4

### Patch Changes

- Reduction of hydration errors
- Improved error handling for invalid products on PDP, as well as category and service pages
- Improved handling of displaying account related UI elements for guest user
- Improved order refresh behaviour on Order Success Page
- Various smaller bug fixes

## 1.0.0-rc.01

### Major Changes

- Introduce Nuxt 3
- Tracking of all relevant shop interactions with GTM
- Implemented Search Engine optimizations
- Provide more CMS content integrations (Storyblok) into all relevant pages

### Minor Changes

- Improved error handling and displaying of error pages
- Improvements to redirect handling
- Improved SVG icon handling
- Improvements to mobile styling and behaviour

### Patch Changes

- Various bugfixes
