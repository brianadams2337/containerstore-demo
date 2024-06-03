import type { NuxtConfig } from 'nuxt/schema'
import yn from 'yn'
import { nanoid } from 'nanoid'
import {
  storefrontBuildtimeConfig,
  storefrontRuntimeConfigPrivate,
  storefrontRuntimeConfigPublic,
} from './config/storefront'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    cdnUrl: string
    googleMapsApiKey: string
  }
}

const domains = {
  default: process.env.DOMAIN_DEFAULT!,
  de: process.env.NUXT_STOREFRONT_STORES_1001_DOMAIN!,
  'de-at': process.env.NUXT_STOREFRONT_STORES_1018_DOMAIN!,
  'de-ch': process.env.NUXT_STOREFRONT_STORES_1019_DOMAIN!,
  en: process.env.NUXT_STOREFRONT_STORES_1028_DOMAIN!,
}

type NitroRouteRules = Required<NuxtConfig>['routeRules']
type NitroRouteConfig = NitroRouteRules extends Record<any, infer Value>
  ? Value
  : never

const DOMAIN_PER_LOCALE = yn(process.env.DOMAIN_PER_LOCALE)

const locales = [
  {
    code: 'de',
    iso: 'de-DE',
    domain: DOMAIN_PER_LOCALE ? domains.de : domains.default,
    file: 'de-DE.json',
  },
  {
    code: 'at',
    iso: 'de-AT',
    domain: DOMAIN_PER_LOCALE ? domains['de-at'] : domains.default,
    file: 'de-DE.json',
  },
  {
    code: 'ch',
    iso: 'de-CH',
    domain: DOMAIN_PER_LOCALE ? domains['de-ch'] : domains.default,
    file: 'de-DE.json',
  },
  {
    code: 'en',
    iso: 'en-GB',
    domain: DOMAIN_PER_LOCALE ? domains.en : domains.default,
    file: 'en-GB.json',
  },
]

