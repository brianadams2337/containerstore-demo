import { type NuxtConfig, defineNuxtConfig } from 'nuxt/config'
import type { HookResult } from '@nuxt/schema'
import { nanoid } from 'nanoid'
import { HashAlgorithm, type ModuleBaseOptions } from '@scayle/storefront-nuxt'
import * as customRpcMethods from './rpcMethods'
import withParams from './constants/withParams'
import { shops } from './config/shops'
import breakpoints from './config/breakpoints'
import { stringToBoolean } from './utils/boolean'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    cdnUrl: string
    googleMapsApiKey: string
  }
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'shop:change': (shopInfo: { shopId: number; locale?: string }) => HookResult
  }
}

/** [DEFAULT VALUE] Storefront Core - Configure format for AppKey generation for baskets and wishlists
 * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#app-keys */
const DEFAULT_APP_KEYS = {
  wishlistKey: 'wishlist_{shopId}_{userId}', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_APP_KEYS_WISHLIST_KEY
  basketKey: 'basket_{shopId}_{userId}', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_APP_KEYS_BASKET_KEY
  hashAlgorithm: HashAlgorithm.SHA256, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_APP_KEYS_HASH_ALGORITHM
}

declare module '@scayle/storefront-nuxt' {
  // Extend the shop config
  export interface AdditionalShopConfig {
    paymentProviders: string[]
    appKeys: typeof DEFAULT_APP_KEYS
  }
  /**
   * Represents the public configuration of a shop.
   *
   * This interface extends the shop configuration to make additional properties
   * available on `currentShop`, ensuring proper regional and payment settings.
   *
   * @typedef PublicShopConfig
   *
   * @property paymentProviders - List of payment providers available for the shop.
   *
   * @property countryCode - The country code used to determine the shop's region.
   *
   * This property is necessary for distinguishing shops in different languages within the same country.
   * For example, Germany may have two shops: one in German (`de_DE`) and another in English (`en_US`).
   * Since the `locale` attribute only represents language and not the region, `countryCode` ensures
   * correct regional detection.
   */
  export interface PublicShopConfig {
    paymentProviders: string[]
    countryCode: string
  }
}

type NitroRouteRules = Required<NuxtConfig>['routeRules']
type NitroRouteConfig = NitroRouteRules extends Record<string, infer Value>
  ? Value
  : never

/** [DEFAULT VALUE] Storefront Core - Shop domain if `domain` is selected as `shopSelector
 * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#path-and-domain */
const baseShopDomain = (code: string | string[]) =>
  `${Array.isArray(code) ? code[0] : code}.localhost:3000`

const SHOP_SELECTOR_MODE = 'path' as ModuleBaseOptions['shopSelector']
const DOMAIN_PER_LOCALE = SHOP_SELECTOR_MODE === 'domain'

const isVercel =
  process.env.NITRO_PRESET && process.env.NITRO_PRESET.includes('vercel')

// Generate the I18N locales from the shop config
interface LocaleConfig {
  code: string
  language: string
  domain: string
  file: string
}

const locales: LocaleConfig[] = shops.flatMap((shop) => {
  if (Array.isArray(shop.code)) {
    return shop.code.map((code) => ({
      code,
      language: shop.locale,
      domain: baseShopDomain(code),
      file: shop.translationFile,
    }))
  } else {
    return {
      code: shop.code,
      language: shop.locale,
      domain: baseShopDomain(shop.code),
      file: shop.translationFile,
    }
  }
})

function getI18nStrategy(): 'prefix' | 'prefix_except_default' | 'no_prefix' {
  if (SHOP_SELECTOR_MODE === 'path') {
    return 'prefix'
  }
  if (SHOP_SELECTOR_MODE === 'path_or_default') {
    return 'prefix_except_default'
  }
  return 'no_prefix'
}

const defaultShop = shops.find((shop) => shop.isDefault) ?? shops[0]
const i18nDefaultLocale = Array.isArray(defaultShop.code)
  ? defaultShop.code[0]
  : defaultShop.code

