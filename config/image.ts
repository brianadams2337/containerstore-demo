import { ModuleOptions } from '@nuxt/image'

const options: Partial<ModuleOptions> = {
  domains: ['https://a.storyblok.com'],
  storyblok: {
    baseURL: 'https://a.storyblok.com',
    modifiers: {
      // set default quality as modifier. This will force also storyblok to use webp if the client supports it.
      // Setting the format via the format modifier will force the format even when it's not supported by the client.
      quality: '85',
    },
  },
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
}

export default options