export default defineNuxtConfig({
  // https://nuxt.com/docs/api/nuxt-config#devtools
  devtools: { enabled: true },

  // https://nuxt.com/docs/api/nuxt-config#telemetry
  telemetry: false,

  // https://nuxt.com/docs/api/nuxt-config#debug
  debug: yn(process.env.ENABLE_NUXT_DEBUGGING),

  // https://nuxt.com/blog/v3-10#bundler-module-resolution
  // Some dependencies are currently not yet compatible with `moduleResolution: bundler`:
  // - nuxt-gtm
  future: {
    typescriptBundlerResolution: false,
  },

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    // Following keys are Overrideable using prefix NUXT_CHECKOUT_
    checkout: {
      accessHeader: undefined, // Override: NUXT_CHECKOUT_ACCESS_HEADER
    },
    // Configuration for the omnichannel add-on
    omnichannel: {
      apiToken: '', // Override: NUXT_OMNICHANNEL_API_TOKEN
      apiHost: '', // Override: NUXT_OMNICHANNEL_API_HOST
    },
    // https://scayle.dev/en/dev/storefront-core/module-configuration
    storefront: storefrontRuntimeConfigPrivate as any,
    // Following keys are Overrideable using prefix NUXT_PUBLIC_
    public: {
      storefront: storefrontRuntimeConfigPublic as any,
      domains,
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
       * Used in: templates/nuxt/plugins/01.tracking.ts */
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
       * https://github.com/zadigetvoltaire/nuxt-gtm#readme */
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID ?? '', // Override: NUXT_PUBLIC_GTM_ID
        debug: false, // Override: NUXT_PUBLIC_GTM_DEBUG
      },
      /** Storyblok Runtime Configuration
       * https://scayle.dev/en/dev/storefront-core/module-configuration */
      storyblok: {
        accessToken: '', // Override: NUXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
        bridge: true, // Override: NUXT_PUBLIC_STORYBLOK_BRIDGE
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

  // https://nuxt.com/docs/api/nuxt-config#modules-1
  modules: [
    // https://scayle.dev/en/storefront-guide
    '@scayle/storefront-nuxt/module',
    // https://scayle.dev/en/storefront-guide/integrations/omnichannel
    '@scayle/omnichannel-nuxt/module',
    // https://tailwindcss.nuxtjs.org/
    '@nuxtjs/tailwindcss',
    // https://github.com/cpsoinos/nuxt-svgo
    'nuxt-svgo',
    // https://image.nuxt.com/
    '@nuxt/image',
    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    // https://github.com/ymmooot/nuxt-jsonld
    'nuxt-jsonld',
    // https://github.com/vueuse/vueuse/tree/main/packages/nuxt
    '@vueuse/nuxt',
    // https://github.com/cpreston321/nuxt-swiper
    'nuxt-swiper',
    // https://github.com/zadigetvoltaire/nuxt-gtm
    '@zadigetvoltaire/nuxt-gtm',
    // https://nuxt.com/docs/getting-started/testing
    '@nuxt/test-utils/module',
    // https://eslint.nuxt.com/packages/module
    '@nuxt/eslint',
    // Based on https://github.com/antfu/nuxt-eslint-auto-explicit-import
    './modules/eslint-auto-explicit-import',
  ],

  // Storefront CMS Module (local)
  cms: {
    // @ts-expect-error provider here expects either `storyblok` or `contentful` but the env variable is typed as string
    provider: process.env.CMS_PROVIDER ?? 'storyblok',
  },

  // https://nuxt.com/docs/api/nuxt-config#build
  build: {
    // https://nuxt.com/docs/api/nuxt-config#transpile
    transpile: ['@scayle/storefront-nuxt'],
  },

  // https://scayle.dev/en/dev/storefront-core/build-configuration
  storefront: storefrontBuildtimeConfig,

  // https://github.com/cpsoinos/nuxt-svgo/blob/main/README.md#usage
  svgo: {
    autoImportPath: './assets/icons',
    defaultImport: 'component',
    componentPrefix: 'Icon',
  },

  // https://image.nuxt.com/get-started/configuration
  image: {
    provider: 'default',
    providers: {
      default: {
        name: 'default',
        provider: '~/providers/default',
      },
    },
    intersectOptions: { rootMargin: '50px' },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
  },

  // https://v8.i18n.nuxtjs.org/getting-started/basic-usage
  i18n: {
    locales,
    differentDomains: DOMAIN_PER_LOCALE,
    detectBrowserLanguage: false,
    defaultLocale: 'de',
    langDir: 'langs/',
    lazy: true,
    strategy: 'prefix_except_default',
    vueI18n: 'vue-i18n.config.ts',
  },

  // https://github.com/cpreston321/nuxt-swiper#usage
  swiper: {
    prefix: 'Swiper',
    modules: ['navigation', 'autoplay', 'pagination'],
  },

  opentelemetry: {
    enabled: yn(process.env.OTEL_ENABLED),
    pathBlocklist: '^(/.*)?/api/up',
    pathReplace: [`^/(${locales.map((l) => l.code).join('|')})/`, '/:locale/'],
  },

  // https://nuxt.com/docs/api/nuxt-config#imports
  imports: {
    // https://nuxt.com/docs/api/nuxt-config#dirs
    dirs: ['./constants'],
    // https://nuxt.com/docs/guide/concepts/auto-imports#disabling-auto-imports
    autoImport: true,
  },

  // Allow auto-import for vue components
  // https://nuxt.com/docs/api/nuxt-config#components
  components: [
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

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

  // Page Caching
  // https://nuxt.com/docs/api/nuxt-config#routerules-1
  // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  // https://nitro.unjs.io/guide/cache#route-rules
  routeRules: (() => {
    // Allow for disabling the SSR Cache via an environment flag
    if (yn(process.env.DISABLE_PAGE_CACHE)) {
      return {}
    }

    // Vercel-specific routeRules for using ISR with Vercel CDN as page caching setup
    if (
      process.env.NITRO_PRESET &&
      process.env.NITRO_PRESET.includes('vercel')
    ) {
      // Disable route rules for any vercel deployment
      //
      // Vercel Edge currently doesn't work at all with route rules,
      // the normal Vercel Serverless function has some issues with caching + session handling
      // so we for now need to disable caching completely.
      return {}
    }

    // Page generated on-demand, revalidates in background
    const CACHE_PAGE: NitroRouteConfig = {
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
        // https://scayle.dev/en/dev/storefront-core/module-configuration#storage
        base: 'storefront-cache',
      },
    }

    const NO_CACHE: NitroRouteConfig = { swr: false, cache: false }

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
    build: {
      rollupOptions: {
        external: ['@nuxtjs/composition-api'], // Handle incompatible dependencies of Nuxt 2-compatible @scayle/omnichannel-nuxt package
      },
    },
  },

  hooks: {
    'nitro:init'(nitro) {
      // This hook enables build-time configuration logging, controlled by the feature flag ENABLE_CONFIG_LOG_BUILD.
      if (yn(process.env.ENABLE_CONFIG_LOG_BUILD)) {
        const configToPrint = yn(process.env.ENABLE_CONFIG_LOG_PRETTIER)
          ? JSON.stringify(nitro.options.runtimeConfig, null, 2)
          : JSON.stringify(nitro.options.runtimeConfig)

        console.log(
          '[storefront-boilerplate] runtimeConfig after nitro initialisation:',
          configToPrint,
        )
      }
    },
  },

  optimization: {
    keyedComposables: [
      { name: 'useProductDetails', argumentLength: 1 },
      { name: 'useOrders', argumentLength: 1 },
      { name: 'usePromotionGifts', argumentLength: 2 },
      { name: 'useSubscription', argumentLength: 4 },
      { name: 'useProductRecommendations', argumentLength: 2 },
    ],
  },
})
