import { defineNuxtModule } from '@nuxt/kit'
import { setupStoryblok } from './providers/storyblok/setup'
import type { ModuleOptions } from './types'
import { isProviderStoryblok } from './utils/helpers'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-cms',
    configKey: 'cms',
    version: '1.0.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.9',
    },
  },
  defaults: {
    provider: 'storyblok',
  },
  async setup(options, nuxt) {
    if (isProviderStoryblok(options)) {
      await setupStoryblok(options, nuxt)
    }
  },
})
