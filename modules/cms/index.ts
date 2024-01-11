import { defineNuxtModule } from '@nuxt/kit'
import { setupStoryblok } from './providers/storyblok/setup'
import type { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@storefront/cms',
    configKey: 'cms',
    version: '0.0.1',
    compatibility: {
      bridge: false,
      nuxt: '>=3.9',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    provider: 'storyblok',
  },
  async setup(options, nuxt) {
    if (options.provider === 'storyblok') {
      await setupStoryblok(options, nuxt)
    }
  },
})
