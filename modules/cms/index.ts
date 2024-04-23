import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import {
  isProviderStoryblok,
  setupStoryblok,
} from './providers/storyblok/setup'
import {
  isProviderContentful,
  setupContentful,
} from './providers/contentful/setup'
import { moduleName, logger, formattedProvidersKeys } from './utils/helpers'
import type { ModuleOptions } from './types'
export type { ModuleOptions }
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: moduleName,
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
    const resolver = createResolver(import.meta.url)
    if (!options.provider) {
      logger.error(
        `\nYou must define a provider.\nSupported providers are: ${formattedProvidersKeys}!`,
      )
    }
    addImportsDir(resolver.resolve('./composables'))

    if (isProviderStoryblok(options)) {
      await setupStoryblok(options, nuxt)
    }
    if (isProviderContentful(options)) {
      await setupContentful(options, nuxt)
    }
  },
})
