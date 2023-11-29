import { HashAlgorithm, type ModuleOptions } from '@scayle/storefront-nuxt'
import * as customRpcMethods from '../rpcMethods'
import withParams from '../constants/withParams'

const baseShopConfig = {
  domain: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_DOMAIN,
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
    shopId: 1028,
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
    shopId: 1018,
    currency: 'EUR',
  },
  {
    locale: 'de-CH',
    path: 'ch',
    shopId: 1019,
    currency: 'EUR',
  },
]

export const storefrontRuntimeConfigPrivate: Partial<ModuleOptions> = {
  // Following keys are Overrideable using prefix NUXT_PUBLIC_PUBLIC_SHOP_DATA
  publicShopData: ['paymentProviders', 'isLowestPreviousPriceActive'],
  // Following keys are Overrideable using prefix NUXT_STOREFRONT_REDIRECTS_
  redirects: {
    enabled: false, // Override: NUXT_STOREFRONT_REDIRECTS_ENABLED
    queryParamWhitelist: [], // Override: NUXT_STOREFRONT_REDIRECTS_QUERY_PARAM_WHITELIST
  },
  // Following keys are Overrideable using prefix NUXT_STOREFRONT_SESSION_
  session: {
    sameSite: 'none',
    maxAge: 2419200, // four weeks in seconds
    provider: 'redis',
  },
  bapi: {
    host: '', // Override: NUXT_STOREFRONT_BAPI_HOST,
    token: '', // Override: NUXT_STOREFRONT_BAPI_TOKEN,
  },
  oauth: {
    apiHost: '', // Override: NUXT_STOREFRONT_OAUTH_API_HOST,
    clientId: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_ID,
    clientSecret: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_SECRET,
  },
  shopSelector: 'path', // Override: NUXT_STOREFRONT_SHOP_SELECTOR
  // Following keys are Overrideable using prefix NUXT_STOREFRONT_STORES
  stores: shops.reduce(
    (previousShopConfigs, shop) => ({
      // Values within `storefront.stores` are Overrideable by using their locale as identifier.
      // Example of an runtimeConfig override: NUXT_STOREFRONT_STORES_EN_US_PATH=someValue
      // All values should be provided through runtime using NUXT_ environment variable overrides.
      // https://nuxt.com/docs/guide/going-further/runtime-config#example
      ...previousShopConfigs,
      // We can use shop.locale instead of shop.shopId to avoid conflicts if we use the same shopId for multiple shop.
      // The key [shop.locale] is connected to the Overrideable environment variables like NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_USER.
      // Depending on what key will be used here, the variables need use either the locale or shopId as{UNIQUE_IDENTIFIER}.
      // NOTE: We recommend to use the shopId as {UNIQUE_IDENTIFIER}!
      // Example if `[shop.locale]` is used -> Overrideable environment variable: NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_USER.
      // Example if `[shop.shopId]` is used -> Overrideable environment variable: NUXT_STOREFRONT_STORES_1001_CHECKOUT_USER.
      [shop.shopId]: {
        ...baseShopConfig,
        shopId: shop.shopId, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_SHOP_ID
        path: shop.path, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_PATH
        locale: shop.locale, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_LOCALE
        isLowestPreviousPriceActive: false, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_IS_LOWEST_PREVIOUS_PRICE_ACTIVE,
        auth: {
          // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_AUTH_RESET_PASSWORD_URL
          resetPasswordUrl: `https://${baseShopConfig.domain}/${shop.locale}/signin/`,
        },
        storeCampaignKeyword: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_STORE_CAMPAIGN_KEYWORD,
        currency: shop.currency, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CURRENCY
        checkout: {
          shopId: shop.shopId, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_SHOP_ID
          // Checkout probably isn't configured for the non-DE shops
          // but the main goal is testing storefront
          token: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_TOKEN,
          secret: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_SECRET,
          host: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_HOST,
          user: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_USER,
          /**
           * The number of seconds that a CBD token should be considered valid since issued
           */
          cbdExpiration: 60 * 60 * 2, // 2 hours
        },
      },
    }),
    {},
  ),
  redis: {
    host: 'localhost', // Override: NUXT_STOREFRONT_REDIS_HOST,
    port: 6379, // Override: NUXT_STOREFRONT_REDIS_PORT,
    prefix: '', // Override: NUXT_STOREFRONT_REDIS_PREFIX,
    user: '', // Override: NUXT_STOREFRONT_REDIS_USER,
    password: '', // Override: NUXT_STOREFRONT_REDIS_PASSWORD,
    sslTransit: false, // Override: NUXT_STOREFRONT_REDIS_SSL_TRANSIT),
  },
  // Following keys are Overrideable using prefix NUXT_STOREFRONT_CACHE
  cache: {
    auth: {
      username: 'max',
      password: 'mustermann',
    },
    enabled: true,
  },
  // Following keys are Overrideable using prefix NUXT_PUBLIC_WITH_PARAMS
  withParams,
}

export const storefrontRuntimeConfigPublic: Partial<ModuleOptions> = {
  // Following keys are Overrideable using prefix NUXT_PUBLIC_LOG
  log: {
    name: 'storefront-boilerplate-nuxt',
    level: 'debug',
  },
}

export const storefrontBuildtimeConfig: Partial<ModuleOptions> = {
  rpcMethodNames: Object.keys(customRpcMethods),
}
