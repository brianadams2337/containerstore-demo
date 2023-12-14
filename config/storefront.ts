import { HashAlgorithm, type ModuleOptions } from '@scayle/storefront-nuxt'
import * as customRpcMethods from '../rpcMethods'
import withParams from '../constants/withParams'

/** Custom type declaration for local Storefront configuration */
type RpcMethodsStorefrontType = typeof customRpcMethods
declare module '@scayle/storefront-nuxt' {
  export interface RpcMethodsStorefront extends RpcMethodsStorefrontType {}

  // Extend the shop config
  export interface AdditionalShopConfig {
    paymentProviders: string[]
    appKeys: typeof DEFAULT_APP_KEYS
    isLowestPreviousPriceActive?: boolean
  }
  // Extend PublicShopConfig to make types available on currentShop
  export interface PublicShopConfig {
    isLowestPreviousPriceActive?: boolean
    paymentProviders: string[]
  }
}

/** [DEFAULT VALUE] Storefront Core - Shop domain if `domain` is selected as `shopSelector
 * https://scayle.dev/en/dev/storefront-core/module-configuration#path-and-domain */
const BASE_SHOP_DOMAIN = ''

/** [DEFAULT VALUE] Storefront Core - Configure format for AppKey generation for baskets and wishlists
 * https://scayle.dev/en/dev/storefront-core/module-configuration#app-keys */
const DEFAULT_APP_KEYS = {
  wishlistKey: 'wishlist_{shopId}_{userId}', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_APP_KEYS_WISHLIST_KEY
  basketKey: 'basket_{shopId}_{userId}', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_APP_KEYS_BASKET_KEY
  hashAlgorithm: HashAlgorithm.SHA256, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_APP_KEYS_HASH_ALGORITHM
}

/**
 * List of shops to be used to define the `stores` list
 */
const shops = [
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
  {
    locale: 'en-US',
    path: 'en',
    shopId: 1028,
    currency: 'USD',
  },
]

