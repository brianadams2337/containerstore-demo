import { i18n, image, svgo, swiper, storefront } from './config'

export default defineNuxtConfig({
  devtools: { enabled: true },
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
    'nuxt-lodash',
  ],
  storefront,
  svgo,
  image,
  i18n,
  swiper,
  components: {
    global: true,
    dirs: [{ path: '~/components', pathPrefix: false, extensions: ['.vue'] }],
  },
})
