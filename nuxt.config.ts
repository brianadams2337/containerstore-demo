import path from 'path'
import environment from './environment'
import {
  i18n,
  image,
  svgo,
  swiper,
  viewport,
  storefront,
  storyblok,
} from './config'
import { domains } from './config/domains'

export default defineNuxtConfig({
  devtools: { enabled: true },
  telemetry: false,

  // Any key/value pair outside of the `public` key are private/server-side only
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    checkout: {
      accessHeader: environment.CHECKOUT_ACCESS_HEADER,
    },
    storyblok: {
      accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
    },
    public: {
      domains,
      gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
      baseUrl: process.env.BASE_URL,
    },
  },

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

  storefront: {
    ...storefront,
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      prefix: process.env.REDIS_PREFIX,
      user: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
    },
  },
  svgo,
  image,
  i18n,
  swiper,
  storyblok,
  viewport,

  components: [
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

  vite: {
    optimizeDeps: {
      include: ['@scayle/storefront-nuxt', '@scayle/storefront-core'],
    },
  },

  devServer: {
    https: {
      key: path.resolve(__dirname, environment.HTTPS_KEY),
      cert: path.resolve(__dirname, environment.HTTPS_CERT),
    },
  },
})
