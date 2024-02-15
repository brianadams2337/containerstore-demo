# @scayle/storefront-boilerplate-nuxt

## 1.0.0-rc.07

This release focuses on stabilization and modularization, to improve the technical foundation and developer experience.

### 🔥 Highlights

#### ✨ Update to Nuxt 3.10.2 and Vue 3.4.19

Storefront Boilerplate now runs on both the latest Nuxt `v3.10.2` and Vue `v3.4.19` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.10 Announcement Blog](https://nuxt.com/blog/v3-10)
and the [Official Vue 3.4.19 Changelogs](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3419-2024-02-13).

#### 🧪 Modularization: Extracting Cypress into dedicated sub-package

The Cypress testing solution has been extracted into a dedicated child package located at `cypress/`. This decouples the dependencies from the main Storefront application. To install all relevant Cypress dependencies, execute `yarn install` within the `cypress/` directory.
By default the current Cypress integration does not rely anymore on the commercial Cypress Dashboard integration.
Please check the dedicated Readme file located at `cypress/README.md` for more details.

The following dependencies have moved from `package.json` to `cypress/package.json`:

- `cypress`
- `cypress-real-events`
- `eslint-plugin-cypress`

#### 🧱 Modularization: Extracting Storyblok Integration into local module

The Storyblok integration has been extracted into a dedicated local Nuxt module `storefront-cms`.
This allows to combine all CMS provider relevant functionalities within a central Nuxt module and allows for simple future inclusion of additional CMS providers.

The new local Nuxt module can be found under `modules/cms/` and its path has been added to `nuxt.config.ts` to the `modules` list.

### 🧲 Tracking Refactoring and Improvements

The included tracking implementation has been refactored and received various improvements to increase the tracking data quality, as well as tracking data reliability.

### 🚀 Major Changes

- **BREAKING:** The Image CDN config key has now moved to runtimeConfig under `public.cdnUrl`
  - The environment variable `NUXT_PUBLIC_IMAGE_BASE_URL` has been replaced by `NUXT_PUBLIC_CDN_URL`
- **BREAKING:** Added patch files for automatic dependency patching with [`patch-package`](https://www.npmjs.com/package/patch-package).
  The tool will run in `postinstall` and apply any patches present in the `patches/` directory to the respective dependency. Extended `README.md` with a section regarding `Patches` to explain the details and currently applied patches
  - Patched support for runtimeConfig with `@nuxt/image`
  - Patched missing (`undefined`) driver name in `unstorage` if using `VercelKV` as caching driver
  - Patches `nitro` (`nitropack`) to resolve session issues with page caching enabled
- Added full support for an easy way of running the application through docker compose

### 💅 Minor Changes

- Refactored Wishlist
  - Added `WishlistCardSlideIn`, `WishlistCardImage` and `WishlistCardDescription` components
  - Added `useWishlistPage`, `useWishlistItem` and `useWishlistItemActions` composables
- Fixed an issue with Guest User being able to access the Account page, even though it did not have any content
- Fixed an issue with the Order pages not properly displaying content due to page caching issues while using path-based routing
- Fixed various UX/UI issues for the new Promotion Engine feature
- Fixed hydration issues related to viewport-dependent font-size classes on PDP in `pages/p/[slug].vue`
- Fixed hydration issues related to viewport-dependent font-size classes on PLP in `components/product/card/ProductCard.vue`
- Refactored various components to use new Vue v3 `defineEmits` syntax for events
  - `components/layout/headers/search/MobileSearchInput.vue`
  - `components/search/CategorySuggestions.vue`
  - `components/search/ProductSuggestions.vue`
  - `components/search/SearchResultItem.vue`
  - `components/search/SearchResults.vue`
  - `components/search/SearchResultsContainer.vue`
- Fixed `DefaultLink` behaviour with path-based routing in `components/ui/links/DefaultLink.vue`
- Fixed client-side validation behaviour for login and registration forms
  - `components/auth/GuestLoginForm.vue`
  - `components/auth/LoginForm.vue`
  - `components/auth/RegisterForm.vue`
  - `components/auth/SalutationSelect.vue`
- Fixed "Register" link to open the "Registration" tab within the `SignInForm` in `components/auth/SignInForm.vue`

### 🩹 Patch Changes

- Added `hasOneSizeProductVariantOnly` helper within `sizes` util
- Fixed UX / UI issues for Order details page in `pages/account/orders.vue`
- Fixed UX / UI issues with login and registration forms
- Fixed window scrolling on PLP pagination in `components/ui/pagination/PaginationButton.vue`

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Updated to `@crowdin/cli@3.18.0`
- Updated to `@nuxt/test-utils@3.11.0`
- Updated to `@nuxtjs/i18n@8.1.0`
- Updated to `@nuxtjs/tailwindcss@6.11.4`
- Updated to `@types/node@20.11.17`
- Updated to `@upstash/redis@1.28.3`
- Updated to `@vitest/coverage-v8@1.2.2`
- Updated to `eslint-plugin-tailwindcss@3.14.2`
- Updated to `happy-dom@13.3.8`
- Updated to `lint-staged@15.2.2`
- Updated to `nuxt@3.10.1`
- Updated to `postcss@8.4.35`
- Updated to `vitest@1.2.2`

#### 🏠 dependencies

- Updated to `@scayle/storefront-nuxt@7.57.0`
- Updated to `citty@0.1.5`
- Updated to `dotenv@16.4.3`
- Updated to `nanoid@5.0.5`
- Updated to `redis@4.6.13`
- Updated to `storyblok-js-client@6.6.7`
- Updated to `ufo@1.4.0`
- Updated to `vue@3.4.19`

## 1.0.0-rc.06

This release focuses on stabilization and refactoring, to improve the technical foundation and developer experience.

### 🚀 Major Changes

- **BREAKING:** Nested public Storefront-specific `runtimeConfig` properties under the `storefront` key
  - Replaced `useRuntimeConfig().public.log` and `useRuntimeConfig().public.auth`
    with `useRuntimeConfig().public.storefront.log` and `useRuntimeConfig().public.storefront.log`
  - Changed `(...storefrontRuntimeConfigPublic as any),` to `storefront: storefrontRuntimeConfigPublic as any,` in `nuxt.config.ts`
- **BREAKING**: Allow the session of an `RpcContext` to be `undefined`
  - This changes the structure of the `RpcContext`, so it may be a breaking change if you have written custom RPC methods.
    The affected properties on the `RpcContext` are `sessionId`, `wishlistKey` and `basketKey` and
    the affected methods are `destroySession`, `createUserBoundSession`, `updateUser`, and `updateTokens`.
    If you use these methods or properties in a custom RPC method, make sure that you handle the case where they might be undefined.
    TypeScript will also catch these cases if you have `strictNullChecks` enabled.
    You can check `context.sessionId` (or another session-dependent property) to determine if the session is present.
    If one of these properties is present, all will be. Alternatively, you can call `assertSession(context)`
    before referencing any properties on the context. If the session is not present,
    an error will be thrown. For any usage of `context` after `assertSession` is called,
    TypeScript will understand that the session properties are present.

### 💅 Minor Changes

- Extracted sorting and grouping basket helpers to `utils`
- Properly resolve `basketGroup` RPC with params
- Removed wishlist utils and moved them to the `useWishlistActions` composable
- Replaced `validation` plugin with `useValidationRules` composable
- Replaced `toast` plugin with `useNotification` composable
- Replaces `tracking` plugin with `useTracking` composable
- Renamed `divideWithHundred` price utility to `divideByHundred`
- Renamed `localeFormattedDate` date utility to `formatLocaleDate`
- Enforced using tracking sub-composables through the `useTrackingEvents` by turning off auto-import for sub-composables
- Simplified `Countdown` component logic by using `useIntervalFn` from `vueuse`
- Changed `radash` utils prefix to be underscore (`_`) instead of `use`, to avoid confusion between `radash`
  utilities and Vue composables. Resulting in e.g. `useSleep` to become `_sleep`.
- Used radash `_sort` (`useSort`) instead of native `sort` to avoid side effects
- Export composables as named functions
- Refactored components to use `withDefaults` and type generics to define component properties
- Refactored product and navigation components to reduce complexity
- Refactored account area component to reduce complexity and improve UI experience
  - `components/account/AccountHeader.vue`
  - `components/account/AccountWrapper.vue`
  - `components/addOns/AddOnsSelector.vue`
  - `components/order/OrderHeader.vue`
  - `components/order/OrderItemCard.vue`
  - `components/order/OrderOverviewHeader.vue`
  - `components/order/OrderStatusBar.vue`
  - `pages/account/orders.vue`
  - `pages/account/user.vue`
  - `pages/account/orders/[id].vue`
- Refactored account area orders components to reduce complexity and improve UI experience
  - `components/account/AccountWrapper.vue`
  - `components/order/OrderHistoryItem.vue`
  - `components/order/OrderItems.vue`
  - `composables/useOrders.ts`
- Refactored used Tailwind classes across the Storefront Boilerplate to comply with used Tailwind version
- Tweaked Promotion Engine implementation and UI experience across the Storefront Boilerplate
- Tweaked Order Success Page (OSP) complexity and UI experience
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_DEFAULT` to `DOMAIN_DEFAULT`
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_PER_LOCALE` to `DOMAIN_PER_LOCALE`
- Renamed buildtime environment variable `DISABLE_SSR_CACHE` to `DISABLE_PAGE_CACHE`

### 🩹 Patch Changes

- Refactored `slicedOrders` to be a `computed` property in `components/account/AccountWrapper.vue`
- Refactored `_sizes` to be a `computed` property in `components/product/ProductSizePicker.vue`
- Refactored `components/addOns/AddOnsSelector.vue` to use `computed` properties instead of `ref` and dedicated update functions
- Refactored `basketItems` to have an empty array as fallback in `components/basket/popover/BasketPopoverItems.vue`
- Added missing state key for `footerNavigationTrees` in `components/layout/footer/AppFooter.vue`
- Simplified watcher for `searchQuery` in `components/layout/headers/search/HederSearch.vue`
- Refactored Nuxt-specific imports to import from `#app` instead of `nuxt/app`
- Added `collapsed` component property to `components/product/detail/ProductDetailAccordionEntry.vue`
- Use object for lookup of headline sizes instead of `computed` property in `components/ui/headlines/Headline.vue`
- Fixed desktop sidebar overlapping navigation in `pages/[...category].vue`
- Added `time` constants in `constants/time.ts` and used it in `components/ui/Countdown.vue`
- Refactored `PromotionBanner` to be displayed on `onNuxtReady` instead of `onServerPrefetch`
  to avoid missing interactivity during page load and hydration
- Removed `runtimeConfig.public.storyblok.webhookSecret` from `nuxt.config.ts`, as it is not supported by the `storyblok-nuxt` module
- Use `yn` to typecast potential build value of `runtimeConfig.public.gtm.debug` via `yn(process.env.NUXT_PUBLIC_GTM_DEBUG)` in `nuxt.config.ts`

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Updated to `@crowdin/cli@3.16.1`
- Updated to `@nuxt/image@1.3.0`
- Updated to `@nuxt/test-utils@3.10.0`
- Updated to `@nuxtjs/tailwindcss@6.11.0`
- Updated to `@types/node@20.11.5`
- Updated to `@upstash/redis@1.28.2`
- Updated to `@vitest/coverage-v8@1.2.1`
- Updated to `autoprefixer@10.4.17`
- Updated to `cypress@13.6.3`
- Updated to `eslint-plugin-tailwindcss@3.14.0`
- Updated to `happy-dom@13.2.2`
- Updated to `nuxt@3.9.3` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `utility-types@3.11.0`
- Updated to `vitest@1.2.1`

#### 🏠 dependencies

- Updated to `@scayle/storefront-nuxt@7.53.1`
- Updated to `@storyblok/nuxt@6.0.4`
- Updated to `dotenv@16.3.2`
- Updated to `storyblok-js-client@6.6.3`
- Updated to `vue@3.4.15` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)

## 1.0.0-rc.05

### 🔥 Highlights

#### ✨ Update to Nuxt 3.9 and Vue 3.4

Storefront Boilerplate now runs on both the latest Nuxt `v3.9` and Vue `v3.4` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.9 Announcement Blog](https://nuxt.com/blog/v3-9)
and the [Official Vue 3.4 Announcement Blog](https://blog.vuejs.org/posts/vue-3-4).

#### 🛫 Introducing Promotion Engine

The Promotion Engine presents the user with various promotions that have specific conditions for receiving the discount.
The Storefront Boilerplate currently support the two types `Automatic discount` and `Buy X get Y` by default as promotions.

- [SCAYLE Resource Center - Storefront Boilerplate / Promotion Engine](https://scayle.dev/en/dev/storefront-core/promotions)

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
- Removed usage of `process.env` from `nuxt.config` and `config/storefront.ts`, relying on using runtime environment variables instead (_For details see [Nuxt Documentation - runtimeConfig / Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables)_)
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