// https://scayle.dev/en/dev/storefront-core/module-configuration
export const storefrontRuntimeConfigPrivate: Partial<ModuleOptions> = {
  /** Storefront Core - Additional server-side context properties exposed to client-side
   * https://scayle.dev/en/dev/storefront-core/module-configuration#public-shop-data */
  publicShopData: ['paymentProviders', 'isLowestPreviousPriceActive'], // Override: NUXT_PUBLIC_PUBLIC_SHOP_DATA

  /** [OPTIONAL] Storefront Core - Fetch redirects from Storefront API set within Cloud Panel
   * https://scayle.dev/en/dev/storefront-core/module-configuration#redirects
   * https://scayle.dev/en/dev/storefront-core/redirects */
  redirects: {
    enabled: false, // Override: NUXT_STOREFRONT_REDIRECTS_ENABLED
    queryParamWhitelist: [], // Override: NUXT_STOREFRONT_REDIRECTS_QUERY_PARAM_WHITELIST
  },

  /** Storefront Core - Configuration of session handling and cookie
   * https://scayle.dev/en/dev/storefront-core/module-configuration#sessions */
  session: {
    sameSite: 'none', // Override: NUXT_STOREFRONT_SESSION_SAME_SITE
    maxAge: 2419200, // 4 weeks in seconds | Override: NUXT_STOREFRONT_SESSION_MAX_AGE
  },

  /** Storefront Core - Storefront API Client configuration
   * NOTE: Formerly known as `backbone` or `bapi`, option will be renamed in the future!
   * https://scayle.dev/en/dev/storefront-core/module-configuration#storefront-api */
  bapi: {
    host: '', // Override: NUXT_STOREFRONT_BAPI_HOST
    token: '', // Override: NUXT_STOREFRONT_BAPI_TOKEN
  },

  /** Storefront Core - Token-based (OAuth) Authentication configurations
   * https://scayle.dev/en/dev/storefront-core/module-configuration#authentication */
  oauth: {
    apiHost: '', // Override: NUXT_STOREFRONT_OAUTH_API_HOST
    clientId: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_ID
    clientSecret: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_SECRET
  },

  /** Storefront Core - Configure shop switching based on selected routing option (`domain` or `path`-based)
   * https://scayle.dev/en/dev/storefront-core/module-configuration#path-and-domain  */
  shopSelector: 'path', // Override: NUXT_STOREFRONT_SHOP_SELECTOR

  /** Storefront Core - Shop-specific configuration options
   * https://scayle.dev/en/dev/storefront-core/module-configuration#shops */
  stores: shops.reduce(
    (previousShopConfigs, shop) => ({
      /** Values within `storefront.stores` are Overrideable by using their locale as identifier.
       * Example of an runtimeConfig override: NUXT_STOREFRONT_STORES_EN_US_PATH=someValue
       * All values should be provided through runtime using NUXT_ environment variable overrides.
       * https://nuxt.com/docs/guide/going-further/runtime-config#example */
      ...previousShopConfigs,

      /** We can use shop.locale instead of shop.shopId to avoid conflicts if we use the same shopId for multiple shop.
       * The key [shop.locale] is connected to the Overrideable environment variables like NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_USER.
       * Depending on what key will be used here, the variables need use either the locale or shopId as{UNIQUE_IDENTIFIER}.
       * NOTE: We recommend to use the shopId as {UNIQUE_IDENTIFIER}!
       * Example if `[shop.locale]` is used -> Overrideable environment variable: NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_USER.
       * Example if `[shop.shopId]` is used -> Overrideable environment variable: NUXT_STOREFRONT_STORES_1001_CHECKOUT_USER. */
      [shop.shopId]: {
        /** Storefront Core - Numeric SCAYLE ShopId (usually 5 digits) */
        shopId: shop.shopId, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_SHOP_ID

        /** [CONDITIONAL] Storefront Core - Shop path if `path` is selected as `shopSelector
         * https://scayle.dev/en/dev/storefront-core/module-configuration#path-and-domain */
        path: shop.path, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_PATH

        /** [CONDITIONAL] Storefront Core - Shop domain if `domain` is selected as `shopSelector
         * https://scayle.dev/en/dev/storefront-core/module-configuration#path-and-domain */
        domain: BASE_SHOP_DOMAIN,

        locale: shop.locale, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_LOCALE

        isLowestPreviousPriceActive: false, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_IS_LOWEST_PREVIOUS_PRICE_ACTIVE,

        /** Storefront Core - Store-specific authentication configurations
         * NOTE: Currently only `resetPasswordUrl` is supported
         * https://scayle.dev/en/dev/storefront-core/module-configuration#password-reset-url */
        auth: {
          // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_AUTH_RESET_PASSWORD_URL
          resetPasswordUrl: `https://${BASE_SHOP_DOMAIN}/${shop.locale}/signin/`,
        },

        /** Storefront Core - Set shop-specific campaign keyword to be used */
        storeCampaignKeyword: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_STORE_CAMPAIGN_KEYWORD,

        /** Storefront Core - Set shop-specific currency to be used */
        currency: shop.currency, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CURRENCY

        /** Storefront Core - Checkout web component configuration */
        checkout: {
          shopId: shop.shopId, // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_SHOP_ID
          token: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_TOKEN
          secret: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_SECRET
          host: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_HOST
          user: '', // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_USER
          // The number of seconds that a CBD token should be considered valid since issued
          cbdExpiration: 60 * 60 * 2, // 2 hours
        },

        /** Storefront Core - Configure format for AppKey generation for baskets and wishlists
         * https://scayle.dev/en/dev/storefront-core/module-configuration#app-keys */
        appKeys: DEFAULT_APP_KEYS,
        /** Storefront Core - Additional Shop Data for Payment providers
         * https://scayle.dev/en/dev/storefront-core/module-configuration#additional-shop-data */
        paymentProviders: [
          'lastschrift',
          'visa',
          'mastercard',
          'discover',
          'diners',
          'ratepay',
          'klarna',
          'paypal',
        ], // Override: NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_PAYMENT_PROVIDERS,
      },
    }),
    {},
  ),
  /** Storefront Core - Storage Configuration for `cache` and `session` mountpoints
   * https://scayle.dev/en/dev/storefront-core/module-configuration#storage */
  storage: (() => {
    if (
      process.env.NITRO_PRESET &&
      process.env.NITRO_PRESET.includes('vercel')
    ) {
      // No driver options are necessary for vercelKV
      // It supports url, token and others, but if they are
      // not preset, it will use KV_REST_API_URL and KV_REST_API_TOKEN
      // which are added automatically when Vercel KV is enabled.
      // If for some reason, different values are necessary, you can still
      // use NUXT_STOREFRONT_STORAGE_SESSION_x variables.
      return {
        cache: {
          driver: 'vercelKV',
          url: '',
          token: '',
        },
        session: {
          driver: 'vercelKV',
          url: '',
          token: '',
        },
      }
    }

    return {
      cache: {
        // Redis Options: https://redis.github.io/ioredis/index.html#RedisOptions
        driver: 'redis', // Override: NUXT_STOREFRONT_STORAGE_CACHE_PROVIDER
        compression: 'gzip', // Override: NUXT_STOREFRONT_STORAGE_CACHE_COMPRESSION
        host: 'localhost', // Override: NUXT_STOREFRONT_STORAGE_CACHE_HOST
        port: 6379, // Override: NUXT_STOREFRONT_STORAGE_CACHE_PORT
        username: '', // Override: NUXT_STOREFRONT_STORAGE_CACHE_USERNAME
        password: '', // Override: NUXT_STOREFRONT_STORAGE_CACHE_PASSWORD
        tls: false, // Override: NUXT_STOREFRONT_STORAGE_CACHE_TLS,
        // Required to resolve connection issues with AWS ElastiCache
        checkServerIdentity: undefined, // Override: NUXT_STOREFRONT_STORAGE_CACHE_CHECK_SERVER_INTEGRITY,
      },
      session: {
        // Redis Options: https://redis.github.io/ioredis/index.html#RedisOptions
        driver: 'redis', // Override: NUXT_STOREFRONT_STORAGE_SESSION_PROVIDER
        host: 'localhost', // Override: NUXT_STOREFRONT_STORAGE_SESSION_HOST
        port: 6379, // Override: NUXT_STOREFRONT_STORAGE_SESSION_PORT
        db: 1, // Override: NUXT_STOREFRONT_STORAGE_SESSION_DB
        username: '', // Override: NUXT_STOREFRONT_STORAGE_SESSION_USERNAME
        password: '', // Override: NUXT_STOREFRONT_STORAGE_SESSION_PASSWORD
        tls: false, // Override: NUXT_STOREFRONT_STORAGE_SESSION_TLS,
        // Required to resolve connection issues with AWS ElastiCache
        checkServerIdentity: undefined, // Override: NUXT_STOREFRONT_STORAGE_SESSION_CHECK_SERVER_INTEGRITY,
      },
    }
  })(),
  /** [OPTIONAL] Storefront Core - Internal cache behaviour configurations
   * https://scayle.dev/en/dev/storefront-core/module-configuration#cache */
  cache: {
    auth: {
      username: 'max', // Override: NUXT_STOREFRONT_CACHE_AUTH_USERNAME
      password: 'mustermann', // Override: NUXT_STOREFRONT_CACHE_AUTH_PASSWORD
    },
    enabled: true, // Override: NUXT_STOREFRONT_CACHE_ENABLED
  },
  /** [OPTIONAL] Storefront Core - `with` Parameter
   * https://scayle.dev/en/dev/storefront-core/module-configuration#with-params */
  withParams, // Previous withParams keys are Overrideable using prefix NUXT_PUBLIC_WITH_PARAMS_
}

/** Storefront Core - Public Runtime Configuration
 * https://scayle.dev/en/dev/storefront-core/module-configuration  */
export const storefrontRuntimeConfigPublic: Partial<ModuleOptions> = {
  /** Storefront Core - Internal logger configuration
   * https://scayle.dev/en/dev/storefront-core/module-configuration#log */
  log: {
    name: 'storefront-boilerplate-nuxt', // Override: NUXT_PUBLIC_LOG_NAME
    level: 'debug', // Override: NUXT_PUBLIC_LOG_LEVEL
  },
}

/** Storefront Core - Buildtime Configuration
 * https://scayle.dev/en/dev/storefront-core/module-configuration */
export const storefrontBuildtimeConfig: Partial<ModuleOptions> = {
  // Storefront Core - Custom RPC Methods
  // https://scayle.dev/en/dev/storefront-core/module-configuration#custom-rpc-methods
  rpcMethodNames: Object.keys(customRpcMethods), // NOT OVERRIDABLE AT RUNTIME
}
