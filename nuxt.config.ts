import path from 'path'
import {
  storefrontRuntimeConfigPrivate,
  storefrontRuntimeConfigPublic,
  storefrontBuildtimeConfig,
} from './config/storefront'
import breakpoints from './config/breakpoints'

const isProd = process.env.NODE_ENV === 'production'

const domains = {
  en: process.env.NUXT_STOREFRONT_STORES_1028_DOMAIN!,
  de: process.env.NUXT_STOREFRONT_STORES_1001_DOMAIN!,
  'de-at': process.env.NUXT_STOREFRONT_STORES_1018_DOMAIN!,
  'de-ch': process.env.NUXT_STOREFRONT_STORES_1019_DOMAIN!,
  default: process.env.NUXT_STOREFRONT_DOMAIN_DEFAULT!,
}

const DOMAIN_PER_LOCALE = false

const DE_DOMAIN_FILE = 'de-DE.json'

const locales = [
  {
    code: 'en',
    iso: 'en-GB',
    // TODO: Investigate runtimeConfig behaviour, as we want build independence
    domain: DOMAIN_PER_LOCALE ? domains.en : domains.default,
    file: 'en-GB.json',
  },
  {
    code: 'de',
    iso: 'de-DE',
    // TODO: Investigate runtimeConfig behaviour, as we want build independence
    domain: DOMAIN_PER_LOCALE ? domains.de : domains.default,
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'at',
    iso: 'de-AT',
    // TODO: Investigate runtimeConfig behaviour, as we want build independence
    domain: DOMAIN_PER_LOCALE ? domains['de-at'] : domains.default,
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'ch',
    iso: 'de-CH',
    // TODO: Investigate runtimeConfig behaviour, as we want build independence
    domain: DOMAIN_PER_LOCALE ? domains['de-ch'] : domains.default,
    file: DE_DOMAIN_FILE,
  },
]

export default defineNuxtConfig({
  devtools: { enabled: true },
  telemetry: false,

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    // Following keys are Overrideable using prefix NUXT_CHECKOUT_
    checkout: {
      accessHeader: undefined, // Override: NUXT_CHECKOUT_ACCESS_HEADER
    },
    // Following keys are Overrideable using prefix NUXT_STORYBLOK_
    storyblok: {
      accessToken: process.env.NUXT_STORYBLOK_ACCESS_TOKEN, // Override: NUXT_STORYBLOK_ACCESS_TOKEN
      webhookSecret: '', // Override: NUXT_STORYBLOK_WEBHOOK_SECRET,
    },
    // Following keys are Overrideable using prefix NUXT_$STOREFRONT_
    storefront: storefrontRuntimeConfigPrivate as any, // TODO: Extend SFC runtimeConfig type
    // Following keys are Overrideable using prefix NUXT_PUBLIC_
    public: {
      domains,
      baseUrl: process.env.BASE_URL, // Override: NUXT_PUBLIC_BASE_URL
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
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID,
        debug: !isProd,
      },
      // Following keys are Overrideable using prefix NUXT_PUBLIC_
      ...(storefrontRuntimeConfigPublic as any), // TODO: Extend SFC runtimeConfig type
    },
  },

  // NOTE: Configuration outside of runtimeConfig is being filled in during
  // build time and will be serialized as part of the bundling process.
  // Execution of functions, etc during runtime is not possible.
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@scayle/storefront-nuxt/module',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-lazy-hydrate',
    'nuxt-jsonld',
    '@vueuse/nuxt',
    'nuxt-swiper',
    'radash-nuxt',
    '@storyblok/nuxt',
    'nuxt-viewport',
    '@zadigetvoltaire/nuxt-gtm',
  ],

  storefront: storefrontBuildtimeConfig,

  // https://github.com/storyblok/storyblok-nuxt#options
  storyblok: {
    bridge: true,
    accessToken: process.env.NUXT_STORYBLOK_ACCESS_TOKEN,
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
        options: { baseURL: 'https://brb-demo.cdn.aboutyou.cloud/' },
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
    differentDomains: false,
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
  imports: {
    dirs: ['./constants', './storyblok/composables'],
  },

  // Allow auto-import for vue components
  components: [
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ay-'),
    },
  },

  devServer: {
    https: {
      key: path.resolve(__dirname, process.env.HTTPS_KEY || ''),
      cert: path.resolve(__dirname, process.env.HTTPS_CERT || ''),
    },
  },
})
