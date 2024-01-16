import { defineNuxtModule } from '@nuxt/kit'
import { setupStoryblok } from './providers/storyblok/setup'
import type { ModuleOptions } from './types'
import { isProviderContentful, isProviderStoryblok } from './utils/helpers'
import { setupContentful } from './providers/contentful/setup'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-cms',
    configKey: 'cms',
    version: '0.0.1',
    compatibility: {
      bridge: false,
      nuxt: '>=3.9',
    },
  },
  defaults: {
    provider: 'storyblok',
    accessToken: '',
  },
  async setup(options, nuxt) {
    if (isProviderStoryblok(options)) {
      await setupStoryblok(options, nuxt)
    }
    if (isProviderContentful(options)) {
      await setupContentful(options, nuxt)
    }
  },
})
