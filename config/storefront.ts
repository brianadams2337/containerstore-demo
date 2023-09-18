import { HashAlgorithm, ModuleOptions } from '@scayle/storefront-nuxt'
import environment from '../environment'
import * as customRpcMethods from '../rpcMethods'
import withParams from '../constants/withParams'

const baseShopConfig = {
  domain: environment.NUXT_STOREFRONT_DOMAIN_DEFAULT,
  paymentProviders: [
    'lastschrift',
    'visa',
    'mastercard',
    'discover',
    'diners',
    'ratepay',
    'klarna',
    'paypal',
  ],
  appKeys: {
    wishlistKey: 'wishlist_{shopId}_{userId}',
    basketKey: 'basket_{shopId}_{userId}',
    hashAlgorithm: HashAlgorithm.SHA256,
  },
}

type RpcMethodsStorefrontType = typeof customRpcMethods
declare module '@scayle/storefront-nuxt' {
  export interface RpcMethodsStorefront extends RpcMethodsStorefrontType {}

  // Extend the shop config
  export interface AdditionalShopConfig {
    paymentProviders: string[]
    appKeys: (typeof baseShopConfig)['appKeys']
    isLowestPreviousPriceActive?: boolean
  }
  // Extend PublicShopConfig to make types available on currentShop
  export interface PublicShopConfig {
    isLowestPreviousPriceActive?: boolean
    paymentProviders: string[]
  }
}

// TODO: Make sure BAPI and CO can work with multiple shops
const shops = [
  {
    locale: 'en-US',
    path: 'en',
    shopId: 1001, // 1028,
    currency: 'USD',
  },
  {
    locale: 'de-DE',
    path: 'de',
    shopId: 1001,
    currency: 'EUR',
  },
  {
    locale: 'de-AT',
    path: 'at',
    shopId: 1001,
    currency: 'EUR',
  },
  {
    locale: 'de-CH',
    path: 'ch',
    shopId: 1001,
    currency: 'EUR',
  },
]

const protocol =
  (environment.HTTPS_KEY && environment.HTTPS_CERT) ||
  process.env.NODE_ENV === 'production'
    ? 'https://'
    : 'http://'

export const storefrontRuntimeConfigPrivate: Partial<ModuleOptions> = {
  // Following keys are overridable using prefix NUXT_PUBLIC_PUBLIC_SHOP_DATA
  publicShopData: ['paymentProviders', 'isLowestPreviousPriceActive'],
  // Following keys are overridable using prefix NUXT_STOREFRONT_REDIRECTS
  redirects: {
    enabled: Boolean(process.env.NUXT_STOREFRONT_REDIRECTS_ENABLED),
    queryParamWhitelist: [],
  },
  // Following keys are overridable using prefix NUXT_STOREFRONT_SESSION
  session: {
    sameSite: process.env.APP_ENV !== 'production' ? 'none' : 'lax',
    maxAge: 2419200000, // four weeks in milliseconds
    provider: 'redis',
  },
  // Following keys are overridable using prefix NUXT_STOREFRONT_BAPI
  bapi: {
    host: environment.NUXT_STOREFRONT_BAPI_HOST,
    token: environment.NUXT_STOREFRONT_BAPI_TOKEN,
    // TODO: Is shopId required here for tenants that need to separate shop/customer data?
  },
  // Following keys are overridable using prefix NUXT_STOREFRONT_OAUTH
  oauth: {
    host: environment.NUXT_STOREFRONT_OAUTH_API_HOST,
    clientId: environment.NUXT_STOREFRONT_OAUTH_CLIENT_ID,
    clientSecret: environment.NUXT_STOREFRONT_OAUTH_CLIENT_SECRET,
  },
  // Following keys are overridable using prefix NUXT_STOREFRONT_SHOP_SELECTOR
  shopSelector: environment.NUXT_STOREFRONT_DOMAIN_PER_LOCALE ? 'domain' : 'path',
  // Following keys are overridable using prefix NUXT_STOREFRONT_STORES
  stores: shops.reduce(
    (previousShopConfigs, shop) => ({
      // Values within `storefront.stores` are overridable by using their locale as identifier.
      // Example of an runtimeConfig override: NUXT_STOREFRONT_STORES_EN_US_PATH=someValue
      // We use environment.NUXT_STOREFRONT_STORES_{LOCALE}_SOME_VALUE only to set some empty default,
      // as all values should be provided through runtime using NUXT_ environment variable overrides.
      // https://nuxt.com/docs/guide/going-further/runtime-config#example
      ...previousShopConfigs,
      // Use shop.locale instead of shop.shopId to avoid conflicts if we use the same id
      [shop.locale]: {
        ...baseShopConfig,
        shopId: shop.shopId,
        path: shop.path,
        locale: shop.locale,
        isLowestPreviousPriceActive:
          environment.NUXT_STOREFRONT_STORES_EN_US_IS_LOWEST_PREVIOUS_PRICE_ACTIVE,
        auth: {
          resetPasswordUrl: `${protocol}${shop.locale}/signin/`,
        },
        storeCampaignKeyword: environment.NUXT_STOREFRONT_STORES_EN_US_CAMPAIGN_KEYWORD,
        currency: shop.currency,
        checkout: {
          shopId: shop.shopId,
          // Checkout probably isn't configured for the non-DE shops
          // but the main goal is testing storefront
          token: environment.NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_TOKEN,
          secret: environment.NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_SECRET,
          host: environment.NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_HOST,
          user: environment.NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_USER,
        }
      }}
      ),
    {}
  ),
  // Following keys are overridable using prefix NUXT_STOREFRONT_REDIS
  redis: {
    host: environment.NUXT_STOREFRONT_REDIS_HOST,
    port: environment.NUXT_STOREFRONT_REDIS_PORT,
    prefix: environment.NUXT_STOREFRONT_REDIS_PREFIX,
    user: process.env.NUXT_STOREFRONT_REDIS_USER,
    password: process.env.NUXT_STOREFRONT_REDIS_PASSWORD,
    sslTransit: Boolean(process.env.NUXT_STOREFRONT_SSL_TRANSIT)
  },
  // Following keys are overridable using prefix NUXT_STOREFRONT_CACHE
  cache: {
    auth: {
      username: 'max',
      password: 'mustermann',
    },
    // TODO: Check following if required:
    // enabled: process.env.AY_CACHE_DISABLED !== 'true',
    // ttl: 60 * 60,
    // sendCacheControlHeaders: true,
    // maxAge: 60 * 60,
    // staleWhileRevalidate: 60 * 60 * 24,
    // generateCacheKey: () =>
  }
}

export const storefrontRuntimeConfigPublic: Partial<ModuleOptions> = {
  // Following keys are overridable using prefix NUXT_PUBLIC_WITH_PARAMS
  withParams,
  // Following keys are overridable using prefix NUXT_PUBLIC_LOG
  log: {
    name: 'storefront-boilerplate-nuxt',
  },
  // Following keys are overridable using prefix NUXT_PUBLIC_IMAGE_BASE_URL
  imageBaseUrl: environment.NUXT_PUBLIC_IMAGE_BASE_URL,
}


export const storefrontBuildtimeConfig: Partial<ModuleOptions> = {
  rpcMethodNames: Object.keys(customRpcMethods),
}
