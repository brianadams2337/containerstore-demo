import type { Nuxt } from 'nuxt/schema'
import { createResolver, addPlugin, addImportsDir } from '@nuxt/kit'
import type { ContentfulProvider } from './types'

export function setupContentful(options: ContentfulProvider, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  if (!nuxt.options.runtimeConfig.public.cms.accessToken) {
    throw new Error('Missing Contentful access token')
  }
  if (!nuxt.options.runtimeConfig.public.cms.space!) {
    throw new Error('Missing Contentful space')
  }

  addImportsDir(resolver.resolve('composables'))
  addPlugin(resolver.resolve('runtime/plugin'))
}
