import type { NuxtConfig } from 'nuxt/schema'
import yn from 'yn'
import {
  storefrontRuntimeConfigPrivate,
  storefrontRuntimeConfigPublic,
  storefrontBuildtimeConfig,
} from './config/storefront'
import breakpoints from './config/breakpoints'

const domains = {
  default: process.env.NUXT_STOREFRONT_DOMAIN_DEFAULT!,
  de: process.env.NUXT_STOREFRONT_STORES_1001_DOMAIN!,
  'de-at': process.env.NUXT_STOREFRONT_STORES_1018_DOMAIN!,
  'de-ch': process.env.NUXT_STOREFRONT_STORES_1019_DOMAIN!,
  en: process.env.NUXT_STOREFRONT_STORES_1028_DOMAIN!,
}

type NitroRouteConfig = NuxtConfig['routeRules']

const DOMAIN_PER_LOCALE = yn(process.env.DOMAIN_PER_LOCALE)

const DE_DOMAIN_FILE = 'de-DE.json'

const locales = [
  {
    code: 'de',
    iso: 'de-DE',
    domain: DOMAIN_PER_LOCALE ? domains.de : domains.default,
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'at',
    iso: 'de-AT',
    domain: DOMAIN_PER_LOCALE ? domains['de-at'] : domains.default,
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'ch',
    iso: 'de-CH',
    domain: DOMAIN_PER_LOCALE ? domains['de-ch'] : domains.default,
    file: DE_DOMAIN_FILE,
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

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    // Following keys are Overrideable using prefix NUXT_CHECKOUT_
    checkout: {
      accessHeader: undefined, // Override: NUXT_CHECKOUT_ACCESS_HEADER
    },
    // https://scayle.dev/en/dev/storefront-core/module-configuration
    storefront: storefrontRuntimeConfigPrivate as any,
    // Following keys are Overrideable using prefix NUXT_PUBLIC_
    public: {
      ...(storefrontRuntimeConfigPublic as any),
      domains,
      /** Nuxt - Base URL
       * https://nuxt.com/docs/api/nuxt-config#baseurl */
      baseUrl: process.env.BASE_URL, // Override: NUXT_PUBLIC_BASE_URL

      /** Storefront Boilerplate - Tracking Event Order
       * Used in: templates/nuxt/plugins/01.tracking.ts */
      trackingEventOrder: [
        'shop_init',
        'customer_data',
        'view_cart',
        'select_item',
        'content_view',
        'remove_from_cart',
        'add_to_cart',
        'cart',
        'remove_from_wishlist',
        'add_to_wishlist',
        'wishlist',
        'view_item_list',
        'view_item',
        'purchase',
      ],
      /** nuxt-gtm Module Runtime Configuration
       * https://github.com/zadigetvoltaire/nuxt-gtm#readme */
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID, // Override: NUXT_PUBLIC_GTM_ID
        debug: process.env.NUXT_PUBLIC_GTM_DEBUG, // Override: NUXT_PUBLIC_GTM_DEBUG
      },
      /** Storyblok Runtime Configuration
       * https://scayle.dev/en/dev/storefront-core/module-configuration */
      storyblok: {
        accessToken: '', // Override: NUXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
        webhookSecret: '', // Override: NUXT_PUBLIC_STORYBLOK_WEBHOOK_SECRET,
      },

      appEnv: process.env.APP_ENV, // Override: NUXT_PUBLIC_APP_ENV,
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
    '@scayle/storefront-nuxt/module',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-jsonld',
    '@vueuse/nuxt',
    'nuxt-swiper',
    'radash-nuxt',
    '@storyblok/nuxt',
    'nuxt-viewport',
    '@zadigetvoltaire/nuxt-gtm',
    'nuxt-vitest',
  ],

  // https://nuxt.com/docs/api/nuxt-config#build
  build: {
    // https://nuxt.com/docs/api/nuxt-config#transpile
    transpile: ['@scayle/storefront-nuxt'],
  },

  // https://scayle.dev/en/dev/storefront-core/build-configuration
  storefront: storefrontBuildtimeConfig,

  // https://github.com/storyblok/storyblok-nuxt#options
  storyblok: {
    bridge: true,
  },

  // https://github.com/cpsoinos/nuxt-svgo/blob/main/README.md#usage
  svgo: {
    autoImportPath: './assets/icons',
    defaultImport: 'component',
    componentPrefix: 'Icon',
  },

  // https://image.nuxt.com/get-started/configuration
  image: {
    domains: ['https://a.storyblok.com'],
    storyblok: {
      baseURL: 'https://a.storyblok.com',
      modifiers: {
        // set default quality as modifier. This will force also storyblok to use webp if the client supports it.
        // Setting the format via the format modifier will force the format even when it's not supported by the client.
        quality: '85',
      },
    },
    provider: 'default',
    providers: {
      default: {
        name: 'default',
        provider: '~/providers/default',
        options: {
          baseURL:
            process.env.NUXT_PUBLIC_IMAGE_BASE_URL ??
            'https://brb-demo.cdn.aboutyou.cloud/',
        },
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
    defaultLocale: 'en',
    langDir: 'langs/',
    lazy: true,
    strategy: 'prefix',
    vueI18n: 'vue-i18n.config.ts',
  },

  // https://github.com/cpreston321/nuxt-swiper#usage
  swiper: {
    prefix: 'Swiper',
    modules: ['navigation', 'autoplay', 'pagination'],
  },

  // https://github.com/mvrlin/nuxt-viewport#usage
  viewport: {
    breakpoints,
    defaultBreakpoints: Object.fromEntries(
      Object.keys(breakpoints).map((name) => [name, name]),
    ),
    fallbackBreakpoint: 'lg',
  },

  // https://nuxt.com/docs/api/nuxt-config#imports
  imports: {
    // https://nuxt.com/docs/api/nuxt-config#dirs
    dirs: ['./constants', './storyblok/composables'],
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
      isCustomElement: (tag) => tag.startsWith('ay-'),
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
    // Vercel-specific routeRules for using ISR with Vercel CDN as page caching setup
    if (
      process.env.NITRO_PRESET &&
      process.env.NITRO_PRESET.includes('vercel')
    ) {
      // Disable routeRules for Vercel edge
      if (process.env.NITRO_PRESET === 'vercel_edge') {
        return {}
      }
      // We need some different route definitions for vercel which uses a regex syntax when you want to match `**/`
      return {
        // Page generated on-demand, revalidates in background
        '/**': { isr: true },
        // Don't cache API routes.
        '.*/api/**': { isr: false },
        // Don't cache pages with user-specific information
        '.*/wishlist': { isr: false },
        '.*/basket': { isr: false },
        '.*/checkout': { isr: false },
        '.*/signin': { isr: false },
        '.*/account/**': { isr: false },
        '.*/orders/**': { isr: false },
      }
    }

    // Page generated on-demand, revalidates in background
    const CACHE_PAGE = {
      cache: {
        swr: true, // Enable stale-while-revalidate
        maxAge: 10 * 60, // Default: 10min
        staleMaxAge: 10 * 60, // Default: 10min
        group: 'ssr', // Cache group name
        name: 'page', // Set prefix name
        // Use storefront storage mount
        // Depending on your configuration this might be `redis` or another database driver
        // https://scayle.dev/en/dev/storefront-core/module-configuration#storage
        base: 'storefront-cache',
      },
    } as const

    const NO_CACHE = { swr: false, cache: false } as const

    if (process.env.DISABLE_SSR_CACHE === 'true') {
      return {}
    }

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
          '/account/*': NO_CACHE,
          '/orders/*': NO_CACHE,
        }
      : locales.reduce(
          (rules: NitroRouteConfig, locale) => {
            const newRules: NitroRouteConfig = {
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
              [`/${locale.code}/account/*`]: NO_CACHE,
              [`/${locale.code}/orders/*`]: NO_CACHE,
            }
            return newRules
          },
          {
            '/api/**': NO_CACHE, // Top-level API routes, like /api/up
          },
        )
  })(),
})