export default defineNuxtConfig({
  // https://nuxt.com/docs/api/nuxt-config#compatibilitydate
  compatibilityDate: '2024-09-03',

  // https://nuxt.com/docs/api/nuxt-config#devtools
  devtools: { enabled: true },

  // https://nuxt.com/docs/api/nuxt-config#telemetry
  telemetry: false,

  // https://nuxt.com/docs/api/nuxt-config#debug
  debug: stringToBoolean(process.env.NUXT_DEBUGGING_ENABLED),

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    // Following keys are Overrideable using prefix NUXT_CHECKOUT_
    checkout: {
      accessHeader: undefined, // Override: NUXT_CHECKOUT_ACCESS_HEADER
    },
    // Configuration for the omnichannel add-on
    // https://scayle.dev/en/extensions/omnichannel/user-guide
    omnichannel: {
      apiToken: '', // Override: NUXT_OMNICHANNEL_API_TOKEN
      apiHost: '', // Override: NUXT_OMNICHANNEL_API_HOST
    },
    // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction
    storefront: {
      /** Storefront Core - Additional server-side context properties exposed to client-side
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#public-shop-data */
      publicShopData: ['paymentProviders', 'countryCode'], // Override: NUXT_PUBLIC_PUBLIC_SHOP_DATA

      /** Storefront Core - Configure format for AppKey generation for baskets and wishlists
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#app-keys */
      appKeys: DEFAULT_APP_KEYS,

      /** [OPTIONAL] Storefront Core - Fetch redirects from Storefront API set within Cloud Panel
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/redirects */
      redirects: {
        enabled: false, // Override: NUXT_STOREFRONT_REDIRECTS_ENABLED
        queryParamWhitelist: [], // Override: NUXT_STOREFRONT_REDIRECTS_QUERY_PARAM_WHITELIST
      },

      /** Storefront Core - Configuration of session handling and cookie
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/sessions */
      session: {
        sameSite: 'lax', // Override: NUXT_STOREFRONT_SESSION_SAME_SITE
        maxAge: 2419200, // 4 weeks in seconds | Override: NUXT_STOREFRONT_SESSION_MAX_AGE
      },

      /**
       * Storefront Core - Storefront API Client configuration
       * NOTE: Formerly known as `backbone` or `bapi`.
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storefront-api */
      sapi: {
        host: '', // Override: NUXT_STOREFRONT_SAPI_HOST
        token: '', // Override: NUXT_STOREFRONT_SAPI_TOKEN
      },

      /** Storefront Core - Token-based (OAuth) Authentication configurations
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication */
      oauth: {
        apiHost: '', // Override: NUXT_STOREFRONT_OAUTH_API_HOST
        clientId: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_ID
        clientSecret: '', // Override: NUXT_STOREFRONT_OAUTH_CLIENT_SECRET
      },

      /** Storefront Core - Identity Provider support for Token-based (OAuth) Authentication
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#identity-providers */
      idp: {
        enabled: false,
        idpKeys: [],
        idpRedirectURL: '',
      },

      /** Storefront Core - Configure shop switching based on selected routing option (`domain` or `path`-based)
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#path-and-domain  */
      shopSelector: SHOP_SELECTOR_MODE, // Override: NUXT_STOREFRONT_SHOP_SELECTOR

      /** Storefront Core - Shop-specific configuration options
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#shops */
      shops: shops.reduce(
        (previousShopConfigs, shop) => ({
          /** Values within `storefront.shops` are Overrideable by using their locale as identifier.
           * Example of an runtimeConfig override: NUXT_STOREFRONT_SHOPS_EN_US_PATH=someValue
           * All values should be provided through runtime using NUXT_ environment variable overrides.
           * https://nuxt.com/docs/guide/going-further/runtime-config#example */
          ...previousShopConfigs,

          /** We can use shop.locale instead of shop.shopId to avoid conflicts if we use the same shopId for multiple shop.
           * The key [shop.locale] is connected to the Overrideable environment variables like NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_USER.
           * Depending on what key will be used here, the variables need use either the locale or shopId as{UNIQUE_IDENTIFIER}.
           * NOTE: We recommend to use the shopId as {UNIQUE_IDENTIFIER}!
           * Example if `[shop.locale]` is used -> Overrideable environment variable: NUXT_STOREFRONT_SHOPS_EN_US_CHECKOUT_USER.
           * Example if `[shop.shopId]` is used -> Overrideable environment variable: NUXT_STOREFRONT_SHOPS_1001_CHECKOUT_USER. */
          [shop.shopId]: {
            /** Storefront Core - Identity Provider support for Token-based (OAuth) Authentication
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#identity-providers */
            idp: {
              enabled: false,
              idpKeys: ['google'],
              idpRedirectURL: '',
            },
            /** Storefront Core - Numeric SCAYLE ShopId (usually 5 digits) */
            shopId: shop.shopId, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_SHOP_ID
            /** [CONDITIONAL] Storefront Core - Shop path if `path` is selected as `shopSelector
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#path-and-domain */
            path: shop.code, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_PATH

            /** [CONDITIONAL] Storefront Core - Shop domain if `domain` is selected as `shopSelector
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#path-and-domain */
            domain: baseShopDomain(shop.code),

            locale: shop.locale, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_LOCALE

            /** Storefront Core -  Country code used to determine the shop's region. */
            countryCode: shop.countryCode,

            /** Storefront Core - Shop-specific authentication configurations
             * NOTE: Currently only `resetPasswordUrl` is supported
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#password-reset-url */
            auth: {
              // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_AUTH_RESET_PASSWORD_URL
              resetPasswordUrl: `https://${baseShopDomain(shop.code)}/${
                shop.locale
              }/signin/`,
            },

            /** Storefront Core - Set shop-specific campaign keyword to be used */
            shopCampaignKeyword: '', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_SHOP_CAMPAIGN_KEYWORD,

            /** Storefront Core - Set shop-specific currency to be used */
            currency: shop.currency, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CURRENCY

            /** Storefront Core - Checkout web component configuration */
            checkout: {
              shopId: shop.shopId, // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_SHOP_ID
              token: '', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_TOKEN
              secret: '', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_SECRET
              host: '', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_HOST
              user: '', // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_CHECKOUT_USER
              // The number of seconds that a CBD token should be considered valid since issued
              cbdExpiration: 60 * 60 * 2, // 2 hours
            },

            /** Storefront Core - Configure format for AppKey generation for baskets and wishlists
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication#app-keys-for-baskets-and-wishlists */
            appKeys: DEFAULT_APP_KEYS,

            /** Storefront Core - Additional Shop Data for Payment providers
             * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#additional-shop-data */
            paymentProviders: [
              'lastschrift',
              'visa',
              'mastercard',
              'discover',
              'diners',
              'ratepay',
              'klarna',
              'paypal',
            ], // Override: NUXT_STOREFRONT_SHOPS_{UNIQUE_IDENTIFIER}_PAYMENT_PROVIDERS,

            isDefault: shop.isDefault,
          },
        }),
        {},
      ),
      /** Storefront Core - Storage Configuration for `cache` and `session` mountpoints
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage */
      storage: (() => {
        if (isVercel) {
          // No driver options are necessary for vercelKV
          // It supports url, token and others, but if they are
          // not preset, it will use KV_REST_API_URL and KV_REST_API_TOKEN
          // which are added automatically when Vercel KV is enabled.
          // If for some reason, different values are necessary, you can still
          // use NUXT_STOREFRONT_STORAGE_SESSION_x variables.
          // https://unstorage.unjs.io/drivers/vercel
          return {
            cache: {
              driver: 'vercelKV',
              compression: 'gzip',
              // If deployed to Vercel, the respective environment variable value of `KV_REST_API_URL`
              // will be used for `url` and `KV_REST_API_TOKEN` for `token`.
            },
            session: {
              driver: 'vercelKV',
              // If deployed to Vercel, the respective environment variable value of `KV_REST_API_URL`
              // will be used for `url` and `KV_REST_API_TOKEN` for `token`.
            },
          }
        }

        return {
          cache: {
            driver: 'scayleKv', // Override: NUXT_STOREFRONT_STORAGE_CACHE_PROVIDER
            compression: 'brotli', // Override: NUXT_STOREFRONT_STORAGE_CACHE_COMPRESSION
            // Default TTL of 10 minutes for the cache. This is required so that the SSR cache also expires at some point.
            //
            // Override: NUXT_STOREFRONT_STORAGE_CACHE_TTL
            ttl: 10 * 60,
            disableClusterMode: false, // Override: NUXT_STOREFRONT_STORAGE_CACHE_DISABLE_CLUSTER_MODE
          },
          session: {
            driver: 'scayleKv', // Override: NUXT_STOREFRONT_STORAGE_SESSION_PROVIDER
            disableClusterMode: false, // Override: NUXT_STOREFRONT_STORAGE_SESSION_DISABLE_CLUSTER_MODE
          },

          // If you want to use Redis as the cache driver, uncomment the following lines and remove the above cache configuration.
          // cache: {
          //   // Redis Options: https://redis.github.io/ioredis/index.html#RedisOptions
          //   driver: 'redis', // Override: NUXT_STOREFRONT_STORAGE_CACHE_PROVIDER
          //   compression: 'brotli', // Override: NUXT_STOREFRONT_STORAGE_CACHE_COMPRESSION
          //   host: 'localhost', // Override: NUXT_STOREFRONT_STORAGE_CACHE_HOST
          //   port: 6379, // Override: NUXT_STOREFRONT_STORAGE_CACHE_PORT
          //   username: '', // Override: NUXT_STOREFRONT_STORAGE_CACHE_USERNAME
          //   password: '', // Override: NUXT_STOREFRONT_STORAGE_CACHE_PASSWORD
          //   tls: false, // Override: NUXT_STOREFRONT_STORAGE_CACHE_TLS,
          //   // Default TTL of 10 minutes for the cache. This is required so that the SSR cache also expires at some point.
          //   //
          //   // Override: NUXT_STOREFRONT_STORAGE_CACHE_TTL
          //   ttl: 10 * 60,
          //   // Required to resolve connection issues with AWS ElastiCache
          //   checkServerIdentity: undefined, // Override: NUXT_STOREFRONT_STORAGE_CACHE_CHECK_SERVER_INTEGRITY,
          //   maxRetriesPerRequest: 1, // Override: NUXT_STOREFRONT_STORAGE_CACHE_MAX_RETRIES_PER_REQUEST,
          // },
          // session: {
          //   // Redis Options: https://redis.github.io/ioredis/index.html#RedisOptions
          //   driver: 'redis', // Override: NUXT_STOREFRONT_STORAGE_SESSION_PROVIDER
          //   host: 'localhost', // Override: NUXT_STOREFRONT_STORAGE_SESSION_HOST

          //   port: 6379, // Override: NUXT_STOREFRONT_STORAGE_SESSION_PORT
          //   db: 1, // Override: NUXT_STOREFRONT_STORAGE_SESSION_DB
          //   username: '', // Override: NUXT_STOREFRONT_STORAGE_SESSION_USERNAME
          //   password: '', // Override: NUXT_STOREFRONT_STORAGE_SESSION_PASSWORD
          //   tls: false, // Override: NUXT_STOREFRONT_STORAGE_SESSION_TLS,
          //   // Required to resolve connection issues with AWS ElastiCache
          //   checkServerIdentity: undefined, // Override: NUXT_STOREFRONT_STORAGE_SESSION_CHECK_SERVER_INTEGRITY,
          //   maxRetriesPerRequest: 3, // Override: NUXT_STOREFRONT_STORAGE_SESSION_MAX_RETRIES_PER_REQUEST,
          // },
        }
      })(),
      /** [OPTIONAL] Storefront Core - Internal cache behaviour configurations
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#cache */
      cache: {
        auth: {
          username: '', // Override: NUXT_STOREFRONT_CACHE_AUTH_USERNAME
          password: '', // Override: NUXT_STOREFRONT_CACHE_AUTH_PASSWORD
        },
        enabled: true, // Override: NUXT_STOREFRONT_CACHE_ENABLED
      },
      /** [OPTIONAL] Storefront Core - `with` Parameter
       * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#with-parameters */
      withParams, // Previous withParams keys are Overrideable using prefix NUXT_PUBLIC_WITH_PARAMS_
    },
    // Following keys are Overrideable using prefix NUXT_PUBLIC_
    public: {
      shopName: 'SCAYLE',
      storefront: {
        /** Storefront Core - Internal logger configuration
         * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#log */
        log: {
          name: 'storefront-boilerplate-nuxt', // Override: NUXT_PUBLIC_STOREFRONT_LOG_NAME
          level: 'debug', // Override: NUXT_PUBLIC_STOREFRONT_LOG_LEVEL
        },
      },

      cms: {
        host: process.env.NUXT_PUBLIC_CMS_HOST,
        accessToken: process.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN,
        previewHost: process.env.NUXT_PUBLIC_CMS_PREVIEW_HOST,
        previewAccessToken: process.env.NUXT_PUBLIC_CMS_PREVIEW_TOKEN,
        space: process.env.NUXT_PUBLIC_CMS_SPACE,
      },
      /** Nuxt - Base URL
       * https://nuxt.com/docs/api/nuxt-config#baseurl */
      baseUrl: process.env.BASE_URL, // Override: NUXT_PUBLIC_BASE_URL

      // Override: NUXT_PUBLIC_CDN_URL
      cdnUrl: '',

      // Override: NUXT_PUBLIC_GOOGLE_MAPS_API_KEY
      googleMapsApiKey: '',

      /** Storefront Boilerplate - Tracking Event Order
       * Used in: `templates/nuxt/plugins/01.tracking.ts` */
      trackingEventOrder: [
        'shop_init',
        'customer_data',
        'content_view',
        'cart',
        'wishlist',
        'view_cart',
        'select_item',
        'remove_from_cart',
        'add_to_cart',
        'remove_from_wishlist',
        'add_to_wishlist',
        'view_item_list',
        'view_item',
        'purchase',
        'view_promotion',
      ],
      /** nuxt-gtm Module Runtime Configuration
       * see `./modules/gtm/README.md` */
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID ?? '', // Override: NUXT_PUBLIC_GTM_ID
        debug: false, // Override: NUXT_PUBLIC_GTM_DEBUG
      },

      appEnv: process.env.APP_ENV, // Override: NUXT_PUBLIC_APP_ENV,

      subscription: {
        overviewWebHost: '', // Override: NUXT_PUBLIC_SUBSCRIPTION_OVERVIEW_WEB_HOST
        cancellationWebHost: '', // Override: NUXT_PUBLIC_SUBSCRIPTION_OVERVIEW_WEB_HOST
        apiUrl: '', // Override: NUXT_PUBLIC_SUBSCRIPTION_API_URL
      },
    },
  },

  /**
   * NOTE: Configuration outside of runtimeConfig is being filled in during
   * build time and will be serialized as part of the bundling process.
   * Execution of functions, etc during runtime is not possible.
   */

  // https://nuxt.com/docs/api/nuxt-config#app
  app: {
    // https://nuxt.com/docs/api/nuxt-config#head
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
      ],
      htmlAttrs: {
        style: 'scroll-behavior: smooth;', // Used for adding smooth scrolling to every page
      },
    },
  },

  // https://nuxt.com/docs/api/nuxt-config#css
  css: ['~/assets/css/main.css'],

  // https://nuxt.com/docs/api/nuxt-config#postcss
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    exposeConfig: true,
  },

  // https://nuxt.com/docs/api/nuxt-config#modules-1
  modules: [
    // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction
    '@scayle/storefront-nuxt/module',
    // https://scayle.dev/en/storefront-guide/developer-guide/integrations/omnichannel
    // https://scayle.dev/en/extensions/omnichannel/user-guide
    '@scayle/omnichannel-nuxt/module',
    // https://tailwindcss.nuxtjs.org/
    '@nuxtjs/tailwindcss',
    // https://github.com/cpsoinos/nuxt-svgo
    'nuxt-svgo',
    // https://fonts.nuxt.com/get-started/usage
    '@nuxt/fonts',
    // https://image.nuxt.com/
    '@nuxt/image',
    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    // https://github.com/vueuse/vueuse/tree/main/packages/nuxt
    '@vueuse/nuxt',
    // https://github.com/cpreston321/nuxt-swiper
    'nuxt-swiper',
    // https://nuxt.com/docs/getting-started/testing
    '@nuxt/test-utils/module',
    // https://eslint.nuxt.com/packages/module
    '@nuxt/eslint',
    // Based on https://github.com/antfu/nuxt-eslint-auto-explicit-import
    './modules/eslint-auto-explicit-import',
    // https://scayle.dev/en/storefront-guide/developer-guide/integrations/open-telemetry
    '@scayle/nuxt-opentelemetry',
    // SCAYLE Storefront Feature Packages
    '@scayle/storefront-country-detection',
    '@scayle/storefront-product-detail',
    '@scayle/storefront-product-listing',
    '@scayle/storefront-promotions',
    '@scayle/storefront-search',
    '@scayle/storefront-navigation',
    '@scayle/nuxt-image-provider',
  ],

  // Storefront CMS Module (local)
  cms: {
    // @ts-expect-error provider here expects either `storyblok`, `contentful` or 'scayle' but the env variable is typed as string
    provider: process.env.CMS_PROVIDER ?? 'scayle',
  },

  // https://nuxt.com/docs/api/nuxt-config#build
  build: {
    // https://nuxt.com/docs/api/nuxt-config#transpile
    transpile: ['@scayle/storefront-nuxt'],
  },

  // Storefront Buildtime Config
  storefront: {
    // Storefront Core - Custom RPC Methods
    // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/rpc-methods#overview
    rpcMethodNames: Object.keys(customRpcMethods), // NOT OVERRIDABLE AT RUNTIME

    // RPC Methods from the Storefront Core which are overridden by the project.
    rpcMethodOverrides: [],
  },

  'storefront-ui': {
    breakpoints: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      xxl: breakpoints['2xl'],
    },
  },

  // https://github.com/cpsoinos/nuxt-svgo/blob/main/README.md#usage
  svgo: {
    autoImportPath: './assets/icons',
    defaultImport: 'component',
    componentPrefix: 'Icon',
  },

  // https://fonts.nuxt.com/get-started/configuration
  fonts: {
    assets: {
      // The baseURL where font files are served.
      prefix: '/_fonts/',
    },
  },

  // https://image.nuxt.com/get-started/configuration
  image: {
    providers: {
      scayle: {
        name: 'scayle',
        provider: '@scayle/nuxt-image-provider',
      },
    },
    screens: {
      ...breakpoints,
      xxl: breakpoints['2xl'],
    },
  },

  experimental: {
    cookieStore: true,
  },

  // https://i18n.nuxtjs.org/docs/getting-started
  // https://i18n.nuxtjs.org/docs/guide/migrating#upgrading-from-nuxtjsi18n-v8x-to-v9x
  i18n: {
    locales,
    differentDomains: DOMAIN_PER_LOCALE,
    detectBrowserLanguage: false,
    defaultLocale: i18nDefaultLocale,
    lazy: true,
    strategy: getI18nStrategy(),
  },

  // https://github.com/cpreston321/nuxt-swiper#usage
  swiper: {
    prefix: 'Swiper',
    modules: ['navigation', 'autoplay', 'pagination'],
  },

  opentelemetry: {
    enabled: stringToBoolean(process.env.OTEL_ENABLED),
    pathBlocklist: '^(/.*)?/api/up',
    pathReplace: [`^/(${locales.map((l) => l.code).join('|')})/`, '/:locale/'],
    requestHeaders: [
      'x-shop-id',
      'content-type',
      'content-length',
      'accept',
      'referer',
      'host',
    ],
    responseHeaders: ['content-type', 'content-length'],
  },

  // https://nuxt.com/docs/api/nuxt-config#imports
  imports: {
    // https://nuxt.com/docs/guide/concepts/auto-imports#disabling-auto-imports
    autoImport: false,
    dirs: [],
    scan: false,
  },

  vueuse: {
    autoImports: false,
  },

  components: {
    dirs: [],
    global: false,
  },

  // https://nuxt.com/docs/api/nuxt-config#vue-1
  vue: {
    // https://nuxt.com/docs/api/nuxt-config#compileroptions-1
    compilerOptions: {
      isCustomElement: (tag) => tag === 'scayle-checkout',
    },
  },

  // https://nuxt.com/docs/api/nuxt-config#devserver
  devServer: {
    // https://nuxt.com/docs/api/nuxt-config#https
    https:
      !process.env.HTTPS_KEY || !process.env.HTTPS_CERT
        ? false
        : {
            key: process.env.HTTPS_KEY,
            cert: process.env.HTTPS_CERT,
          },
  },

  // https://nuxt.com/docs/api/nuxt-config#ignore
  ignore: [
    '.DS_Store',
    '**/.changeset',
    '**/playwright',
    '**/docs',
    '**/test',
    '**/modules/cms/providers/contentful/types/gen',
  ],

  // Page Caching
  // https://nuxt.com/docs/api/nuxt-config#routerules-1
  // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  // https://nitro.unjs.io/guide/cache#route-rules
  routeRules: (() => {
    // Allow for disabling the SSR Cache via an environment flag
    if (stringToBoolean(process.env.PAGE_CACHE_DISABLED)) {
      return {}
    }

    // Vercel deployments have a different caching set-up
    // There we use cache headers plus Incremental Static Regeneration (ISR)
    // https://vercel.com/docs/incremental-static-regeneration
    // For other environments we set the cache headers and also rely on the Nitro page cache
    const CACHE_PAGE: NitroRouteConfig = isVercel
      ? {
          isr: true,
          cache: {
            maxAge: 10 * 60, // Default: 10min
            staleMaxAge: 10 * 60, // Default: 10min
            headersOnly: true,
          },
        }
      : {
          cache: {
            // SWR currently leads to some bugs in the Nitro caching implementation that it will continue to serve outdated data in case the SSR handler crashes
            // We recommend to keep this disabled currently.
            swr: false, // Disable stale-while-revalidate
            maxAge: 10 * 60, // Default: 10min
            staleMaxAge: 10 * 60, // Default: 10min
            group: 'ssr', // Cache group name
            name: 'page', // Set prefix name

            // Consider the host for the cache key which is required when using domain based shops
            varies: ['host', 'x-forwarded-host'],

            // Add the version as an integrity so we clear our cache when a new version gets deployed.
            // If no specific version is supplied, we will generate a unique ID during the build process.
            integrity: process.env.VERSION ?? nanoid(8),

            // Use storefront storage mount
            // Depending on your configuration this might be `redis` or another database driver
            // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage
            base: 'storefront-cache',
          },
        }

    const NO_CACHE: NitroRouteConfig = isVercel
      ? { isr: false, cache: false }
      : { swr: false, cache: false }

    // Default routeRules for using SWR and `storefront-cache` storage for page caching setup
    return DOMAIN_PER_LOCALE
      ? {
          // Cache most pages by default
          '/**': CACHE_PAGE,
          // Don't cache API routes.
          '/api/**': NO_CACHE,
          // Don't cache pages with user-specific information
          '/wishlist': NO_CACHE,
          '/basket': NO_CACHE,
          '/checkout': NO_CACHE,
          '/signin': NO_CACHE,
          '/signin/callback': NO_CACHE,
          '/account': NO_CACHE,
          '/account/**': NO_CACHE,
        }
      : locales.reduce(
          (rules: NitroRouteRules, locale) => {
            const newRules: NitroRouteRules = {
              ...rules,
              [`/${locale.code}`]: CACHE_PAGE, // home page
              [`/${locale.code}/**`]: CACHE_PAGE, // other pages
              // Don't cache API routes.
              [`/${locale.code}/api/**`]: NO_CACHE,
              // Don't cache pages with user-specific information
              [`/${locale.code}/wishlist`]: NO_CACHE,
              [`/${locale.code}/basket`]: NO_CACHE,
              [`/${locale.code}/checkout`]: NO_CACHE,
              [`/${locale.code}/signin`]: NO_CACHE,
              [`/${locale.code}/signin/callback`]: NO_CACHE,
              [`/${locale.code}/account`]: NO_CACHE,
              [`/${locale.code}/account/**`]: NO_CACHE,
            }
            return newRules
          },
          {
            // Cache most pages by default
            '/**': CACHE_PAGE,
            // Don't cache API routes.
            '/api/**': NO_CACHE,
            // Don't cache pages with user-specific information
            '/wishlist': NO_CACHE,
            '/basket': NO_CACHE,
            '/checkout': NO_CACHE,
            '/signin': NO_CACHE,
            '/signin/callback': NO_CACHE,
            '/account': NO_CACHE,
            '/account/**': NO_CACHE,
          },
        )
  })(),

  // The production build does not work when linking (dev mode is fine)
  // This workaround resolves the issue:
  // https://github.com/vitejs/vite/issues/11657#issuecomment-1385932066
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },

  hooks: {
    'nitro:init'(nitro) {
      // This hook enables build-time configuration logging, controlled by the feature flag CONFIG_LOG_BUILD_ENABLED.
      if (stringToBoolean(process.env.CONFIG_LOG_BUILD_ENABLED)) {
        const configToPrint = stringToBoolean(
          process.env.CONFIG_LOG_PRETTIER_ENABLED,
        )
          ? JSON.stringify(nitro.options.runtimeConfig, null, 2)
          : JSON.stringify(nitro.options.runtimeConfig)

        console.log(
          '[storefront-boilerplate] runtimeConfig after nitro initialization:',
          configToPrint,
        )
      }
    },
  },

  nitro: {
    vercel: {
      functions: {
        // Default to the latest Node LTS
        runtime: 'nodejs22.x',
      },
    },
  },

  optimization: {
    keyedComposables: [
      { name: 'useProductDetails', argumentLength: 1 },
      { name: 'useOrders', argumentLength: 1 },
      { name: 'usePromotionGifts', argumentLength: 2 },
      { name: 'useSubscription', argumentLength: 4 },
    ],
  },
})
