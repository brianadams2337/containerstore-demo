// https://nuxt.com/docs/api/configuration/nuxt-config
import { i18n, image, svgo } from './config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: ['~/plugins/validation'],
  modules: [
    'nuxt-svgo',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-lazy-hydrate',
    'nuxt-jsonld',
    '@vueuse/nuxt',
    'nuxt-swiper',
  ],
  svgo,
  image,
  i18n,
  components: {
    global: true,
    dirs: [{ path: '~/components', pathPrefix: false, extensions: ['.vue'] }],
  },
  // use dedicated config file once type are exposed from the module https://github.com/cpreston321/nuxt-swiper/issues/82
  swiper: {
    prefix: 'Swiper',
    modules: ['navigation', 'autoplay', 'pagination'],
  },
})
