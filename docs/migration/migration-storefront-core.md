# SCAYLE Storefront Core - Nuxt 3 Migration

This document outlines all changes from the former Nuxt 2-based `@scayle/storefront-nuxt2` package to the new Nuxt 3-based `@scayle/storefront-nuxt`.
Please keep in mind that this documentation is still being extended and will be regularly updated.

_Last updated: 19. September 2023_

[[TOC]]

## Overview

`storefront-nuxt` is a new package for building storefront applications using Nuxt 3. It is based on `storefront-nuxt2`, but because there are many differences between Nuxt 2 and Nuxt 3, there are consequently many differences between `storefront-nuxt` and `storefront-nuxt2`.

This document provides an overview of how `storefront-nuxt` differs from `storefront-nuxt2`. For a full guide on how to migrate your storefront application to Nuxt 3, see [demo shop migration guide](https://gitlab.com/aboutyou/cloud-agency/shop-application/ay-cloud-shop-application-demo-v2/-/blob//nuxt-3/templates/nuxt/docs/migration.md?ref_type=heads).

## Configuration changes

### session

The session config is mostly the same. `secret` is now typed as `string | string[]` instead of `string` to enable changing the secret key used for signed session cookies without breaking existing sessions.

There is also a new `provider` option to control session store used. It can be set to `'redis'` (default) or `'memory'`.

See [Sessions](#sessions) for more details.

### cache

SSR-specific options are moved under `cache.ssr`. For example, instead of using `cache.pathsDisabled` to disable certain paths for SSR, use `cache.ssr.pathsDisabled` to disable certain paths for SSR, use `cache.ssr.pathsDisabled`.

### redis

The redis configuration can now be defined at the top-level. The top-level configuration will apply for all shops that don't specify their own redis configuration.

### bapi (Storefront API)

The `bapi` (Storefront API) configuration option can be defined at the top-level now. The top-level configuration will apply for all shops that don't specify their own `bapi` configuration.

The only options on the `bapi` config are now `host` and `token`. Specifying `username` and `password` and using Basic authentication is no longer supported.

Please note that the term `bapi` is deprecated and only used to ensure compatibility. It will be updated in a later version.

### oauth

A new top-level option has been added for oauth configuration. See [Checkout login](#checkout-login) for more details.

### log

A new top-level config option has been added for controlling the log behaviour. See [Logging](#logging) for more details.

### apiBaseUrl

The apiBaseUrl configuration is no longer available, but will be reintroduced in a future update.

### sessionCookieDomain

The `sessionCookieDomain` option has been removed. This is a leftover option that was never used in `storefront-nuxt2` either. The best way to configure the domain of a session cookie is through the `session.domain` option.

### rpcMethods, rpcDir and rpcMethodNames

RPC methods are no longer passed directly to the storefront module config. Instead, `rpcDir` and `rpcMethodNames` must be configured to load custom RPC methods. See [RPC Methods](#rpc-methods) for more information.

### shopSelector

`'custom'` is no longer supported as a shop selector method and `getCurrentShop` has been removed. See [Shop Selector](#shopselector) for more details.

### stores/fetchStores

Fetching store configurations on demand is not supported in `storefront-nuxt` at this time. Shop configurations must be provided through the `stores` option and `fetchStores` has been removed.

### withParameters

Storefront config now supports `withParams` option so that we can pass the `with` parameters through the shop and set them as default parameters within certain composables (e.g `useWishlist`).
Furthermore, as a third default, the min with (e.g `MIN_WITH_PARAMS_BASKET`) parameters constant is set for the composables where it's needed.

```ts
const defaultWithParams =
  useNuxtApp().$runtimeConfig.storefront.withParams.wishlist
const withParams =
  toValue(params) || defaultWithParams || MIN_WITH_PARAMS_WISHLIST
```

### Shop Config

Shop configurations must be specified as a `ShopConfig[]` or `ShopConfigIndexed` on the `stores` option. The `ShopConfig` definition has also changed in `storefront-nuxt`.
While `ShopConfig[]` is a list containing `ShopConfig` objects, `ShopConfigIndexed` is an object using the `shopId` as object key for `ShopConfig` object containing the relevant shop configurations.
Using `ShopConfigIndexed` allows for `ShopConfig` values as part of the Nuxt `runtimeConfig` to be overridden by using Nuxt environment variables in the form of `NUXT_STOREFRONT_{shopId}_{shopConfig.key}`.

- `paymentProviders` removed - use additional shop data if needed
- `appKeys` added - will override the global `appKeys` option for the shop if set
- `bapi` now optional - will override the global `bapi` option for the shop if set
- `redis` now optional - will override the global `appKeys` option for the shop if set
- `apiBasePath` removed
- `cache` removed - This shop-level cache configuration was never used.
- `$sessionConfig` renamed to `sessionConfig`

#### shop.checkout

In `storefront-nuxt` `shopId` and `oauthHost` have been removed from the shop checkout config.

#### Extending the ShopConfig with additional properties

It's possible to add extra metadata to each shop configuration. How that data has to be typed has changed in `@scayle/storefront-nuxt`.
In `@scayle/storefront-nuxt2`, `ModuleOptions` accepted a generic parameter `CustomStoreConfig` which defined the additional properties.
In `@scayle/storefront-nuxt` the public interface `AdditionalShopConfig` should be extended with the additional properties.

e.g.

```ts
declare module '@scayle/storefront-nuxt' {
  export interface AdditionalShopConfig {
    paymentProviders: string[]
  }
}
```

#### PublicShopData

In `storefront-nuxt`, the list of built-in configuration options that are considered public is the same as in `storefront-nuxt2`, minus the options that have been removed in `storefront-nuxt`.

The top-level `publicShopData` option controls which additional shop properties are considered 'public' and can be delivered to the client.

## RPC Methods

## useRpc

- RPC params are passed to `useRpc` instead of the `fetch` function returned by `useRpc`. The params are typed as `MaybeRefOrGetter<ParamsForMethod>` which resolves to `ParamsForMethod | () => ParamsForMethod | Ref<ParamsForMethod>`. If the parameters are static and won't change you can use the first option. If you want the parameters to be resolved when `refresh` is called, you can pass a function that returns the parameters.
- `useRpc` now supports autoFetch. By default this is turned off. It can be enabled by passing `autoFetch: true` within the rpc options.

Nuxt 2

```typescript
function useRpc(
  method: RpcMethodName | ValueOf<RpcMethods>,
  key: string,
): {
  data: Ref<TResult | null>
  fetching: Ref<boolean>
  fetch: (params: TParams) => Promise<void>
} {}
```

Nuxt 3

```typescript
function useRpc(
  method: RpcMethodName,
  key: string,
  params?: TParams,
  options: RpcOptions,
): {
  data: Ref<TResult | null>
  fetching: Ref<boolean>
  fetch: () => Promise<void>
} {}
```

## Cache

`storefront-nuxt` adds a new `cache.provider` option which allows selecting various cache providers. The default value is `"redis"`, which creates a redis-backed cached, but it can also be set to `"unstorage"` which creates an in-memory [unstorage](https://github.com/unjs/unstorage) cache.

Same as in `storefront-nuxt2`, the `AY_CACHE_DISABLED` env var can be used to disable the cache. However, support for this env var will be removed in an upcoming release. https://aboutyou.atlassian.net/browse/
## Redirects

The redirects module is configured through module options rather than environment variables. Instead of setting `REDIRECTS_ENABLED` and `REDIRECTS_PARAM_WHITELIST`, use `storefront.redirects.enabled` and `storefront.redirects.queryParamWhitelist`.

## Logging

In `storefront-nuxt2`, the storefront is responsible for creating the Log object and injecting it into the core. In `storefront-nuxt` the Log is created in the core, but can be configured through module options.

## Basic Auth

Basic auth is not supported as part of `storefront-nuxt` (Nuxt 3). If basic auth is required, it should be configured on web server level (.e.g. within Nginx).

## Checkout Login

In `@scayle/storefront-nuxt`, the only supported checkout authentication method is token-based authentication.

The OAuth configuration is configured through server-side only (private) runtimeConfig rather than env variables. Instead of setting `OAUTH_API_HOST`, `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`, use `runtimeConfig.$storefront.oauth.host`, `runtimeConfig.$storefront.oauth.clientId` and `runtimeConfig.$storefront.oauth.clientSecret`.

```ts
const config = {
  // ...
  oauth: {
    host: process.env.OAUTH_API_HOST,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
  },
}
```

## Sessions

In `storefront-nuxt2`, the sessions handling is built on top of `express-session`. However, Nuxt 3 uses `h3` instead of express so this library is no longer an option. Instead, we use `@scayle/h3-session` which is a port of `express-session` for `h3`. The options for configuring sessions remain the same. As the session storage and cookie format also remains the same, sessions should be preserved when migrating from Nuxt 2 to Nuxt 3.

The session persistence uses `unstorage` (and `ioredis` indirectly) instead of `node-redis`, but this is not expected to cause any issues. There is an additional `session.provider` option in `storefront-nuxt` which allows switching between the default redis store and an in-memory store (for testing).

`session.secret` can now be a `string` or `string[]`. This matches the option in `express-session`/`@scayle/h3-session` and allows changing the cookie-signing secret without invalidating existing cookies.

## ShopSelector

In the Nuxt 3 module, the only options available for `runtimeConfig.$storefront.shopSelector` are `'path'` and `'domain'`. `'custom'` has been removed because we are not able to execute a function that has been provided through the module options.

Path selection also works slightly differently. Instead of using the locale of shop as the path prefix, there is now a `path` property on the shop config that is used instead.

In API requests, the header `x-shop-id` is used. In the Nuxt 2 package, `x-shop-locale` was used.

### What does this mean for Storefronts?

- If you are using domain shop-selection, no changes should be necessary.
- If you are using path shop-selection, make sure you configure each shop in your config with a `path` property.
- If you are using custom shop-selection, switch to path or domain selection.

## Injected values

In Nuxt 2, `currentShop` and `availableShops` are injected in the Nuxt context. In Nuxt 3, they are still injected but also can be accessed via composables.

Nuxt 2

```typescript
const { $currentShop, $availableShops } = useContext()
```

Nuxt 3

```typescript
const currentShop = useCurrentShop()
const availableShops = useAvailableShops()
// or
const { $currentShop, $availableShops } = useNuxtApp()
```

## Composables with breaking changes

### useSearch

- `fetching` has been renamed to `pending`
- `searchIsActive` has been removed. This value was not used.
- `goToSearchResultAndResetState` has been removed. Routing should be handled in the app.

### useSession

`useSession` now uses `rpcCall` instead of `useRpc`. The only exported members are the RPC functions. If you need a ref for the loading status, create one manually.

### useUser

`refresh` is renamed to `forceRefresh`

Nuxt 2

```typescript
const { isLoggingIn, loginData, login } = useSession()
login({ username, password })
```

Nuxt 3

```typescript
const { login } = useSession()
const isLoggingIn = ref(true)
const loginData = await login({ username, password })
isLoggingIn.value = false
```

### useNavigationTrees

The composable has been split into `useNavigationTrees` for fetching all navigation trees and `useNavigationTree` to fetch a specific tree by ID.

### Renamed composables

- `useUserWithParams` is now `useUser`
- `useBasketWithParams` is now `useBasket`
- `useWishlistWithParams` is now `useWishlist`

(See also: [Configuration - With Parameters](#with-parameters))

### Removed composables

- `sharedRef` has been removed - Use [useState](https://nuxt.com/docs/getting-started/state-management) instead.
- `useUserFacet` has been removed - Use `useUser`, `useWishlist` and `useBasket` instead

## Helper functions

In Nuxt 2 we provided various helper functions within the `$helper` object of the context. Those helper functions are placed within the `utils` folder. This allows them to be auto imported, meaning they are globally available without any prefix.

In Nuxt2

```typescript
const { $helpers } = useContext()
$helper.route.getCurrentPage(...)
```

```html
<template>
  <div>{{ $helper.route.getCurrentPage(...) }}</div>
</template>
```

In Nuxt 3

```typescript
getCurrentPage(...)
```

```html
<template>
  <div>{{ getCurrentPage(...) }}</div>
</template>
```

### Auto-imported helpers

The following helpers have been migrated to `storefront-nuxt`. They are added to auto-import config in Nuxt 3 and do not have to be explicitly imported.

#### Route helpers

- `getCurrentPage`

### Price helpers

- `toCurrency`
- `formatPrice`
