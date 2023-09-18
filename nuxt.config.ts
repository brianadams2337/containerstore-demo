import path from 'path'
import environment from './environment'
import {
  i18n,
  image,
  svgo,
  swiper,
  viewport,
  storefrontRuntimeConfigPrivate,
  storefrontRuntimeConfigPublic,
  storefrontBuildtimeConfig,
  storyblokRuntimeConfigPrivate,
} from './config'
import { domains } from './config/domains'

export default defineNuxtConfig({
  devtools: { enabled: true },
  telemetry: false,

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    // Following keys are overridable using prefix NUXT_CHECKOUT_
    checkout: {
      accessHeader: environment.CHECKOUT_ACCESS_HEADER,
    },
    // Following keys are overridable using prefix NUXT_STORYBLOK_
    storyblok: storyblokRuntimeConfigPrivate,
    // Following keys are overridable using prefix NUXT_$STOREFRONT_
    $storefront: storefrontRuntimeConfigPrivate as any, // TODO: Extend SFC runtimeConfig type
    // Following keys are overridable using prefix NUXT_PUBLIC_
    public: {
      domains,
      gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
      baseUrl: process.env.BASE_URL,
      // Following keys are overridable using prefix NUXT_PUBLIC_
      ...storefrontRuntimeConfigPublic as any,  // TODO: Extend SFC runtimeConfig type
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

  plugins: ['~/plugins/validation', '~/plugins/toast'],

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
    'nuxt-radash',
    '@storyblok/nuxt',
    'nuxt-viewport',
  ],

  storyblok: {
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
  },
  storefront: storefrontBuildtimeConfig,
  svgo,
  image,
  i18n,
  swiper,
  viewport,

  // Allow auto-import for vue components
  components: [
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

  // Explicitly add storefront-related dependencies to be pre-bundled by vite
  // NOTE: Can be removed with next SFC version, as this is now part of the
  // SFC module setup!
  vite: {
    optimizeDeps: {
      include: [
        '@scayle/storefront-nuxt',
        '@scayle/storefront-core',
        'isomorphic-dompurify',
        'slugify',
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ay-'),
    },
  },
  devServer: {
    https: {
      key: path.resolve(__dirname, environment.HTTPS_KEY),
      cert: path.resolve(__dirname, environment.HTTPS_CERT),
    },
  },
})
